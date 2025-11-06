// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Thermometer, Droplets } from "lucide-react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", sensor_type: "AM2320" });

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      window.location.href = "/login";
      return;
    }
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/project/get-project/${user_id}`);
      const payload = res?.data?.data ?? res?.data ?? [];
      setProjects(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const pid = editing.id ?? editing.project_id;
        await API.put(`/project/update-project/${pid}/${user_id}`, form);
      } else {
        await API.post(`/project/create-project/${user_id}`, form);
      }
      setShowModal(false);
      setEditing(null);
      setForm({ name: "", description: "", sensor_type: "AM2320" });
      fetchProjects();
    } catch (err) {
      alert("Failed to save project");
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm("Delete this project?")) return;
    try {
      await API.delete(`/project/delete-project/${projectId}/${user_id}`);
      fetchProjects();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const openEdit = (proj) => {
    setEditing(proj);
    setForm({
      name: proj.name ?? "",
      description: proj.description ?? "",
      sensor_type: proj.sensor_type ?? "AM2320",
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black text-green-800">My Projects</h1>
            <p className="text-green-600 mt-2">Generate synthetic sensor data for your IoT apps</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setForm({ name: "", description: "", sensor_type: "AM2320" });
              setShowModal(true);
            }}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-bold shadow-xl transform hover:scale-105 transition"
          >
            <Plus size={24} />
            New Project
          </button>
        </div>

        {/* PROJECTS GRID */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <Thermometer className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-3">No projects yet</h3>
            <p className="text-green-600">Create your first synthetic data stream!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => {
              const pid = proj.id ?? proj.project_id; // ensure we send the right id
              return (
                <div
                  key={pid}
                  className="bg-white/90 backdrop-blur border-2 border-green-200 rounded-3xl p-8 hover:border-green-400 hover:shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-green-800">
                      {proj.name ?? `Project ${String(pid).slice(0, 6)}`}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(proj)}
                        className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition"
                      >
                        <Edit2 size={18} className="text-green-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(pid)}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-green-600 mb-6 leading-relaxed">{proj.description}</p>

                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700">{proj.sensor_type}</span>
                  </div>

                  <Link
                    to={`/chat/${pid}`}
                    state={{ projectId: pid }} // optional backup route data
                    className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition block text-center"
                  >
                    Open Chat
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              {editing ? "Edit Project" : "New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Project Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none transition text-lg"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none transition h-28 resize-none"
              />
              <select
                value={form.sensor_type}
                onChange={(e) => setForm({ ...form, sensor_type: e.target.value })}
                className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none transition text-lg"
              >
                <option value="AM2320">AM2320 (Temp + Humidity)</option>
                <option value="DHT22">DHT22</option>
                <option value="BME280">BME280</option>
              </select>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                  className="flex-1 py-4 border-2 border-green-300 text-green-700 hover:bg-green-50 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition shadow-lg"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
