// Pure functions: raw API data in, clean data out. No DOM, no fetch.

const TIME_CLASSES = ['bullet', 'blitz', 'rapid', 'daily'];

// stats looks like { chess_blitz: { last: { rating }, best: { rating }, record }, ... }
export function summarizeRatings(stats) {
  return TIME_CLASSES
    .filter((timeClass) => stats[`chess_${timeClass}`])
    .map((timeClass) => {
      const { last, best } = stats[`chess_${timeClass}`];
      return { timeClass, rating: last.rating, best: best?.rating ?? null };
    });
}
