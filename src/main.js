import './style.css';
import { getPlayer } from './api.js';
import { prepareGames, summarizeRatings } from './logic.js';
import { renderError, renderLoading, renderPlayer } from './render.js';

const form = document.querySelector('#search-form');
const usernameInput = document.querySelector('#username');

async function scout(username) {
  renderLoading(username);
  try {
    const { profile, stats, games } = await getPlayer(username);
    renderPlayer(profile, summarizeRatings(stats), prepareGames(games, username));
  } catch (error) {
    renderError(error.message);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const username = usernameInput.value.trim().toLowerCase();
  if (username === '') {
    renderError('Type a Chess.com username first.');
    return;
  }
  scout(username);
}

form.addEventListener('submit', handleSubmit);
