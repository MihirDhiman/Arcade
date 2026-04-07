import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getLeaderboard } from "../api/api";

const Leaderboard = () => {
  const { gameId } = useParams();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const data = await getLeaderboard(gameId);
      setScores(data || []);
    };

    fetchScores();
  }, [gameId]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center p-6">
        <div className="w-full max-w-2xl mb-6">
          <h1 className="text-3xl font-semibold capitalize">
            {gameId} Leaderboard
          </h1>
          <p className="ui-muted text-sm mt-1">
            Top runs from the community.
          </p>
        </div>

        <div className="w-full max-w-2xl ui-panel rounded-3xl p-6">
          {scores.length === 0 ? (
            <p className="text-center ui-muted">
              No scores yet...
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest ui-muted px-3">
                <span>Rank</span>
                <span>Score</span>
              </div>
              {scores.map((item, index) => (
                <div
                  key={item._id}
                  className={`flex items-center justify-between ui-card p-4 rounded-2xl transition ${
                    index < 3 ? "border border-amber-300/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-semibold ${
                        index === 0
                          ? "bg-amber-400/80 text-slate-900"
                          : index === 1
                          ? "bg-slate-200/80 text-slate-900"
                          : index === 2
                          ? "bg-orange-300/80 text-slate-900"
                          : "bg-white/10"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        {item.userId?.username ?? "Anonymous"}
                      </p>
                      <p className="text-xs ui-muted">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {item.score}
                    </p>
                    <p className="text-xs ui-muted">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
