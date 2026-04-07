import { useEffect, useState, useRef } from "react";
import { saveScore } from "../api/api";

const symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🥝", "🍉", "🍑"];

const shuffleArray = (array) => {
  return [...array]
    .concat(array)
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false,
    }));
};

const Memory = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const savedRef = useRef(false);

  // Initialize game
  useEffect(() => {
    setCards(shuffleArray(symbols));
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Handle matching logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((m) => m + 1);

      const [first, second] = flippedCards;

      if (first.symbol === second.symbol) {
        setCards((prev) =>
          prev.map((card) =>
            card.symbol === first.symbol
              ? { ...card, matched: true }
              : card
          )
        );
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  }, [flippedCards]);

  // Detect win
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setGameOver(true);
    }
  }, [cards]);

  // Save score ONCE after game ends
  useEffect(() => {
    if (!gameOver || savedRef.current) return;

    const finalScore = Math.max(1000 - moves * 10 - time * 2, 0);

    saveScore("memory", finalScore);
    savedRef.current = true;
  }, [gameOver]);

  const handleFlip = (card) => {
    if (
      gameOver ||
      card.flipped ||
      card.matched ||
      flippedCards.length === 2
    )
      return;

    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );

    setFlippedCards((prev) => [...prev, card]);
  };

  const resetGame = () => {
    savedRef.current = false;

    setCards(shuffleArray(symbols));
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setGameOver(false);
  };

  const finalScore = Math.max(1000 - moves * 10 - time * 2, 0);

  return (
    <div className="flex flex-col items-center">
      {/* Stats */}
      <div className="flex gap-6 mb-4">
        <p>⏱ Time: {time}s</p>
        <p>🎯 Moves: {moves}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleFlip(card)}
            className="w-16 h-16 perspective"
            >
            <div
                className={`card-inner ${
                card.flipped || card.matched ? "rotate-y-180" : ""
                }`}
                style={{
                transform:
                    card.flipped || card.matched
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                }}
            >
                {/* FRONT */}
                <div className="card-front ">
                ?
                </div>

                {/* BACK */}
                <div className="card-back">
                {card.symbol}
                </div>
            </div>
            </div>
        ))}
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-green-400 mb-2">
            🎉 You Win!
          </p>

          <p className="mb-2">
            Final Score: {finalScore}
          </p>

          <button
            onClick={resetGame}
            className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Memory;