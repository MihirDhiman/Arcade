import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import Leaderboard from "../pages/Leaderboard";

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/leaderboard/:gameId" element={<Leaderboard />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
