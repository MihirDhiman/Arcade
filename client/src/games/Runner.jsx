import { useEffect, useRef, useState } from "react";
import { saveScore } from "../api/api";

const Runner = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const loopRef = useRef(null);
  const gameOverRef = useRef(false);

  const CANVAS = {
    width: 600,
    height: 300,
    groundY: 220,
  };

  const player = useRef({
    x: 50,
    y: CANVAS.groundY - 40,
    width: 26,
    height: 40,
    dy: 0,
    gravity: 0.6,
    jumpForce: -12,
    grounded: true,
  });

  const obstacles = useRef([]);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const speed = useRef(4);
  const savedRef = useRef(false);

  // Jump control
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" && player.current.grounded) {
        player.current.dy = player.current.jumpForce;
        player.current.grounded = false;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const loop = () => {
      if (gameOverRef.current) return;
      update();
      draw(ctx);
      frameRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = loop;

    if (!gameOver) {
      frameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameOver]);

  const update = () => {
    const p = player.current;

    // Apply gravity
    p.dy += p.gravity;
    p.y += p.dy;

    // Ground collision
    if (p.y > CANVAS.groundY - p.height) {
      p.y = CANVAS.groundY - p.height;
      p.dy = 0;
      p.grounded = true;
    }

    // Spawn obstacles
    if (Math.random() < 0.02) {
      obstacles.current.push({
        x: CANVAS.width,
        y: CANVAS.groundY - 36,
        width: 22,
        height: 36,
      });
    }

    // Move obstacles
    obstacles.current.forEach((obs) => {
      obs.x -= speed.current;
    });

    // Remove off-screen
    obstacles.current = obstacles.current.filter(
      (obs) => obs.x > -50
    );

    // Collision
    for (let obs of obstacles.current) {
      if (
        p.x < obs.x + obs.width &&
        p.x + p.width > obs.x &&
        p.y < obs.y + obs.height &&
        p.y + p.height > obs.y
      ) {
        if (!savedRef.current) {
          saveScore("runner", score);
          savedRef.current = true;
        }
        gameOverRef.current = true;
        setGameOver(true);
      }
    }

    // Increase difficulty
    speed.current += 0.001;

    // Score
    setScore((prev) => prev + 1);
  };

  const draw = (ctx) => {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Ground
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, CANVAS.groundY, CANVAS.width, CANVAS.height - CANVAS.groundY);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, CANVAS.groundY - 6, CANVAS.width, 6);

    // Player (simple runner silhouette)
    const p = player.current;
    const centerX = p.x + p.width / 2;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;

    // Head
    ctx.beginPath();
    ctx.fillStyle = "#22c55e";
    ctx.arc(centerX, p.y + 8, 6, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(centerX, p.y + 14);
    ctx.lineTo(centerX, p.y + 26);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(centerX - 6, p.y + 18);
    ctx.lineTo(centerX + 6, p.y + 20);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(centerX, p.y + 26);
    ctx.lineTo(centerX - 6, p.y + 36);
    ctx.moveTo(centerX, p.y + 26);
    ctx.lineTo(centerX + 7, p.y + 36);
    ctx.stroke();

    // Obstacles
    ctx.fillStyle = "#ef4444";
    obstacles.current.forEach((obs) => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
  };

  const resetGame = () => {
    savedRef.current = false;
    gameOverRef.current = false;
    player.current = {
      x: 50,
      y: CANVAS.groundY - 40,
      width: 26,
      height: 40,
      dy: 0,
      gravity: 0.6,
      jumpForce: -12,
      grounded: true,
    };

    obstacles.current = [];
    speed.current = 4;

    setScore(0);
    setGameOver(false);
    if (loopRef.current) {
      frameRef.current = requestAnimationFrame(loopRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-lg">Score: {score}</p>

      <canvas
        ref={canvasRef}
        width={CANVAS.width}
        height={CANVAS.height}
        className="rounded-2xl border border-white/20"
      />

      <p className="mt-2 text-sm text-gray-400">
        Press SPACE to jump
      </p>

      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-red-400 mb-2">Game Over</p>
          <button
            onClick={resetGame}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Runner;
