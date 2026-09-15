import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  // Compute public app URL using VITE_PUBLIC_APP_URL with production fallback protection
  const getPublicAppUrl = () => {
    const envUrl = import.meta.env.VITE_PUBLIC_APP_URL;
    if (envUrl) {
      if (import.meta.env.PROD && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
        return "https://coding-battle-arena.vercel.app";
      }
      return envUrl;
    }
    if (typeof window !== "undefined") {
      const { origin, hostname } = window.location;
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        return origin;
      }
    }
    if (import.meta.env.PROD) {
      return "https://coding-battle-arena.vercel.app";
    }
    return typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  };

  const publicUrl = getPublicAppUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="modal-backdrop glass-panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(4, 4, 8, 0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "90%",
          maxWidth: 420,
          padding: "26px 22px",
          borderRadius: 20,
          background: "rgba(10, 11, 20, 0.96)",
          border: "1px solid var(--neon-cyan)",
          boxShadow: "0 0 35px rgba(0, 229, 255, 0.35), inset 0 0 15px rgba(0, 229, 255, 0.1)",
          textAlign: "center",
          position: "relative"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: 30,
            height: 30,
            color: "#94a3b8",
            fontSize: 14,
            cursor: "pointer",
            display: "grid",
            placeItems: "center"
          }}
        >
          ✕
        </button>

        {/* Futuristic Header */}
        <div style={{ fontSize: 30, marginBottom: 4 }}>📱</div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            color: "#fff",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "0.06em",
            marginBottom: 4,
            textShadow: "0 0 12px rgba(0, 229, 255, 0.6)"
          }}
        >
          PLAY ON PHONE
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 18 }}>
          Scan to enter the Arena on your mobile device
        </p>

        {/* QR Code Container with Centered Game Logo */}
        <div
          style={{
            background: "#ffffff",
            padding: 16,
            borderRadius: 16,
            display: "inline-block",
            boxShadow: "0 0 25px rgba(0, 229, 255, 0.4)",
            border: "2px solid var(--neon-cyan)",
            marginBottom: 12
          }}
        >
          <QRCodeSVG
            value={publicUrl}
            size={210}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/game-logo.svg",
              x: undefined,
              y: undefined,
              height: 42,
              width: 42,
              excavate: true
            }}
          />
        </div>

        {/* Small QR Branding Caption */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            fontWeight: 800,
            color: "var(--neon-cyan)",
            letterSpacing: "0.12em",
            marginBottom: 14,
            textTransform: "uppercase"
          }}
        >
          ⚡ SCAN TO ENTER THE ARENA ⚡
        </div>

        {/* Public Game URL Card */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            border: "1px solid rgba(0, 229, 255, 0.3)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 14
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "var(--neon-cyan)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 5,
              justifyContent: "center"
            }}
          >
            <span>🌐</span> PUBLIC GAME URL
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#fff", wordBreak: "break-all" }}>
            {publicUrl}
          </div>
        </div>

        {/* Cross-Device Shared Data Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--neon-gold)",
            background: "rgba(255, 215, 0, 0.08)",
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255, 215, 0, 0.25)",
            marginBottom: 18
          }}
        >
          <span>⭐ Same Account</span>
          <span>•</span>
          <span>🏆 Same ELO</span>
          <span>•</span>
          <span>🪙 Same Coins</span>
          <span>•</span>
          <span>⚡ Same XP</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={handleCopy} style={{ fontSize: 12, padding: "9px 16px", flex: 1 }}>
            {copied ? "✓ URL COPIED!" : "📋 Copy App Link"}
          </button>
          <button className="btn btn-start" onClick={onClose} style={{ fontSize: 12, padding: "9px 16px", flex: 1 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
