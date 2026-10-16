// Pure functions: raw API data in, clean data out. No DOM, no fetch.

const TIME_CLASSES = ['bullet', 'blitz', 'rapid', 'daily'];
export const RECENT_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;
const DRAW_RESULTS = new Set(['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient']);

// stats looks like { chess_blitz: { last: { rating }, best: { rating }, record }, ... }
export function summarizeRatings(stats) {
  return TIME_CLASSES
    .filter((timeClass) => stats[`chess_${timeClass}`])
    .map((timeClass) => {
      const { last, best } = stats[`chess_${timeClass}`];
      return { timeClass, rating: last.rating, best: best?.rating ?? null };
    });
}

// Chess.com gives 'win', or the reason you didn't win ('resigned', 'timeout', 'agreed'...)
function outcomeOf(result) {
  if (result === 'win') return 'win';
  return DRAW_RESULTS.has(result) ? 'draw' : 'loss';
}

// Rewrites a game from the scouted player's point of view
function normalizeGame(game, username) {
  const isWhite = game.white.username.toLowerCase() === username;
  const player = isWhite ? game.white : game.black;
  const opponent = isWhite ? game.black : game.white;
  return {
    url: game.url,
    playedAt: game.end_time * 1000, // the API uses seconds, JS dates use milliseconds
    timeClass: game.time_class,
    color: isWhite ? 'white' : 'black',
    outcome: outcomeOf(player.result),
    opponent: { username: opponent.username, rating: opponent.rating },
  };
}

// Standard chess only (no Chess960, bughouse...) from the last RECENT_DAYS, newest first
export function prepareGames(rawGames, username, now = Date.now()) {
  const since = now - RECENT_DAYS * DAY_MS;
  return rawGames
    .filter((game) => game.rules === 'chess' && game.end_time * 1000 >= since)
    .map((game) => normalizeGame(game, username))
    .sort((a, b) => b.playedAt - a.playedAt); // safe: sorts the new array from map, not rawGames
}
