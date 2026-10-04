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
  const url = `${API_URL}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...options.headers
      }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status} error`);
    return data;
  } catch (err) {
    console.error(`[API Request Failure] Endpoint: ${url}`, {
      path,
      apiUrl: API_URL,
      errorName: err.name,
      errorMessage: err.message
    });
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      throw new Error(`Connection error: Could not reach backend server at ${API_URL}. Ensure the backend is running on port 5000.`);
    }
    throw err;
  }
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

// --- Campaign Levels API ---
export function fetchLevels() {
  return request("/api/levels");
}

export function fetchLevelProgress(language = null) {
  return request(`/api/levels/progress${language ? `?language=${language}` : ""}`);
}

export function fetchLevelDetails(levelId, language = "javascript") {
  return request(`/api/levels/${levelId}?language=${language}`);
}

export function completeLevel(levelId, payload) {
  return request(`/api/levels/${levelId}/complete`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// --- Daily Games API ---
export function fetchDailyGame() {
  return request("/api/daily-game");
}

export function completeDailyGame(payload) {
  return request("/api/daily-game/complete", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchDailyLeaderboard(date) {
  return request(`/api/daily-game/leaderboard${date ? `?date=${date}` : ""}`);
}
