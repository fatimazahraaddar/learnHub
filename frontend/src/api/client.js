// src/api/client.js

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const LEGACY_API_BASE =
  import.meta.env.VITE_LEGACY_API_BASE_URL || "http://localhost/backend";

const TOKEN_KEY = "auth_token";

function buildUrl(base, path) {
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}/${String(path).replace(/^\/+/, "")}`;
}

function parseJsonSafe(response) {
  return response
    .json()
    .catch(() => ({ status: false, message: "Invalid server response" }));
}

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function buildHeaders(extra = {}) {
  const token = getStoredToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function postForm(path, payload) {
  const response = await fetch(buildUrl(LEGACY_API_BASE, path), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...buildHeaders(),
    },
    body: new URLSearchParams(payload),
  });

  const data = await parseJsonSafe(response);
  return { ok: response.ok, data };
}

export async function getJson(pathWithQuery) {
  const response = await fetch(buildUrl(LEGACY_API_BASE, pathWithQuery), {
    headers: buildHeaders(),
  });
  const data = await parseJsonSafe(response);
  return { ok: response.ok, data };
}

export async function postMultipart(path, payload) {
  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  const response = await fetch(buildUrl(LEGACY_API_BASE, path), {
    method: "POST",
    headers: buildHeaders(),
    body: formData,
  });

  const data = await parseJsonSafe(response);
  return { ok: response.ok, data };
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildUrl(API_BASE, path), {
    ...options,
    headers: {
      Accept: "application/json",
      ...buildHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await parseJsonSafe(response);
  return { ok: response.ok, status: response.status, data };
}