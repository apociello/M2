// Saves API responses in localStorage for a while, so the same request isn't repeated

const CACHE_MS = 10 * 60 * 1000; // 10 minutes

export function readCache(key) {
  try {
    const entry = JSON.parse(localStorage.getItem(key));
    return entry && Date.now() < entry.expires ? entry.data : null;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, expires: Date.now() + CACHE_MS }));
  } catch {
    // Storage full or blocked: the app works the same, just without cache
  }
}
