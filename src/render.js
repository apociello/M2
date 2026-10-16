// Everything that touches the DOM. Text always goes through textContent: it comes from the API.

import { RECENT_DAYS } from './logic.js';

const statusBox = document.querySelector('#status');
const results = document.querySelector('#results');

const MAX_GAMES_LISTED = 20;
const OUTCOME_LABELS = { win: 'W', draw: 'D', loss: 'L' };
const gameDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function el(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== '') node.textContent = text;
  return node;
}

export function renderLoading(username) {
  statusBox.className = 'status status-loading';
  statusBox.textContent = `Scouting ${username}…`;
  results.replaceChildren();
}

export function renderError(message) {
  statusBox.className = 'status status-error';
  statusBox.textContent = message;
  results.replaceChildren();
}

function clearStatus() {
  statusBox.className = 'status';
  statusBox.textContent = '';
}

function ratingsList(ratings) {
  const list = el('ul', 'ratings');
  const items = ratings.map(({ timeClass, rating, best }) => {
    const item = el('li', 'rating');
    item.append(
      el('span', 'rating-label', timeClass),
      el('strong', 'rating-value', String(rating)),
    );
    if (best) item.append(el('span', 'rating-best', `best ${best}`));
    return item;
  });
  list.append(...items);
  return list;
}

function gameRow(game) {
  const link = el('a', 'game');
  link.href = game.url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.append(
    el('span', `result result-${game.outcome}`, OUTCOME_LABELS[game.outcome]),
    el('span', 'game-opponent', `${game.opponent.username} (${game.opponent.rating})`),
    el('span', 'game-meta', `${game.color} · ${game.timeClass}`),
    el('time', 'game-meta', gameDate.format(game.playedAt)),
  );
  const item = el('li');
  item.append(link);
  return item;
}

function gamesSection(games) {
  const section = el('section', 'games-section');

  if (games.length === 0) {
    section.append(el('p', 'empty', `No games in the last ${RECENT_DAYS} days.`));
    return section;
  }

  const shown = games.slice(0, MAX_GAMES_LISTED);
  const list = el('ol', 'games');
  list.append(...shown.map(gameRow));
  section.append(el('h3', '', `Last ${RECENT_DAYS} days · showing ${shown.length} of ${games.length} games`), list);
  return section;
}

export function renderPlayer(profile, ratings, games) {
  clearStatus();

  const card = el('article', 'player');

  if (profile.avatar) {
    const avatar = el('img', 'avatar');
    avatar.src = profile.avatar;
    avatar.alt = '';
    card.append(avatar);
  }

  const heading = el('h2', '', profile.username);
  if (profile.title) heading.prepend(el('span', 'title-badge', profile.title), ' ');

  const link = el('a', '', 'View on Chess.com');
  link.href = profile.url;
  link.target = '_blank';
  link.rel = 'noopener';

  card.append(heading);
  if (profile.name) card.append(el('p', '', profile.name));
  card.append(el('p', '', `${profile.followers} followers`), link);
  if (ratings.length > 0) card.append(ratingsList(ratings));
  card.append(gamesSection(games));

  results.replaceChildren(card);
}
