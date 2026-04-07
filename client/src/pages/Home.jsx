import games from "../games/gameList";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="mario-layer" aria-hidden="true">
        <span className="mario-run run-1" />
        <span className="mario-run run-2 reverse" />
        <span className="mario-run run-3" />
        <span className="mario-run run-4 reverse" />
      </div>
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-semibold mb-3 text-center"
        >
          Choose Your Game
        </motion.h1>
        <p className="ui-muted text-center mb-8">
          Quick arcade sessions with clean leaderboards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
