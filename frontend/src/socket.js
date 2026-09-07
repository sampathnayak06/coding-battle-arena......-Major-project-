import { io } from "socket.io-client";
import { getToken } from "./api.js";

const getBackendUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;
  const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
  return `http://${host}:5000`;
};
const BACKEND_URL = getBackendUrl();
console.log("[socket] backend URL:", BACKEND_URL);

// Single shared socket instance for the whole app (matchmaking, battle sync, etc.)
export const socket = io(BACKEND_URL, {
  autoConnect: false,
  path: "/socket.io",
  transports: ["websocket", "polling"],
  auth: { token: getToken() }
});

socket.on("connect", () => console.log("[socket] connected to", BACKEND_URL));
socket.on("connect_error", (error) => console.error("[socket] connect_error", error));
socket.on("disconnect", (reason) => console.log("[socket] disconnected", reason));

// Call after login/logout so the next connection carries the right identity.
export function reconnectSocketWithAuth() {
  socket.auth = { token: getToken() };
  if (socket.connected) socket.disconnect();
  socket.connect();
}
