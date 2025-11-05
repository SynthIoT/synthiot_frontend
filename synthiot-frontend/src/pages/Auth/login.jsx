import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/AuthService";
import { Leaf } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(form);
      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("token", "synthiot-jwt");
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white/95 backdrop-blur-xl border-2 border-green-200 rounded-3xl p-10 w-full max-w-lg shadow-2xl">
        <div className="text-center mb-8">
          <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-green-700">Welcome Back!</h2>
          <p className="text-green-600 mt-2">Log in to generate synthetic data</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition text-lg"
            required
          />
          <input
            type="password"
            placeholder="Your Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition text-lg"
            required
          />

          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-xl shadow-lg transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-green-600">
          New here?{" "}
          <Link to="/register" className="font-bold text-green-700 hover:underline">
            Create free account
          </Link>
        </p>
      </div>
    </div>
  );
}