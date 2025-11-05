import { Zap, DollarSign, Cloud, MessageCircle } from "lucide-react";

const icons = {
  sensor: <Zap className="w-12 h-12 text-green-500" />,
  free: <DollarSign className="w-12 h-12 text-green-500" />,
  realtime: <Cloud className="w-12 h-12 text-green-500" />,
  chat: <MessageCircle className="w-12 h-12 text-green-500" />,
};

export default function FeatureCard({ title, desc, type }) {
  return (
    <div className="bg-white/80 backdrop-blur border-2 border-green-200 rounded-3xl p-8 hover:border-green-400 hover:shadow-2xl transition-all hover:-translate-y-2">
      <div className="mb-5 p-4 bg-green-100 w-fit rounded-2xl">
        {icons[type]}
      </div>
      <h3 className="text-2xl font-bold text-green-700 mb-3">{title}</h3>
      <p className="text-green-600 leading-relaxed">{desc}</p>
    </div>
  );
}