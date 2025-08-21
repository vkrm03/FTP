import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./Download.css";

export default function Download() {
  const [shareId, setShareId] = useState("");
  const [password, setPassword] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [readyToDownload, setReadyToDownload] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("shareId") || "";
    const pwd = params.get("password") || "";
    setShareId(id);
    setPassword(pwd);

    if (id && pwd) {
      fetchFileInfo(id, pwd);
    }
  }, [location.search]);

  const fetchFileInfo = async (id, pwd) => {
    try {
      const res = await fetch("https://ftp-gb1w.onrender.com/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareId: id, password: pwd }),
      });

      const data = await res.json();
      if (data.downloadUrl) {
        setFileUrl(data.downloadUrl);

        const urlParts = data.downloadUrl.split("/").pop().split("?")[0];
        setFileName(urlParts);
        setFileType(urlParts.split(".").pop().toLowerCase());

        setReadyToDownload(true);
      } else {
        toast.error(data.detail || "Invalid ID or Password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;

    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Failed to fetch file");

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Download started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download file");
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "🖼️";
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📃";
      case "zip":
      case "rar":
        return "🗜️";
      case "mp3":
        return "🎵";
      case "mp4":
      case "mov":
        return "🎬";
      default:
        return "📁";
    }
  };

  return (
    <div className="download-container">
      <div className="download-card">
        <h1 className="upload-title">Secure File Download</h1>

        <div className="input-group">
          <label>Share ID</label>
          <input
            type="text"
            placeholder="Enter Share ID"
            value={shareId}
            onChange={(e) => setShareId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {readyToDownload && (
          <div className="file-preview">
            <span className="file-icon">{getFileIcon(fileType)}</span>
            <span className="file-name">{fileName.slice(9)}</span>
          </div>
        )}

        <button
          onClick={handleDownload}
          className="download-btn"
          disabled={!readyToDownload}
        >
          Download
        </button>
      </div>
    </div>
  );
}
