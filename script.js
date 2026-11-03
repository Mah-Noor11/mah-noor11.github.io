(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  const links = [...nav.querySelectorAll('a')];
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();

  // Respect the visitor's operating-system preference unless they override it.
  let storedTheme = null;
  try { storedTheme = localStorage.getItem('mahnoor-theme'); } catch (_) {}
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const initialTheme = storedTheme === 'dark' || storedTheme === 'light'
    ? storedTheme : (systemDark.matches ? 'dark' : 'light');
  const applyTheme = (value) => {
    root.setAttribute('data-theme', value);
    themeButton.setAttribute('aria-label', `Switch to ${value === 'dark' ? 'light' : 'dark'} theme`);
    themeButton.title = `Switch to ${value === 'dark' ? 'light' : 'dark'} theme`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#111b18' : '#f8f9f5');
  };
  applyTheme(initialTheme);
  themeButton.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('mahnoor-theme', next); } catch (_) {}
  });
  const listen = e => {
    let localPreference = null;
    try { localPreference = localStorage.getItem('mahnoor-theme'); } catch (_) {}
    if (!localPreference) applyTheme(e.matches ? 'dark' : 'light');
  };
  if (systemDark.addEventListener) systemDark.addEventListener('change', listen);

  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };
  menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  links.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuButton.contains(e.target)) setMenu(false);
  });
  const highlightNav = () => {
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    let current = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top < 180) current = section.id;
    }
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
})();
