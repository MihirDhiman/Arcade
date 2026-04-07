import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  if (!game) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="ui-card rounded-3xl p-6 transition hover:shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-widest ui-muted">
          Mini Game
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/10">
          {game.id}
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-2">
        {game.name}
      </h2>

      <p className="text-sm ui-muted mb-4">
        {game.description}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/game/${game.id}`)}
          className="flex-1 btn-primary rounded-xl py-2.5 text-sm"
        >
          Play
        </button>

        <button
          onClick={() =>
            navigate(`/leaderboard/${game.id}`)
          }
          className="flex-1 btn-secondary rounded-xl py-2.5 text-sm"
        >
          Scores
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs ui-muted">
        <span>Fast sessions</span>
        <span className="h-1.5 w-24 rounded-full bg-gradient-to-r from-indigo-400/80 to-purple-400/80" />
      </div>
    </motion.div>
  );
};

export default GameCard;
