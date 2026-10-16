const BASE_URL = 'https://api.chess.com/pub/player';

function messageFor(status) {
  if (status === 404) return 'Player not found on Chess.com.';
  if (status === 429) return 'Too many requests. Wait a few seconds and try again.';
  return `Chess.com answered with an error (${status}).`;
}

// The only place that calls fetch, so every request is checked the same way
async function fetchJson(url) {
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
  return response.json();
}

function getProfile(username) {
  return fetchJson(`${BASE_URL}/${encodeURIComponent(username)}`);
}

function getStats(username) {
  return fetchJson(`${BASE_URL}/${encodeURIComponent(username)}/stats`);
}

export async function getPlayer(username) {
  // Independent requests: both start at once instead of waiting for each other
  const [profile, stats] = await Promise.all([getProfile(username), getStats(username)]);
  return { profile, stats };
}
