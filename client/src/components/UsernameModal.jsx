import { useEffect, useState } from "react";
import { registerUsername } from "../api/api";
import { useUserStore } from "../store/userStore";

const UsernameModal = ({ open, required, onClose }) => {
  const { setUsername } = useUserStore();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setValue("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!value.trim()) {
      setError("Please enter a username.");
      return;
    }

    setLoading(true);
    const result = await registerUsername(value);
    setLoading(false);

    if (result.ok) {
      setUsername(result.username);
      onClose();
      return;
    }

    if (result.status === 409) {
      setError("Username already exists. Try another.");
      return;
    }

    setError("Unable to register username. Try again.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="ui-panel w-full max-w-md rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Choose a username</h3>
            <p className="text-sm ui-muted mt-1">
              Scores will be saved under this name.
            </p>
          </div>
          {!required && (
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-3 py-1 rounded-lg text-xs"
            >
              Close
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. player_one"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-400"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-xl py-2.5 text-sm"
          >
            {loading ? "Saving..." : "Save username"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;
