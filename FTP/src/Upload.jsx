import { useState } from "react";
import { toast } from "react-toastify";
import "./upload.css";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [shareId, setShareId] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const MAX_SIZE = 50 * 1024 * 1024;

  const handleUpload = async () => {
    if (!file || !password) {
      toast.warn("Please select a file and enter a password");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 50 MB");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("password", password);

    try {
      const res = await fetch("https://ftp-gb1w.onrender.com/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.shareId) {
        toast.success("File uploaded successfully!");
        setShareId(data.shareId);
      } else {
        toast.error(data.detail || "Upload failed");
      }
    } catch (err) {
      toast.error("Server error. Try again later.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareId).then(() => {
      toast.success("Share ID copied to clipboard!");
    });
  };

  const handleShare = () => {
    const shareLink = `https://ftp-gb1w.onrender.com/download?shareId=${shareId}&password=${password}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success("Share link copied!");
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > MAX_SIZE) {
        toast.error("File size must be less than 50 MB");
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > MAX_SIZE) {
      toast.error("File size must be less than 50 MB");
      e.target.value = "";
      return;
    }
    setFile(selectedFile);
  };

  return (
    <div className="upload-container">
        <h1 className="upload-title">Upload the File</h1>
      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {file ? (
          <p className="file-name">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        ) : (
          <p>Drag & drop your file here or click below</p>
        )}
        <input
          type="file"
          id="fileInput"
          className="hidden-input"
          onChange={handleFileSelect}
        />
        <label htmlFor="fileInput" className="choose-btn">
          Choose File
        </label>
      </div>

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
        className="input-text"
        required
      />

      <button onClick={handleUpload} className="btn">
        Upload
      </button>

      {shareId && (
        <div className="result">
          <span>
            Share ID: <b>{shareId}</b>
          </span>
          <button onClick={handleCopy} className="copy-btn">
            Copy
          </button>
          <button onClick={handleShare} className="share-btn">
            Share
          </button>
        </div>
      )}
    </div>
  );
}
