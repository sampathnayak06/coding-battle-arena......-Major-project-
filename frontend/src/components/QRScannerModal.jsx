import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScannerModal({ onClose }) {
  const [errorMsg, setErrorMsg] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrcodeScanner = null;

    try {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader-container",
        { fps: 10, qrbox: { width: 220, height: 220 } },
        /* verbose= */ false
      );

      html5QrcodeScanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(() => {});
          }
          if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
            window.location.href = decodedText;
          }
        },
        (error) => {
          // ignore transient scan frame errors
        }
      );
      scannerRef.current = html5QrcodeScanner;
    } catch (err) {
      setErrorMsg("Camera scanner unavailable or permission denied. Please log in using the standard form below.");
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="modal-backdrop glass-panel" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)" }}>
      <div className="glass-panel" style={{ width: "90%", maxWidth: 400, padding: 20, borderRadius: 16, background: "rgba(15, 23, 42, 0.95)", border: "1px solid var(--neon-cyan)", textAlign: "center", position: "relative" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer" }}
        >
          ✕
        </button>

        <h3 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
          📷 SCAN QR CODE
        </h3>
        <p style={{ color: "var(--text-dim)", fontSize: 12, marginBottom: 14 }}>
          Point your phone camera at a Coding Battle Arena QR code.
        </p>

        {errorMsg ? (
          <div style={{ padding: 14, background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 10, color: "#fca5a5", fontSize: 12, marginBottom: 14 }}>
            {errorMsg}
          </div>
        ) : (
          <div id="qr-reader-container" style={{ width: "100%", borderRadius: 12, overflow: "hidden", marginBottom: 14, background: "#000" }} />
        )}

        {scanResult && (
          <div style={{ padding: 10, background: "rgba(34, 197, 94, 0.15)", borderRadius: 8, color: "#4ade80", fontSize: 12, marginBottom: 14 }}>
            Found URL: {scanResult}
          </div>
        )}

        <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: 12, width: "100%" }}>
          Close & Login Normally
        </button>
      </div>
    </div>
  );
}
