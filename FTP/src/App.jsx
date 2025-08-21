import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Upload from "./Upload";
import Download from "./Download";
import Home from "./Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/download" element={<Download />} />
        </Routes>

        <ToastContainer position="top-center" autoClose={1000} hideProgressBar/>
      </div>
    </Router>
  );
}

export default App;
