import { useEffect, useRef, useState } from "react";
import { saveScore } from "../api/api";

const GRID_SIZE = 20;
const TILE_COUNT = 20;
const CANVAS_SIZE = GRID_SIZE * TILE_COUNT;
const MOVE_SPEED = 120; // ms per move

const Snake = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 5, y: 5 });
  const directionRef = useRef({ x: 0, y: 0 });

  const lastMoveTime = useRef(0);
  const frameRef = useRef(null);
  const loopRef = useRef(null);
  const gameOverRef = useRef(false);
  const savedRef = useRef(false);

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);

  const randomFood = (snake) => {
    let next;
    do {
      next = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };
    } while (snake.some((part) => part.x === next.x && part.y === next.y));
    return next;
  };

  const endGame = () => {
    if (!savedRef.current) {
      saveScore("snake", scoreRef.current);
      savedRef.current = true;
    }
    gameOverRef.current = true;
    setGameOver(true);
  };

  const update = () => {
    const direction = directionRef.current;
    if (direction.x === 0 && direction.y === 0) return;

    const snake = snakeRef.current;
    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= TILE_COUNT ||
      newHead.y >= TILE_COUNT
    ) {
      endGame();
      return;
    }

    // Self collision
    for (const part of snake) {
      if (part.x === newHead.x && part.y === newHead.y) {
        endGame();
        return;
      }
    }

    const newSnake = [newHead, ...snake];

    // Eat food
    const food = foodRef.current;
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore((prev) => {
        const next = prev + 10;
        scoreRef.current = next;
        return next;
      });
      foodRef.current = randomFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
  };

  const draw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Snake
    ctx.fillStyle = "#22c55e";
    snakeRef.current.forEach((part, index) => {
      ctx.fillRect(
        part.x * GRID_SIZE + 1,
        part.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );

      if (index === 0) {
        ctx.fillStyle = "#16a34a";
        ctx.fillRect(
          part.x * GRID_SIZE + 6,
          part.y * GRID_SIZE + 6,
          6,
          6
        );
        ctx.fillStyle = "#22c55e";
      }
    });

    // Food
    const food = foodRef.current;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const startLoop = () => {
    const loop = (time) => {
      if (gameOverRef.current) return;

      if (time - lastMoveTime.current > MOVE_SPEED) {
        update();
        lastMoveTime.current = time;
      }

      draw();
      frameRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = loop;
    frameRef.current = requestAnimationFrame(loop);
  };

  // Controls
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOverRef.current) return;
      const current = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
          if (current.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (current.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (current.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (current.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Initialize canvas and loop
  useEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = canvasRef.current.getContext("2d");
    draw();
    startLoop();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const resetGame = () => {
    savedRef.current = false;
    gameOverRef.current = false;

    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 0, y: 0 };
    foodRef.current = randomFood(snakeRef.current);
    lastMoveTime.current = 0;

    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    draw();

    if (loopRef.current) {
      frameRef.current = requestAnimationFrame(loopRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-lg">
        Score: <span className="font-semibold">{score}</span>
      </p>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="rounded-2xl ui-canvas"
      />

      <p className="mt-2 text-sm ui-muted">
        Use arrow keys to move
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

export default Snake;
