import { Link } from "react-router-dom";
import { LogOut, User, Plus } from "lucide-react";

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-green-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          SYNTHIOT
        </Link>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition shadow-md">
                <Plus size={20} />
                New Project
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-full font-medium transition">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-6 py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-full font-semibold transition">
                Sign In
              </Link>
              <Link to="/register" className="px-7 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-bold shadow-lg transition transform hover:scale-105">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}