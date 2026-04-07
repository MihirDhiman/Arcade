import { useEffect, useRef, useState } from "react";
import { saveScore } from "../api/api";

const segments = [
  { label: "10", color: "#ef4444" },
  { label: "20", color: "#22c55e" },
  { label: "50", color: "#3b82f6" },
  { label: "100", color: "#f59e0b" },
  { label: "200", color: "#a855f7" },
  { label: "500", color: "#ec4899" },
];

const SpinWheel = () => {
  const canvasRef = useRef(null);

  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const spinVelocity = useRef(0);
  const savedRef = useRef(false);

  const drawWheel = (ctx, currentAngle) => {
    const size = 300;
    const center = size / 2;
    const radius = 130;
    const arc = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, size, size);

    // Backplate
    ctx.beginPath();
    ctx.arc(center, center, radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fill();

    segments.forEach((seg, i) => {
      const start = i * arc + currentAngle;
      const end = start + arc;

      // Slice
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.closePath();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#0f172a";
      ctx.font = "600 16px \"Space Grotesk\", sans-serif";
      ctx.fillText(seg.label, radius - 10, 5);
      ctx.restore();
    });

    // Center hub
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#e2e8f0";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(center, center, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();

    // Pointer
    ctx.beginPath();
    ctx.moveTo(center - 14, 6);
    ctx.lineTo(center + 14, 6);
    ctx.lineTo(center, 32);
    ctx.fillStyle = "#e2e8f0";
    ctx.fill();
  };

  // Spin logic
  const spin = () => {
  if (spinning) return;

    savedRef.current = false; // 🔥 reset

    setResult(null);
    setSpinning(true);

    spinVelocity.current = Math.random() * 0.3 + 0.4;
    };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const animate = () => {
      if (spinning) {
        spinVelocity.current *= 0.97; // friction

        if (spinVelocity.current < 0.002) {
          setSpinning(false);

          const normalized =
            (angle % (2 * Math.PI) + 2 * Math.PI) %
            (2 * Math.PI);

          const index =
            segments.length -
            Math.floor(
              (normalized / (2 * Math.PI)) *
                segments.length
            ) -
            1;

          const winValue = Number(segments[index].label);
            setResult(winValue);

            if (!savedRef.current) {
            saveScore("spin", winValue);
            savedRef.current = true;
            }
          return;
        }

        setAngle((prev) => prev + spinVelocity.current);
      }

      drawWheel(ctx, angle);
      requestAnimationFrame(animate);
    };

    animate();
  }, [spinning, angle]);

  return (
    <div className="flex flex-col items-center">
      <div className="ui-panel rounded-3xl p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded-full ui-canvas"
          />
          <div className="absolute inset-0 rounded-full ring-4 ring-white/10 pointer-events-none" />
        </div>

        <button
          onClick={spin}
          className="btn-primary px-6 py-2.5 rounded-xl disabled:opacity-50 text-sm"
          disabled={spinning}
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>

        {result && (
          <p className="text-sm text-emerald-400">
            You got: <span className="font-semibold">{result}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;
