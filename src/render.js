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
  statusBox.replaceChildren(el('span', 'spinner'), `Scouting ${username}…`);
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

function outcomeBar({ win, draw, loss }) {
  const total = win + draw + loss;
  const bar = el('div', 'outcome-bar');
  const segments = Object.entries({ win, draw, loss })
    .filter(([, count]) => count > 0)
    .map(([outcome, count]) => {
      const segment = el('span', `segment result-${outcome}`, String(count));
      segment.style.width = `${(count / total) * 100}%`;
      return segment;
    });
  bar.append(...segments);
  return bar;
}

function tile(label, value) {
  const box = el('div', 'tile');
  box.append(el('span', 'tile-label', label), el('strong', 'tile-value', value));
  return box;
}

function reportSection(report) {
  const tiles = el('div', 'tiles');
  tiles.append(
    tile('Games', String(report.total)),
    tile('Win rate', `${report.winRate}%`),
    tile('As white', `${report.whiteWinRate}%`),
    tile('As black', `${report.blackWinRate}%`),
  );
  const section = el('section', 'report');
  section.append(el('h3', '', `Last ${RECENT_DAYS} days`), outcomeBar(report.counts), tiles);
  return section;
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
  const shown = games.slice(0, MAX_GAMES_LISTED);
  const list = el('ol', 'games');
  list.append(...shown.map(gameRow));
  const section = el('section', 'games-section');
  section.append(el('h3', '', `Recent games · ${shown.length} of ${games.length}`), list);
  return section;
}

// Avatar on the left, name and details on the right
function playerHeader(profile) {
  const header = el('header', 'player-head');

  if (profile.avatar) {
    const avatar = el('img', 'avatar');
    avatar.src = profile.avatar;
    avatar.alt = '';
    header.append(avatar);
  }

  const heading = el('h2', 'player-name', profile.username);
  if (profile.title) heading.prepend(el('span', 'title-badge', profile.title), ' ');

  const link = el('a', 'profile-link', 'View on Chess.com ↗');
  link.href = profile.url;
  link.target = '_blank';
  link.rel = 'noopener';

  const info = el('div');
  info.append(heading);
  if (profile.name) info.append(el('p', 'muted', profile.name));
  info.append(el('p', 'muted', `${profile.followers} followers`), link);
  header.append(info);
  return header;
}

export function renderPlayer(profile, ratings, games, report) {
  clearStatus();

  const card = el('article', 'player');
  card.append(playerHeader(profile));
  if (ratings.length > 0) card.append(ratingsList(ratings));
  if (games.length === 0) {
    card.append(el('p', 'empty', `No games in the last ${RECENT_DAYS} days.`));
  } else {
    card.append(reportSection(report), gamesSection(games));
  }

  results.replaceChildren(card);
}
