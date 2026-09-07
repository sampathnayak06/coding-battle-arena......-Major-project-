import { useEffect, useRef } from "react";

const KEYWORDS = ["FUNCTION", "RECURSION", "COMPILER", "DEBUG", "EXECUTE", "SYNTAX"];
const COLORS = ["#00E5FF", "#9D4EDD", "#FF2E88"];

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;
    let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawnParticles() {
      const count = Math.max(10, Math.floor((canvas.width * canvas.height) / 90000));
      particles = Array.from({ length: count }, () => ({
        text: KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.15 + Math.random() * 0.3,
        size: 10 + Math.random() * 6,
        opacity: 0.05 + Math.random() * 0.08
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "600 14px 'JetBrains Mono', monospace";
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.text, p.x, p.y);
        if (!prefersReducedMotion) {
          p.y -= p.speed;
          if (p.y < -20) {
            p.y = canvas.height + 20;
            p.x = Math.random() * canvas.width;
          }
        }
      }
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    spawnParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      spawnParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
