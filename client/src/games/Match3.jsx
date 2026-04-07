import { useEffect, useRef, useState } from "react";
import { saveScore } from "../api/api";

const SIZE = 8;
const TYPES = ["🍬", "🍭", "🍫", "🧁", "🍪"];
const TILE_STYLES = {
  "🍎": "from-red-400/90 to-red-600/90",
  "🍌": "from-yellow-300/90 to-yellow-500/90",
  "🍇": "from-purple-400/90 to-purple-600/90",
  "🍒": "from-rose-400/90 to-rose-600/90",
  "🍍": "from-amber-300/90 to-amber-500/90",
};
const CELL_SIZE = 46;
const TILE_SIZE = 42;
const TILE_OFFSET = (CELL_SIZE - TILE_SIZE) / 2;

const randomTileType = () =>
  TYPES[Math.floor(Math.random() * TYPES.length)];

const createBoard = (makeTile) =>
  Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => makeTile())
  );

const Match3 = () => {
  const idRef = useRef(0);
  const makeTile = () => ({
    id: idRef.current++,
    type: randomTileType(),
  });

  const [board, setBoard] = useState(() => createBoard(makeTile));
  const [score, setScore] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);
  const [removingIds, setRemovingIds] = useState([]);
  const resolvingRef = useRef(false);
  const savedRef = useRef(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const ANIM = {
    swap: 240,
    remove: 320,
    drop: 300,
    refill: 300,
  };

  useEffect(() => {
    if (score >= 500 && !savedRef.current) {
      saveScore("match3", score);
      savedRef.current = true;
    }
  }, [score]);

  const swapTiles = (a, b, grid) => {
    const newGrid = grid.map((row) => [...row]);
    const temp = newGrid[a.r][a.c];
    newGrid[a.r][a.c] = newGrid[b.r][b.c];
    newGrid[b.r][b.c] = temp;
    return newGrid;
  };

  const findMatches = (grid) => {
    const matches = [];

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE - 2; c++) {
        const tile = grid[r][c];
        if (
          tile &&
          tile.type === grid[r][c + 1]?.type &&
          tile.type === grid[r][c + 2]?.type
        ) {
          matches.push([r, c], [r, c + 1], [r, c + 2]);
        }
      }
    }

    for (let c = 0; c < SIZE; c++) {
      for (let r = 0; r < SIZE - 2; r++) {
        const tile = grid[r][c];
        if (
          tile &&
          tile.type === grid[r + 1][c]?.type &&
          tile.type === grid[r + 2][c]?.type
        ) {
          matches.push([r, c], [r + 1, c], [r + 2, c]);
        }
      }
    }

    return matches;
  };

  const removeMatches = (grid, matches) => {
    const newGrid = grid.map((row) => [...row]);
    matches.forEach(([r, c]) => {
      newGrid[r][c] = null;
    });
    return newGrid;
  };

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

  const refill = (grid) =>
    grid.map((row) =>
      row.map((cell) => (cell === null ? makeTile() : cell))
    );

  const resolveBoard = async (grid) => {
    let current = grid;
    let totalMatches = 0;

    while (true) {
      const matches = findMatches(current);
      if (matches.length === 0) break;

      const idsToRemove = matches
        .map(([r, c]) => current[r][c]?.id)
        .filter(Boolean);

      setRemovingIds(idsToRemove);
      await sleep(ANIM.remove);

      totalMatches += matches.length;

      current = removeMatches(current, matches);
      setBoard(current);
      setRemovingIds([]);
      await sleep(120);

      current = dropTiles(current);
      setBoard(current);
      await sleep(ANIM.drop);

      current = refill(current);
      setBoard(current);
      await sleep(ANIM.refill);
    }

    if (totalMatches > 0) {
      setScore((prev) => prev + totalMatches * 10);
    }

    return current;
  };

  const handleSwap = async (start, target) => {
    if (resolvingRef.current) return;

    const newBoard = swapTiles(start, target, board);
    const matches = findMatches(newBoard);

    if (matches.length === 0) return;

    setBoard(newBoard);
    resolvingRef.current = true;
    await sleep(ANIM.swap);
    await resolveBoard(newBoard);
    resolvingRef.current = false;
  };

  const handlePointerDown = (r, c) => {
    if (resolvingRef.current) return;
    setIsDragging(true);
    dragStartRef.current = { r, c };
  };

  const handlePointerEnter = (r, c) => {
    if (!isDragging || !dragStartRef.current) return;
    const start = dragStartRef.current;
    const isAdjacent =
      Math.abs(start.r - r) + Math.abs(start.c - c) === 1;
    if (!isAdjacent) return;

    handleSwap(start, { r, c });
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  useEffect(() => {
    const init = async () => {
      resolvingRef.current = true;
      await resolveBoard(board);
      resolvingRef.current = false;
    };
    init();
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
        <div
          className="relative"
          style={{
            width: SIZE * CELL_SIZE,
            height: SIZE * CELL_SIZE,
            touchAction: "none",
          }}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {board.map((row, r) =>
            row.map((tile, c) => {
              if (!tile) return null;
              const isRemoving = removingIds.includes(tile.id);
              return (
                <div
                  key={tile.id}
                  onPointerDown={() => handlePointerDown(r, c)}
                  onPointerEnter={() => handlePointerEnter(r, c)}
                  className={`absolute flex items-center justify-center rounded-xl cursor-pointer text-lg shadow-sm bg-gradient-to-br ${
                    TILE_STYLES[tile.type]
                  }`}
                  style={{
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    transform: `translate(${c * CELL_SIZE + TILE_OFFSET}px, ${r * CELL_SIZE + TILE_OFFSET}px) scale(${isRemoving ? 0.6 : 1})`,
                    opacity: isRemoving ? 0 : 1,
                    transition: "transform 300ms ease, opacity 300ms ease",
                  }}
                >
                  {tile.type}
                </div>
              );
            })
          )}
        </div>
      </div>

      <button
        onClick={() => {
          savedRef.current = false;
          setBoard(createBoard(makeTile));
          setScore(0);
          setRemovingIds([]);
        }}
        className="btn-primary px-4 py-2 rounded-lg"
      >
        Restart
      </button>
    </div>
  );
};

export default Match3;
