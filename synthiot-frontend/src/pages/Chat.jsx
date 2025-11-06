// src/pages/Chat.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle, Plus, Download } from "lucide-react";
import {
  getChatList,
  getChatHistory,
  sendMessage,
  createChat,
  downloadSyntheticCSV,
} from "../services/ChatService";

/** Robust rows parser: supports "1000 rows", "10k", "2m", "1,200 records" */
function parseRowsFromText(text) {
  if (!text) return null;

  // explicit: number + optional suffix + rows/records/samples
  const explicit = /(\d[\d,]*(?:\.\d+)?)[\s-]*([kKmM])?\s*(rows?|records?|samples?|data\s*points?)/i.exec(
    text
  );
  if (explicit) {
    const n = explicit[1].replace(/,/g, "");
    const s = (explicit[2] || "").toLowerCase();
    let val = parseFloat(n);
    if (s === "k") val *= 1_000;
    if (s === "m") val *= 1_000_000;
    return Math.max(1, Math.round(val));
  }

  // fallback: after "generate|create" a number (optionally with k/m)
  const afterVerb = /\b(generate|create|produce|make)\s+(\d[\d,]*(?:\.\d+)?)([kKmM])?\b/i.exec(text);
  if (afterVerb) {
    const n = afterVerb[2].replace(/,/g, "");
    const s = (afterVerb[3] || "").toLowerCase();
    let val = parseFloat(n);
    if (s === "k") val *= 1_000;
    if (s === "m") val *= 1_000_000;
    return Math.max(1, Math.round(val));
  }

  return null;
}

export default function Chat() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const userId = useMemo(() => localStorage.getItem("user_id"), []);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const messagesEndRef = useRef(null);

  // --- Guards + initial load
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (!projectId) {
      navigate("/dashboard");
      return;
    }
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, userId]);

  const loadChats = async () => {
    try {
      const res = await getChatList(projectId, userId);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setChats(list);
      if (list.length > 0) {
        await selectChat(list[0]);
      }
    } catch (err) {
      console.error("[Chat] Failed to load chats:", err);
      setChats([]);
    }
  };

  const selectChat = async (chat) => {
    setSelected(chat);
    try {
      const res = await getChatHistory(projectId, chat.chat_id, userId);
      const messages = res?.data?.messages ?? res?.messages ?? [];
      setMessages(messages);
    } catch (err) {
      console.error("[Chat] Failed to load history:", err);
      setMessages([]);
    }
  };

  // --- Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // --- Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selected) return;

    setSending(true);
    try {
      console.log("[Chat] Sending:", input);
      const resp = await sendMessage(projectId, selected.chat_id, userId, input);
      console.log("[Chat] sendMessage resp:", resp);

      // Re-fetch history so we get the assistant reply from backend
      const hist = await getChatHistory(projectId, selected.chat_id, userId);
      const msgs = hist?.data?.messages ?? hist?.messages ?? [];
      setMessages(msgs);
      setInput("");

      // Try to find the latest assistant message and parse rows
      const lastAi = [...msgs].reverse().find((m) => m.role !== "user");
      const combined = [input, lastAi?.content].filter(Boolean).join(" ");
      const rows = parseRowsFromText(combined) ?? 1000;

      // If the user asked to "generate" or if rows detected, auto-download
      const shouldGenerate =
        /\b(generate|create|produce|make)\b/i.test(input) || /download/i.test(lastAi?.content || "");

      if (shouldGenerate) {
        try {
          console.log("[Chat] Triggering CSV download. rows=", rows);
          await downloadSyntheticCSV(projectId, selected.chat_id, userId, rows);
        } catch (dlErr) {
          console.error("[Chat] CSV download failed:", dlErr);
          alert("CSV generation failed. Check backend logs.");
        }
      }
    } catch (err) {
      console.error("[Chat] Failed to send:", err);
      alert("Failed to send");
    } finally {
      setSending(false);
    }
  };

  // --- Create new chat
  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;
    try {
      const res = await createChat(projectId, userId, newChatName);
      // normalize data shape
      const chat_id = res?.data?.chat_id ?? res?.chat_id;
      const newChat = { chat_id, preview: newChatName };
      setChats((prev) => [newChat, ...prev]);
      setSelected(newChat);
      setMessages([]);
      setShowNewChatModal(false);
      setNewChatName("");
    } catch (err) {
      console.error("[Chat] Failed to create chat:", err);
      alert("Failed to create chat");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="text-4xl font-bold text-green-800 flex items-center gap-3">
            <MessageCircle className="text-green-600" />
            Project Chats
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat List */}
          <div className="lg:col-span-1 bg-white/90 border-2 border-green-200 rounded-3xl p-6 h-[70vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-green-700">
                Conversations ({chats.length})
              </h3>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition"
                title="New Chat"
              >
                <Plus size={18} className="text-green-700" />
              </button>
            </div>

            {chats.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-green-600">
                <p>No chat yet. Start your conversation.</p>
              </div>
            ) : (
              chats.map((c) => (
                <button
                  key={c.chat_id}
                  onClick={() => selectChat(c)}
                  className={`w-full text-left p-3 rounded-xl mb-2 transition ${
                    selected?.chat_id === c.chat_id
                      ? "bg-green-100 border-2 border-green-500"
                      : "hover:bg-green-50"
                  }`}
                >
                  <p className="font-medium text-green-800 truncate">
                    {c.preview || c.chat_id}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 bg-white/90 border-2 border-green-200 rounded-3xl p-6 flex flex-col">
            {selected ? (
              <>
                <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                          m.role === "user"
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-green-800"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-4 rounded-2xl text-green-600 flex items-center gap-2">
                        <span className="animate-pulse">Thinking…</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., Generate 10k rows for Chennai summer"
                    className="flex-1 p-3 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl disabled:opacity-50 transition"
                    title="Send"
                  >
                    <Send size={20} />
                  </button>
                  {/* Manual download button (uses last parsed value from input as fallback) */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (!selected) return;
                      const rows = parseRowsFromText(input) ?? 1000;
                      try {
                        await downloadSyntheticCSV(projectId, selected.chat_id, userId, rows);
                      } catch (e) {
                        console.error("[Chat] Manual CSV download failed:", e);
                        alert("CSV generation failed. Check backend logs.");
                      }
                    }}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
                    title="Download CSV"
                  >
                    <Download size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-green-600">
                <MessageCircle size={64} className="opacity-50 mr-4" />
                <p>Select a conversation or create a new one</p>
              </div>
            )}
          </div>
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-green-800 mb-4">New Conversation</h2>
              <input
                type="text"
                placeholder="Chat name (e.g., Mumbai Summer Data)"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNewChatModal(false);
                    setNewChatName("");
                  }}
                  className="flex-1 py-3 border-2 border-green-300 text-green-700 hover:bg-green-50 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateChat}
                  disabled={!newChatName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
