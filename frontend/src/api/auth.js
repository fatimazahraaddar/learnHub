// src/api/auth.js

import { apiRequest, getStoredToken } from './client';

const USER_CHANGED_EVENT = "learnhub:user-changed";
const USER_KEY = "user";
const TOKEN_KEY = "auth_token";

// ─── STORAGE ──────────────────────────────────────────────────────────────────

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USER_CHANGED_EVENT));
  }
}

export function mergeStoredUser(partial) {
  const current = getStoredUser() || {};
  const next = { ...current, ...partial };
  setStoredUser(next);
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USER_CHANGED_EVENT));
  }
}

export function subscribeUserChanges(callback) {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback(getUserDisplayData());
  const storageHandler = (e) => {
    if (!e.key || e.key === USER_KEY || e.key === TOKEN_KEY) {
      handler();
    }
  };

  window.addEventListener(USER_CHANGED_EVENT, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(USER_CHANGED_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

// ─── USER HELPERS ─────────────────────────────────────────────────────────────

export function getDashboardRouteByRole(role) {
  if (role === "trainer") return "/trainer";
  if (role === "admin") return "/admin";
  return "/learner";
}

export function getUserDisplayData() {
  const user = getStoredUser() || {};
  const fullName = String(user.name || "").trim();
  const parts = fullName ? fullName.split(/\s+/) : [];
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return {
    fullName: fullName || "User",
    firstName,
    lastName,
    email: String(user.email || ""),
    role: String(user.role || "learner"),
    image:
      user.image ||
      "https://images.unsplash.com/photo-1645664747204-31fee58898dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
  };
}

// ─── AUTH API ─────────────────────────────────────────────────────────────────

export async function registerUser(payload) {
  const { ok, data } = await apiRequest("auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (ok && data?.token && data?.user) {
    setStoredToken(data.token);
    setStoredUser(data.user);
  }

  return { ok, data };
}

export async function loginUser(payload) {
  const { ok, data } = await apiRequest("auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (ok && data?.token && data?.user) {
    setStoredToken(data.token);
    setStoredUser(data.user);
  }

  return { ok, data };
}

export async function fetchCurrentUser() {
  return apiRequest("auth/me");
}

export async function logoutUser() {
  const token = getStoredToken();
  if (token) {
    await apiRequest("auth/logout", { method: "POST" });
  }
  clearStoredUser();
  window.location.href = "/";
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────

export async function fetchProfile() {
  const { ok, data } = await apiRequest("profile");

  if (!ok || !data) {
    return {
      ok,
      data: {
        status: false,
        message: data?.message || "Profile not found",
      },
    };
  }

  const fullName = String(data.name || "").trim();
  const parts = fullName ? fullName.split(/\s+/) : [];

  return {
    ok: true,
    data: {
      status: true,
      profile: {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" "),
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
        github: data.github || "",
        image: data.image || "",
      },
    },
  };
}

export async function saveProfile(_role, accountId, form) {
  const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();

  const formData = new FormData();
  formData.append('name', fullName || "User");
  formData.append('email', form.email || "");
  formData.append('phone', form.phone || "");
  formData.append('location', form.location || "");
  formData.append('bio', form.bio || "");
  formData.append('linkedin', form.linkedin || "");
  formData.append('twitter', form.twitter || "");
  formData.append('github', form.github || "");
  formData.append('_method', 'PUT');

  if (form.image instanceof File) {
    formData.append('image', form.image);
  }

  const token = getStoredToken();

  const response = await fetch(`http://localhost:8000/api/profile`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    return { data: { status: false, message: data.message || `Server error ${response.status}` } };
  }

  return { data: { status: true, ...data } };
}