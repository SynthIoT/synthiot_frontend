// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:projectId" element={<Chat />} />
        {/* optional: catch-all so you know if you hit an unknown route */}
        <Route path="*" element={<div className="p-10 text-center">Not Found</div>} />
      </Routes>
    </Router>
  );
}
