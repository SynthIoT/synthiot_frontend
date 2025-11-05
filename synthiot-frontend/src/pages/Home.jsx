// src/pages/Home.jsx
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="pt-28 px-6">
        {/* HERO SECTION */}
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Generate Synthetic Data
            </span>
            <br />
            <span className="text-green-800">That Mimics Real Sensors</span>
          </h1>

          <p className="text-xl md:text-2xl text-green-700 mt-6 max-w-4xl mx-auto font-medium">
            Train ML models, test dashboards, or prototype IoT apps with hyper-realistic AM2320 temperature & humidity streams.
            <br />
            <span className="text-green-600 font-bold">100% Free. No hardware. Instant data.</span>
          </p>

          <div className="mt-12">
            <Link
              to="/register"
              className="inline-block px-12 py-5 text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl transform hover:scale-110 transition duration-300"
            >
              Start Generating Now
            </Link>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard
            type="sensor"
            title="AM2320 Sensor"
            desc="Realistic temp & humidity with noise, drift, and weather patterns."
          />
          <FeatureCard
            type="free"
            title="Forever Free"
            desc="Unlimited projects, data points, and exports. Zero cost."
          />
          <FeatureCard
            type="realtime"
            title="Live Streams"
            desc="Push to Firebase, MQTT, or download CSV/JSON instantly."
          />
          <FeatureCard
            type="chat"
            title="AI Chat"
            desc="Just say: “Give me 48h of rainy day data” – done."
          />
        </div>
      </div>
    </main>
  );
}