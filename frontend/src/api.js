const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;
  const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
  return `http://${host}:5000`;
};
const API_URL = getApiUrl();
const TOKEN_KEY = "cba_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function signup({ username, email, password, heroId }) {
  return request("/api/auth/signup", { method: "POST", body: JSON.stringify({ username, email, password, heroId }) });
}

export function login({ username, password }) {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
}

export function fetchMe() {
  return request("/api/auth/me");
}

export function fetchLeaderboard() {
  return request("/api/leaderboard");
}

export function fetchProfile(userId) {
  return request(`/api/profile${userId ? `/${userId}` : ""}`);
}
