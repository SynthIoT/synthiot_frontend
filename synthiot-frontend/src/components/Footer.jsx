// src/components/Footer.jsx
import { Leaf, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-50 border-t-4 border-green-500 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-green-700">SYNTHIOT</span>
            </div>
            <p className="text-green-600 text-sm">
              Generate real-looking sensor data. No hardware. 100% free.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-green-800 mb-3">Product</h3>
            <ul className="space-y-2 text-green-600 text-sm">
              <li><a href="#" className="hover:text-green-800">Features</a></li>
              <li><a href="#" className="hover:text-green-800">Pricing</a></li>
              <li><a href="#" className="hover:text-green-800">Docs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-green-800 mb-3">Company</h3>
            <ul className="space-y-2 text-green-600 text-sm">
              <li><a href="#" className="hover:text-green-800">About</a></li>
              <li><a href="#" className="hover:text-green-800">Blog</a></li>
              <li><a href="#" className="hover:text-green-800">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-green-800 mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition">
                <Github className="w-5 h-5 text-green-700" />
              </a>
              <a href="#" className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition">
                <Twitter className="w-5 h-5 text-green-700" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-green-200 text-center text-green-600 text-sm">
          © 2025 SYNTHIOT. Made with (leaf) for the planet.
        </div>
      </div>
    </footer>
  );
}