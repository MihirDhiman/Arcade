import { useEffect, useState } from "react";
import { saveScore } from "../api/api";
import { useRef } from "react";

const SIZE = 8;
const TYPES = ["🍎", "🍌", "🍇", "🍒", "🍍"];
const TILE_STYLES = {
  "🍎": "from-red-400/90 to-red-600/90",
  "🍌": "from-yellow-300/90 to-yellow-500/90",
  "🍇": "from-purple-400/90 to-purple-600/90",
  "🍒": "from-rose-400/90 to-rose-600/90",
  "🍍": "from-amber-300/90 to-amber-500/90",
};

const randomTile = () =>
  TYPES[Math.floor(Math.random() * TYPES.length)];

const createBoard = () => {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => randomTile())
  );
};

const Match3 = () => {
  const [board, setBoard] = useState(createBoard());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const savedRef = useRef(false);

  // Swap tiles
  const swapTiles = (a, b, grid) => {
    const newGrid = grid.map((row) => [...row]);
    const temp = newGrid[a.r][a.c];
    newGrid[a.r][a.c] = newGrid[b.r][b.c];
    newGrid[b.r][b.c] = temp;
    return newGrid;
  };

  // Find matches
  const findMatches = (grid) => {
    const matches = [];

    // Horizontal
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE - 2; c++) {
        const tile = grid[r][c];
        if (
          tile &&
          tile === grid[r][c + 1] &&
          tile === grid[r][c + 2]
        ) {
          matches.push([r, c], [r, c + 1], [r, c + 2]);
        }
      }
    }

    // Vertical
    for (let c = 0; c < SIZE; c++) {
      for (let r = 0; r < SIZE - 2; r++) {
        const tile = grid[r][c];
        if (
          tile &&
          tile === grid[r + 1][c] &&
          tile === grid[r + 2][c]
        ) {
          matches.push([r, c], [r + 1, c], [r + 2, c]);
        }
      }
    }

    return matches;
  };

  useEffect(() => {
    if (score >= 500 && !savedRef.current) {
      saveScore("match3", score);
      savedRef.current = true;
    }
  }, [score]);

  // Remove matches
  const removeMatches = (grid, matches) => {
    const newGrid = grid.map((row) => [...row]);

    matches.forEach(([r, c]) => {
      newGrid[r][c] = null;
    });

    return newGrid;
  };

  // Drop tiles (gravity)
  const dropTiles = (grid) => {
    const newGrid = grid.map((row) => [...row]);

    for (let c = 0; c < SIZE; c++) {
      let empty = SIZE - 1;

      for (let r = SIZE - 1; r >= 0; r--) {
        if (newGrid[r][c] !== null) {
          newGrid[empty][c] = newGrid[r][c];
          if (empty !== r) newGrid[r][c] = null;
          empty--;
        }
      }
    }

    return newGrid;
  };

  // Fill new tiles
  const refill = (grid) => {
    return grid.map((row) =>
      row.map((cell) => (cell === null ? randomTile() : cell))
    );
  };

  // Resolve matches (cascade loop)
  const resolveBoard = (grid) => {
    let current = grid;
    let totalMatches = 0;

    while (true) {
      const matches = findMatches(current);

      if (matches.length === 0) break;

      totalMatches += matches.length;

      current = removeMatches(current, matches);
      current = dropTiles(current);
      current = refill(current);
    }

    if (totalMatches > 0) {
      setScore((prev) => prev + totalMatches * 10);
    }

    return current;
  };

  // Handle click
  const handleClick = (r, c) => {
    if (!selected) {
      setSelected({ r, c });
      return;
    }

    const isAdjacent =
      Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;

    if (!isAdjacent) {
      setSelected({ r, c });
      return;
    }

    let newBoard = swapTiles(selected, { r, c }, board);

    const matches = findMatches(newBoard);

    if (matches.length === 0) {
      setSelected(null);
      return;
    }

    newBoard = resolveBoard(newBoard);

    setBoard(newBoard);
    setSelected(null);
  };

  // Initial cleanup (avoid starting matches)
  useEffect(() => {
    setBoard((prev) => resolveBoard(prev));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="ui-card px-4 py-2 rounded-xl text-sm">
          <span className="ui-muted">Score</span>
          <span className="ml-2 font-semibold">{score}</span>
        </div>
        <div className="ui-card px-4 py-2 rounded-xl text-sm">
          <span className="ui-muted">Goal</span>
          <span className="ml-2 font-semibold">500</span>
        </div>
      </div>

      <div className="ui-panel p-4 rounded-2xl">
        <div className="grid grid-cols-8 gap-2">
        {board.map((row, r) =>
          row.map((tile, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              className={`w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer text-lg shadow-sm bg-gradient-to-br ${
                tile ? TILE_STYLES[tile] : "from-slate-500/40 to-slate-700/40"
              } ${
                selected?.r === r && selected?.c === c
                  ? "ring-2 ring-amber-300 scale-105"
                  : "hover:scale-105"
              }`}
            >
              {tile}
            </div>
          ))
        )}
        </div>
      </div>
      <button
        onClick={() => {
            savedRef.current = false;
            setBoard(createBoard());
            setScore(0);
        }}
        className="btn-primary px-4 py-2 rounded-lg"
        >
        Restart
        </button>
    </div>
  );
};

export default Match3;
