import './style.css';
import { getProfile } from './api.js';
import { renderError, renderLoading, renderProfile } from './render.js';

const form = document.querySelector('#search-form');
const usernameInput = document.querySelector('#username');

async function scout(username) {
  renderLoading(username);
  try {
    const profile = await getProfile(username);
    renderProfile(profile);
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
