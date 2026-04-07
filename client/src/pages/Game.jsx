import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import Snake from "../games/Snake";
import Memory from "../games/Memory";
import SpinWheel from "../games/SpinWheel";
import Runner from "../games/Runner";
import Match3 from "../games/Match3";

const Game = () => {
  const { gameId } = useParams();

  const renderGame = () => {
    switch (gameId) {
      case "snake":
        return <Snake />;
      case "memory":
        return <Memory />;
      case "spin":
        return <SpinWheel />;
      case "runner":
        return <Runner />;
      case "match3":
        return <Match3 />;
      default:
        return <p>Game not found</p>;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-semibold mb-4 capitalize">
          {gameId}
        </h1>

        <div className="w-full max-w-2xl p-5 rounded-2xl ui-panel">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};

export default Game;
