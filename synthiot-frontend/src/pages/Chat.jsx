// src/pages/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import {
  getChatList,
  getChatHistory,
  sendMessage,
  createChat, // ← Only if you want "New Chat" button
} from "../services/ChatService";

export default function Chat() {
  const { projectId } = useParams();
  const userId = localStorage.getItem("user_id");
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId) return (window.location.href = "/login");
    loadChats();
  }, [projectId, userId]);

  const loadChats = async () => {
    try {
      const res = await getChatList(projectId, userId);
      setChats(res.data);
      if (res.data.length > 0) {
        selectChat(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  const selectChat = async (chat) => {
    setSelected(chat);
    try {
      const res = await getChatHistory(projectId, chat.chat_id, userId);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selected) return;
    setSending(true);
    try {
      await sendMessage(projectId, selected.chat_id, userId, input);
      const res = await getChatHistory(projectId, selected.chat_id, userId);
      setMessages(res.data.messages);
      setInput("");
    } catch (err) {
      alert("Failed to send message");
    }
    setSending(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          <div className="lg:col-span-1 bg-white/90 border-2 border-green-200 rounded-3xl p-6 h-[70vh] overflow-y-auto">
            <h3 className="font-bold text-green-700 mb-4">
              Conversations ({chats.length})
            </h3>
            {chats.length === 0 ? (
              <p className="text-green-600 text-center mt-10">No chats yet</p>
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
                    {c.preview || "New chat"}
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
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
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
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask: Generate temp data in Chennai..."
                    className="flex-1 p-3 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl disabled:opacity-50 transition"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-green-600">
                <MessageCircle size={64} className="opacity-50 mr-4" />
                <p>Select a conversation to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}