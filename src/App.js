
import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [techEmail, setTechEmail] = useState("");
  const [briefEmail, setBriefEmail] = useState("");
  const [message, setMessage] = useState("");
  const [downloads, setDownloads] = useState({});
  const [images, setImages] = useState([]);
  const [techSummary, setTechSummary] = useState("");
  const [briefSummary, setBriefSummary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !techEmail || !briefEmail) {
      setMessage("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tech_email", techEmail);
    formData.append("brief_email", briefEmail);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData);
      setMessage(res.data.message);
      setDownloads({
        tech: res.data.tech_download_url,
        brief: res.data.brief_download_url,
      });
      setImages(res.data.images);
      setTechSummary(res.data.tech_summary || "");
      setBriefSummary(res.data.brief_summary || "");
    } catch (err) {
      setMessage("Upload failed. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simulation Report Uploader</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept=".docx" onChange={(e) => setFile(e.target.files[0])} className="block" />
        <input type="email" placeholder="Technical summary email" value={techEmail} onChange={(e) => setTechEmail(e.target.value)} className="w-full p-2 border rounded" />
        <input type="email" placeholder="Brief summary email" value={briefEmail} onChange={(e) => setBriefEmail(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload & Process</button>
      </form>

      {message && <p className="mt-4 text-lg font-medium">{message}</p>}

      {downloads.tech && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Download Summaries</h2>
          <a href={`http://localhost:8000${downloads.tech}`} className="text-blue-600 underline block">Download Technical PDF</a>
          <a href={`http://localhost:8000${downloads.brief}`} className="text-blue-600 underline block">Download Brief PDF</a>
        </div>
      )}

      {(techSummary || briefSummary) && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Preview Summaries</h2>
          {techSummary && (
            <div className="bg-gray-100 p-4 rounded mt-2">
              <h3 className="font-bold">Technical Summary</h3>
              <p className="whitespace-pre-line text-sm">{techSummary}</p>
            </div>
          )}
          {briefSummary && (
            <div className="bg-gray-100 p-4 rounded mt-4">
              <h3 className="font-bold">Brief Summary</h3>
              <p className="whitespace-pre-line text-sm">{briefSummary}</p>
            </div>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Extracted Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {images.map((src, idx) => (
              <img key={idx} src={`http://localhost:8000${src}`} alt={`image-${idx}`} className="w-full h-auto border rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
