import { sydneyDate } from './events.js';
import './sermons.js';

const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');
const desktop = window.matchMedia('(min-width: 1081px)');

function closeMenu(returnFocus = false) {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
}

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.navigation')) closeMenu();
});
desktop.addEventListener('change', () => closeMenu());

const themeToggle = document.querySelector('.theme-toggle');
function propagateTheme() {
  const theme = document.documentElement.dataset.theme;
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  themeToggle.title = themeToggle.getAttribute('aria-label');
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || /\/(?:assets|downloads)\//.test(url.pathname)) continue;
    url.searchParams.set('scoutTheme', theme);
    link.href = `${url.pathname}${url.search}${url.hash}`;
  }
}
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  const url = new URL(location.href);
  url.searchParams.set('scoutTheme', theme);
  history.replaceState(null, '', url);
  propagateTheme();
});
propagateTheme();

function updateEvents() {
  const today = sydneyDate();
  for (const list of document.querySelectorAll('[data-upcoming-events]')) {
    const section = list.closest('section');
    const archive = section.querySelector('[data-past-events]');
    for (const card of list.querySelectorAll('[data-event-date]')) {
      if (card.dataset.eventDate < today) {
        if (archive) archive.append(card);
        else card.hidden = true;
      }
    }
    const visible = [...list.querySelectorAll('[data-event-date]')].filter(card => !card.hidden);
    const empty = section.querySelector('[data-event-empty]');
    if (empty) empty.hidden = visible.length !== 0;
    if (archive) {
      const cards = [...archive.children].sort((a, b) => b.dataset.eventDate.localeCompare(a.dataset.eventDate));
      archive.append(...cards);
      section.querySelector('[data-past-section]').hidden = !cards.length;
    }
  }
}
updateEvents();
// Keep an open tab accurate when the local date changes or the device wakes.
setInterval(updateEvents, 60_000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateEvents();
});
