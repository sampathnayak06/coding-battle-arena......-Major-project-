import { useEffect, useState } from "react";
import "./ControlsHUD.css";

const STORAGE_KEYS = {
  volume: "cba_volume",
  brightness: "cba_brightness",
  zoom: "cba_zoom"
};

function readNumber(key, fallback) {
  const v = localStorage.getItem(key);
  return v === null ? fallback : Number(v);
}

export default function ControlsHUD({ visible = true }) {
  if (!visible) return null;
  const [volume, setVolume] = useState(readNumber(STORAGE_KEYS.volume, 1));
  const [brightness, setBrightness] = useState(readNumber(STORAGE_KEYS.brightness, 1));
  const [zoom, setZoom] = useState(readNumber(STORAGE_KEYS.zoom, 1));

  useEffect(() => {
    // Persist
    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
    localStorage.setItem(STORAGE_KEYS.brightness, String(brightness));
    // Apply volume to any existing <audio> elements
    try {
      document.querySelectorAll("audio").forEach((a) => {
        a.volume = volume;
      });
    } catch (e) {}
  }, [volume, brightness]);

  useEffect(() => {
    // ensure audio resumed on first user gesture
    function resumeOnFirst() {
      import("../sfx.js").then((m) => m.default.resumeAudio?.()).catch(() => {});
      window.removeEventListener("pointerdown", resumeOnFirst);
      window.removeEventListener("keydown", resumeOnFirst);
    }
    window.addEventListener("pointerdown", resumeOnFirst, { once: true });
    window.addEventListener("keydown", resumeOnFirst, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resumeOnFirst);
      window.removeEventListener("keydown", resumeOnFirst);
    };
  }, []);

  useEffect(() => {
    // Apply brightness via CSS filter on the root app shell
    const root = document.documentElement || document.body;
    if (root) {
      root.style.setProperty("--cba-brightness", String(brightness));
    }
    localStorage.setItem(STORAGE_KEYS.brightness, String(brightness));
  }, [brightness]);

  useEffect(() => {
    // Apply zoom by scaling the app-shell element
    const shell = document.querySelector(".app-shell");
    if (shell) {
      shell.style.transformOrigin = "top center";
      shell.style.transform = `scale(${zoom})`;
    }
    localStorage.setItem(STORAGE_KEYS.zoom, String(zoom));
  }, [zoom]);

  function handleReset() {
    setVolume(1);
    setBrightness(1);
    setZoom(1);
  }

  return (
    <div className="controls-hud" role="region" aria-label="Game controls">
      <div className="controls-row">
        <div className="control-group">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => { setVolume(Number(e.target.value)); import('../sfx.js').then(m=>m.default.playClick?.()).catch(()=>{}); }}
          />
        </div>

        <div className="control-group">
          <label>Brightness</label>
          <input
            type="range"
            min="0.5"
            max="1.4"
            step="0.01"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
          />
        </div>

        <div className="control-group zoom-group">
          <label>Zoom</label>
          <div className="zoom-actions">
            <button type="button" onClick={() => { setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2))); import('../sfx.js').then(m=>m.default.playClick?.()).catch(()=>{}); }}>-</button>
            <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => { setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2))); import('../sfx.js').then(m=>m.default.playClick?.()).catch(()=>{}); }}>+</button>
          </div>
        </div>
      </div>

      <div className="controls-footer">
        <button className="btn btn-ghost" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
