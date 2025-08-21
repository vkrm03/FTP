import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaDownload, FaLock, FaGlobe, FaBolt, FaShieldAlt } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: <FaLock />, title: "Secure", desc: "Password-protected files with end-to-end encryption." },
    { icon: <FaGlobe />, title: "Accessible Anywhere", desc: "Access your files from any device in the world." },
    { icon: <FaBolt />, title: "Fast", desc: "Lightning-fast uploads and downloads, no waiting." },
    { icon: <FaShieldAlt />, title: "Safe Storage", desc: "Your files are stored securely with backups." },
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="home-title">Secure File Share</h1>
        <p className="home-subtitle">
          Effortlessly upload, share, and download files with end-to-end security.
        </p>
        <p className="hero-note">
          No account required. Password-protect your files. Access them anywhere in the world.
        </p>
      </div>

      <div className="card-container">
        <div
          className="home-card upload-card"
          onClick={() => navigate("/upload")}
        >
          <div className="icon-container">
            <FaUpload className="card-icon" />
          </div>
          <h2>Upload Files</h2>
          <p>Drag & drop your files or select them manually. Generate a secure share ID.</p>
        </div>

        <div
          className="home-card download-card"
          onClick={() => navigate("/download")}
        >
          <div className="icon-container">
            <FaDownload className="card-icon" />
          </div>
          <h2>Download Files</h2>
          <p>Enter the share ID and password to access and download your files safely.</p>
        </div>
      </div>

       <div className="features-section">
        <h3>Features You’ll Love</h3>
        <div className="features-grid">
          {features.map((f, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
