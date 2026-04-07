# GPT CHAT

" https://chatgpt.com/share/69d4eb73-88b0-83e8-9e50-c618c8c4c953 "

# Prompt History

This file summarizes the chat prompts used to build the project in this session.
Dates are based on the current session date.

## Entry 1
Date: 2026-04-07
Time: Session start
Author: User
Context (feature/bug/task): Backend crash
Prompt: "fix backend" + error log about missing User model
Outcome / Notes: Fixed missing model import, added ESM type.
Files Changed: server/models/User.js, server/package.json

## Entry 2
Date: 2026-04-07
Time: Session
Author: User
Context: Frontend error
Prompt: "Home.jsx:13 Uncaught TypeError: Cannot read properties of undefined (reading 'name')"
Outcome / Notes: Guarded GameCard against undefined game.
Files Changed: client/src/components/GameCard.jsx

## Entry 3
Date: 2026-04-07
Time: Session
Author: User
Context: UI + gameplay
Prompt: "runner stop on game over, make runner a man, dark/light mode, match3 UI better, professional UI"
Outcome / Notes: Updated Runner loop, theme system, Match3 UI, global styling.
Files Changed: client/src/games/Runner.jsx, client/src/games/Match3.jsx, client/src/store/themeStore.js, client/src/App.jsx, client/src/index.css, client/src/components/Navbar.jsx, client/src/components/GameCard.jsx, client/src/pages/Home.jsx, client/src/pages/Game.jsx, client/src/pages/Leaderboard.jsx, client/index.html

## Entry 4
Date: 2026-04-07
Time: Session
Author: User
Context: Snake game broken
Prompt: "snake game is not working make it working"
Outcome / Notes: Rebuilt Snake loop with refs and fixed saving.
Files Changed: client/src/games/Snake.jsx

## Entry 5
Date: 2026-04-07
Time: Session
Author: User
Context: Modern UI
Prompt: "latest and modern ui of navbar, leaderboard and card"
Outcome / Notes: Enhanced navbar, leaderboard, game cards.
Files Changed: client/src/components/Navbar.jsx, client/src/components/GameCard.jsx, client/src/pages/Leaderboard.jsx

## Entry 6
Date: 2026-04-07
Time: Session
Author: User
Context: Usernames + scores
Prompt: "ask for user name and store user in backend, update score by username"
Outcome / Notes: Added user model, registration endpoint, modal, score updates by username.
Files Changed: server/models/User.js, server/controllers/scoreController.js, server/routes/scroreRoutes.js, client/src/api/api.js, client/src/components/UsernameModal.jsx, client/src/store/userStore.js, client/src/components/Navbar.jsx, client/src/pages/Leaderboard.jsx

## Entry 7
Date: 2026-04-07
Time: Session
Author: User
Context: Score save bug
Prompt: "snake game score is not storing" / "runner score is storing 0"
Outcome / Notes: Fixed score refs to avoid stale state.
Files Changed: client/src/games/Snake.jsx, client/src/games/Runner.jsx

## Entry 8
Date: 2026-04-07
Time: Session
Author: User
Context: Match3 slide + animations
Prompt: "slide to match" + "add slide/removal animations"
Outcome / Notes: Implemented drag swap and cascade animations.
Files Changed: client/src/games/Match3.jsx

## Entry 9
Date: 2026-04-07
Time: Session
Author: User
Context: Arcade theme
Prompt: "arcade theme" + "light mode too" + "pacman background"
Outcome / Notes: Added neon theme, scanlines, Pac-Man background and refinements.
Files Changed: client/src/index.css, client/src/pages/Home.jsx, client/src/App.jsx

## Entry 10
Date: 2026-04-07
Time: Session
Author: User
Context: Replace Pac-Man with Mario
Prompt: "instead of packman make mario running in bg" + "use this image"
Outcome / Notes: Swapped background to Mario runners using image from public, increased size and fixed reverse.
Files Changed: client/src/pages/Home.jsx, client/src/index.css

## Entry 11
Date: 2026-04-07
Time: Session
Author: User
Context: Match3 candy tiles
Prompt: "instead of fruits i want candy crush candy"
Outcome / Notes: Replaced tile types with candy emojis.
Files Changed: client/src/games/Match3.jsx

## Entry 12
Date: 2026-04-07
Time: Session
Author: User
Context: Deployment
Prompt: "deploy on github" + errors (404 assets, no routes matched)
Outcome / Notes: Added gh-pages scripts, Vite base, HashRouter for GitHub Pages.
Files Changed: client/package.json, client/vite.config.js, client/src/router/AppRouter.jsx

## Entry 13
Date: 2026-04-07
Time: Session
Author: User
Context: CORS errors
Prompt: "deployed backend but score not coming" + console errors
Outcome / Notes: Fixed CORS OPTIONS in Express v5.
Files Changed: server/server.js

## Entry 14
Date: 2026-04-07
Time: Session
Author: User
Context: Spin wheel UI
Prompt: "make wheel spin ui better"
Outcome / Notes: Improved wheel styling and layout.
Files Changed: client/src/games/SpinWheel.jsx

## Entry 15
Date: 2026-04-07
Time: Session
Author: User
Context: Navbar layout
Prompt: "navbar buttons floated, logo and buttons position same"
Outcome / Notes: Converted navbar to floating cards.
Files Changed: client/src/components/Navbar.jsx

