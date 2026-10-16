// Everything that touches the DOM. Text always goes through textContent: it comes from the API.

const statusBox = document.querySelector('#status');
const results = document.querySelector('#results');

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

export function renderProfile(profile) {
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

  results.replaceChildren(card);
}
