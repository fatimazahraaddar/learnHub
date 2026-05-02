// src/api/messages.js

import { apiRequest } from './client';
import { asArray } from './utils';

// ─── CONTACTS ─────────────────────────────────────────────────────────────────

export async function fetchMessageContacts(selfId) {
  const { ok, data } = await apiRequest("users");

  if (!ok) {
    return {
      ok: false,
      data: {
        status: false,
        message: data?.message || "Failed to load contacts",
      },
    };
  }

  const contacts = asArray(data)
    .filter((u) => Number(u.id) !== Number(selfId))
    .map((u) => ({
      id: Number(u.id),
      name: u.name || "Unnamed",
      email: u.email || "",
      role: String(u.role || "learner"),
    }));

  return { ok: true, data: { status: true, contacts } };
}

// ─── CONVERSATION ─────────────────────────────────────────────────────────────

export async function fetchConversation(selfId, otherId) {
  const [sent, received] = await Promise.all([
    apiRequest(`messages?sender_id=${Number(selfId)}`),
    apiRequest(`messages?receiver_id=${Number(selfId)}`),
  ]);

  if (!sent.ok && !received.ok) {
    return {
      ok: false,
      data: { status: false, message: "Failed to load messages" },
    };
  }

  const all = [...asArray(sent.data), ...asArray(received.data)];

  const chat = all
    .filter(
      (msg) =>
        (Number(msg.sender_id) === Number(selfId) &&
          Number(msg.receiver_id) === Number(otherId)) ||
        (Number(msg.sender_id) === Number(otherId) &&
          Number(msg.receiver_id) === Number(selfId))
    )
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((msg) => ({
      id: msg.id,
      sender_id: Number(msg.sender_id),
      sender_role: String(msg.sender?.role || "learner"),
      receiver_id: Number(msg.receiver_id),
      receiver_role: String(msg.receiver?.role || "learner"),
      message: msg.body || "",
      created_at: msg.created_at,
    }));

  return { ok: true, data: chat };
}

// ─── SEND MESSAGE ─────────────────────────────────────────────────────────────

export async function sendConversationMessage(senderId, receiverId, text) {
  const { ok, data } = await apiRequest("messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender_id: Number(senderId),
      receiver_id: Number(receiverId),
      body: String(text || ""),
      subject: null,
    }),
  });

  if (!ok) {
    return {
      ok: false,
      data: {
        status: false,
        message: data?.message || "Failed to send message",
      },
    };
  }

  return { ok: true, data: { status: true, message: "Message sent" } };
}