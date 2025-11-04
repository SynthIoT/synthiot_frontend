import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/AuthService";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!form.name || !form.email || !form.password) return setError("Fill all fields");
    if (form.password !== form.confirm) return setError("Passwords don't match");
    if (form.password.length < 8) return setError("Password must be 8+ characters");
    setError("");
    setStep(2);
  };

  const handleRegister = async () => {
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      alert("Account created! 🎉 Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Email already exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white/95 backdrop-blur-xl border-2 border-green-200 rounded-3xl p-10 w-full max-w-lg shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-green-700">
            {step === 1 ? "Create Free Account" : "Almost There!"}
          </h2>
          <p className="text-green-600 mt-2">Join 10,000+ developers generating synthetic data</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition text-lg"
            />
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition text-lg"
            />
            <input
              type="password"
              placeholder="Create Password (8+ chars)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition text-lg"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full p-5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition text-lg"
            />

            <button
              onClick={handleNext}
              className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 transition"
            >
              Next <ArrowRight />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <p className="text-green-700 text-lg mb-8">
              You're ready! Click below to create your account.
            </p>
            <button
              onClick={handleRegister}
              className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-xl shadow-lg transition"
            >
              Create My Account
            </button>
            <button
              onClick={() => setStep(1)}
              className="mt-4 text-green-600 hover:underline"
            >
              ← Back
            </button>
          </div>
        )}

        <p className="text-center mt-8 text-green-600">
          Have an account?{" "}
          <Link to="/login" className="font-bold text-green-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}