import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/themeStore";
import { useUserStore } from "../store/userStore";
import UsernameModal from "./UsernameModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useThemeStore();
  const { username } = useUserStore();
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    if (!username) {
      setShowUsernameModal(true);
    }
  }, [username]);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full px-6 py-4 ui-panel border-b border-transparent"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-400/80 via-purple-500/80 to-fuchsia-500/80 shadow-xl" />
          <div>
            <p className="text-lg font-semibold tracking-tight">
              Arcade
            </p>
            <p className="text-xs ui-muted">
              Play. Score. Repeat.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {username && (
            <span className="px-3 py-2 rounded-xl text-sm bg-white/10">
              {username}
            </span>
          )}
          <button
            onClick={() => setShowUsernameModal(true)}
            className="btn-secondary px-3 py-2 rounded-xl text-sm"
          >
            {username ? "Change name" : "Set username"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-primary px-4 py-2 rounded-xl text-sm"
          >
            Home
          </button>

          <button
            onClick={toggleTheme}
            className="btn-secondary px-3 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                dark ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            {dark ? "Dark" : "Light"}
          </button>
        </div>
      </div>
      <UsernameModal
        open={showUsernameModal}
        required={!username}
        onClose={() => setShowUsernameModal(false)}
      />
    </motion.div>
  );
};

export default Navbar;
