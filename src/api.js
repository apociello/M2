import { readCache, writeCache } from './cache.js';

const BASE_URL = 'https://api.chess.com/pub/player';
const MONTHS_TO_LOAD = 2; // "last 30 days" can span the current and the previous month

function messageFor(status) {
  if (status === 404) return 'Player not found on Chess.com.';
  if (status === 429) return 'Too many requests. Wait a few seconds and try again.';
  return `Chess.com answered with an error (${status}).`;
}

// The only place that calls fetch, so every request is checked the same way
async function fetchJson(url) {
  const cached = readCache(url);
  if (cached) return cached;

  let response;
  try {
    response = await fetch(url);
  } catch {
    // fetch only rejects when there is no response at all (offline, DNS, CORS)
    throw new Error('Could not reach Chess.com. Check your connection.');
  }
  // A 404 or 500 is still a response, so fetch does not reject: we check it ourselves
  if (!response.ok) {
    throw new Error(messageFor(response.status));
  }
  const data = await response.json();
  writeCache(url, data);
  return data;
}

function getProfile(username) {
  return fetchJson(`${BASE_URL}/${encodeURIComponent(username)}`);
}

function getStats(username) {
  return fetchJson(`${BASE_URL}/${encodeURIComponent(username)}/stats`);
}

// Returns the list of monthly archive URLs, e.g. '.../games/2026/10'
async function getArchives(username) {
  const data = await fetchJson(`${BASE_URL}/${encodeURIComponent(username)}/games/archives`);
  return data.archives;
}

async function getMonthGames(archiveUrl) {
  const data = await fetchJson(archiveUrl);
  return data.games;
}

async function getRecentGames(username) {
  // Sequential on purpose: we need the archive list to know which months to ask for
  const archives = await getArchives(username);
  const months = await Promise.all(archives.slice(-MONTHS_TO_LOAD).map(getMonthGames));
  return months.flat();
}

export async function getPlayer(username) {
  // Independent requests: all start at once instead of waiting for each other
  const [profile, stats, games] = await Promise.all([
    getProfile(username),
    getStats(username),
    getRecentGames(username),
  ]);
  return { profile, stats, games };
}
