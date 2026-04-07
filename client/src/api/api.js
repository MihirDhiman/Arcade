const BASE_URL = "http://localhost:5000/api";
const USERNAME_KEY = "arcade_username";

export const normalizeUsername = (value) => value.trim().toLowerCase();

export const getStoredUsername = () =>
  localStorage.getItem(USERNAME_KEY);

export const setStoredUsername = (username) => {
  localStorage.setItem(USERNAME_KEY, username);
};

export const clearStoredUsername = () => {
  localStorage.removeItem(USERNAME_KEY);
};

export const registerUsername = async (rawUsername) => {
  const username = normalizeUsername(rawUsername);
  if (!username) {
    return { ok: false, status: 400, data: { message: "Invalid username" } };
  }
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data, username };
};

export const saveScore = async (gameName, score) => {
  try {
    let username = getStoredUsername();
    if (!username) return;

    let res = await fetch(`${BASE_URL}/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameName, score, username }),
    });

    if (res.status === 404) {
      const registerResult = await registerUsername(username);
      if (registerResult.ok) {
        res = await fetch(`${BASE_URL}/score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameName, score, username }),
        });
      } else {
        clearStoredUsername();
      }
    }

    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

export const getLeaderboard = async (gameName) => {
  try {
    const res = await fetch(
      `${BASE_URL}/leaderboard/${gameName}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};
