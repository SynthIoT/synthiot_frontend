// src/services/ChatService.js
import API from "../api";

/**
 * All functions are async and await the API response.
 * They return the data payload (e.g. res.data) directly.
 * Add verbose logs to help debug.
 */

// ---- Chats ----
export const createChat = async (projectId, userId, message) => {
  const url = `/chat/create-chat/${projectId}/${userId}`;
  console.log("[ChatService] POST", url, { message });
  const res = await API.post(url, { message });
  console.log("[ChatService] ->", res.status, res.data);
  return res.data; // { chat_id: "...", ... } or { data: ... }
};

export const getChatList = async (projectId, userId) => {
  const url = `/chat/get-chat-list/${projectId}/${userId}`;
  console.log("[ChatService] GET", url);
  const res = await API.get(url);
  console.log("[ChatService] ->", res.status, res.data);
  // Some backends return {data: [...]}; some return [...]
  return res.data;
};

export const getChatHistory = async (projectId, chatId, userId) => {
  const url = `/chat/get-chat-history/${projectId}/${chatId}/${userId}`;
  console.log("[ChatService] GET", url);
  const res = await API.get(url);
  console.log("[ChatService] ->", res.status, res.data);
  return res.data;
};

export const sendMessage = async (projectId, chatId, userId, message) => {
  const url = `/chat/send-message/${projectId}/${chatId}/${userId}`;
  console.log("[ChatService] POST", url, { message });
  const res = await API.post(url, { message });
  console.log("[ChatService] ->", res.status, res.data);
  return res.data;
};

// ---- CSV Download (Streaming) ----
// Use fetch (not axios) for simpler blob handling.
export const downloadSyntheticCSV = async (projectId, chatId, userId, rows = 1000, batchSize = 2000) => {
  const base = API.defaults.baseURL?.replace(/\/$/, "") || "";
  const url = `${base}/synth/generate?project_id=${encodeURIComponent(projectId)}&chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(userId)}&rows=${encodeURIComponent(rows)}&batch_size=${encodeURIComponent(batchSize)}`;

  console.log("[ChatService] GET (download)", url);
  const res = await fetch(url, { method: "GET", credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[ChatService] download failed:", res.status, text);
    throw new Error(`Generate failed: ${res.status} ${text}`);
  }

  const blob = await res.blob();
  const link = document.createElement("a");
  const dlUrl = window.URL.createObjectURL(blob);
  link.href = dlUrl;

  // Try to use server filename, else fallback
  const dispo = res.headers.get("Content-Disposition");
  const m = dispo && /filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i.exec(dispo);
  link.download = m ? decodeURIComponent(m[1]) : `synthetic_${chatId}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(dlUrl);
};
