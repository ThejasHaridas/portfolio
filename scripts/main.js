/* ==========================================================================
   main.js — boot sequence, desktop icons, start menu, taskbar clock
   ========================================================================== */

const DESKTOP_ICONS = [
  { id: 'about',        label: 'About Me',      glyph: '&#128100;', app: 'about' },
  { id: 'projects',     label: 'My Projects',   glyph: '&#128193;', app: 'projects' },
  { id: 'experience',   label: 'My Experience', glyph: '&#128188;', app: 'experience' },
  { id: 'skills',       label: 'Skills',        glyph: '&#128202;', app: 'skills' },
  { id: 'resume',       label: 'resume.txt',    glyph: '&#128462;', app: 'resume' },
  { id: 'contact',      label: 'Contact',       glyph: '&#9993;',   app: 'contact' },
  { id: 'minesweeper',  label: 'Minesweeper',   glyph: '&#128163;', app: 'minesweeper' },
  { id: 'recycle',      label: 'Recycle Bin',   glyph: '&#128465;', app: 'recycle' }
];

const START_LEFT = [
  { app: 'about',      glyph: '&#128100;', title: 'About Me',      sub: 'Who I am and what I do' },
  { app: 'projects',   glyph: '&#128193;', title: 'My Projects',   sub: 'Selected work' },
  { app: 'experience', glyph: '&#128188;', title: 'My Experience', sub: 'Roles and responsibilities' },
  { app: 'skills',     glyph: '&#128202;', title: 'Skills',        sub: 'Tools of the trade' },
  { sep: true },
  { app: 'resume',     glyph: '&#128462;', title: 'resume.txt',    sub: 'The plain-text version' },
  { app: 'contact',    glyph: '&#9993;',   title: 'Contact',       sub: 'Say hello' }
];

const START_RIGHT = [
  { app: 'projects',    glyph: '&#128193;', title: 'My Projects' },
  { app: 'experience',  glyph: '&#128188;', title: 'My Documents' },
  { app: 'recycle',     glyph: '&#128465;', title: 'Recycle Bin' },
  { sep: true },
  { app: 'minesweeper', glyph: '&#128163;', title: 'Minesweeper' },
  { app: 'credits',     glyph: '&#8505;',   title: 'About XP' }
];

/* ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  boot();
  buildIcons();
  buildStartMenu();
  startClock();
  wireGlobal();
});

/* ---------- boot → login → desktop ---------- */

function boot() {
  const bootEl = document.getElementById('boot');
  const loginEl = document.getElementById('login');

  const skip = () => {
    bootEl.hidden = true;
    loginEl.hidden = false;
    document.getElementById('userTile').focus();
  };

  const t = setTimeout(skip, 2600);
  bootEl.addEventListener('click', () => { clearTimeout(t); skip(); });

  document.getElementById('userTile').addEventListener('click', () => {
    loginEl.hidden = true;
    document.getElementById('desktop').hidden = false;
    document.getElementById('taskbar').hidden = false;
    setTimeout(() => Apps.about(), 320);
  });
}

/* ---------- desktop icons ---------- */

function buildIcons() {
  const layer = document.getElementById('iconLayer');
  layer.innerHTML = DESKTOP_ICONS.map(i => `
    <li><button class="desk-icon" type="button" role="option" aria-selected="false"
                data-open="${i.app}" data-icon="${i.id}">
      <span class="di-glyph" aria-hidden="true">${i.glyph}</span>
      <span class="di-label">${i.label}</span>
    </button></li>`).join('');

  layer.querySelectorAll('.desk-icon').forEach(btn => {
    const select = () => {
      layer.querySelectorAll('.desk-icon').forEach(b => b.setAttribute('aria-selected', 'false'));
      btn.setAttribute('aria-selected', 'true');
    };
    btn.addEventListener('click', select);
    btn.addEventListener('dblclick', () => launch(btn.dataset.open));
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); launch(btn.dataset.open); }
    });
    // touch: single tap opens
    let moved = false;
    btn.addEventListener('touchmove', () => { moved = true; }, { passive: true });
    btn.addEventListener('touchstart', () => { moved = false; }, { passive: true });
    btn.addEventListener('touchend', e => {
      if (moved) return;
      e.preventDefault();
      select();
      launch(btn.dataset.open);
    });
  });
}

/* ---------- start menu ---------- */

function buildStartMenu() {
  const left = document.getElementById('smLeft');
  const right = document.getElementById('smRight');

  left.innerHTML = START_LEFT.map(i => i.sep
    ? '<hr class="sm-sep">'
    : `<button class="sm-item" type="button" data-open="${i.app}">
         <span class="sm-glyph" aria-hidden="true">${i.glyph}</span>
         <span class="sm-text"><strong>${i.title}</strong><em>${i.sub}</em></span>
       </button>`).join('');

  right.innerHTML = START_RIGHT.map(i => i.sep
    ? '<hr class="sm-sep">'
    : `<button class="sm-item" type="button" data-open="${i.app}">
         <span class="sm-glyph" aria-hidden="true">${i.glyph}</span>
         <span class="sm-text"><strong>${i.title}</strong></span>
       </button>`).join('');
}

function toggleStart(force) {
  const menu = document.getElementById('startMenu');
  const btn = document.getElementById('startBtn');
  const showing = force !== undefined ? force : menu.hidden;
  menu.hidden = !showing;
  btn.setAttribute('aria-expanded', String(showing));
}

/* ---------- clock ---------- */

function startClock() {
  const el = document.getElementById('clock');
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    el.title = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  tick();
  setInterval(tick, 10000);
}

/* ---------- launching ---------- */

function launch(app) {
  toggleStart(false);
  if (typeof Apps[app] === 'function') Apps[app]();
}

/* ---------- global wiring ---------- */

function wireGlobal() {
  // start button
  document.getElementById('startBtn').addEventListener('click', e => {
    e.stopPropagation();
    toggleStart();
  });

  // any element carrying data-open launches that app
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener && !opener.classList.contains('desk-icon')) {
      e.preventDefault();
      launch(opener.dataset.open);
    }
  });

  // close start menu / context menu on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#startMenu') && !e.target.closest('#startBtn')) toggleStart(false);
    if (!e.target.closest('#desktopMenu')) hideCtx();
  });

  // deselect desktop icons when clicking empty desktop
  document.getElementById('desktop').addEventListener('mousedown', e => {
    if (e.target.closest('.desk-icon') || e.target.closest('.win')) return;
    document.querySelectorAll('.desk-icon').forEach(b => b.setAttribute('aria-selected', 'false'));
  });

  // desktop right-click menu
  document.getElementById('desktop').addEventListener('contextmenu', e => {
    if (e.target.closest('.win')) return;
    e.preventDefault();
    showCtx(e.clientX, e.clientY);
  });

  document.getElementById('desktopMenu').addEventListener('click', e => {
    const act = e.target.closest('[data-ctx]')?.dataset.ctx;
    hideCtx();
    if (act === 'properties') Apps.credits();
    if (act === 'refresh') flashDesktop();
  });

  // escape closes start menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { toggleStart(false); hideCtx(); }
  });

  // tray + power
  document.getElementById('trayVolume').addEventListener('click', () =>
    WM.dialog({
      id: 'volume', title: 'Sounds and Audio Devices', icon: '&#128266;',
      message: 'This portfolio ships without the XP startup chime.<br><br>You are welcome.',
      buttons: ['OK']
    }));

  document.querySelectorAll('.sm-power').forEach(btn =>
    btn.addEventListener('click', () => {
      toggleStart(false);
      btn.dataset.action === 'shutdown' ? shutdown() : logoff();
    }));

  document.getElementById('rebootBtn').addEventListener('click', () => location.reload());
}

/* ---------- context menu ---------- */

function showCtx(x, y) {
  const m = document.getElementById('desktopMenu');
  m.hidden = false;
  m.style.left = Math.min(x, window.innerWidth - m.offsetWidth - 6) + 'px';
  m.style.top = Math.min(y, window.innerHeight - m.offsetHeight - 40) + 'px';
}
function hideCtx() { document.getElementById('desktopMenu').hidden = true; }

function flashDesktop() {
  const wp = document.querySelector('.wallpaper');
  wp.style.opacity = '0';
  setTimeout(() => { wp.style.transition = 'opacity .25s'; wp.style.opacity = '1'; }, 60);
}

/* ---------- power ---------- */

function logoff() {
  WM.closeAll();
  document.getElementById('desktop').hidden = true;
  document.getElementById('taskbar').hidden = true;
  document.getElementById('login').hidden = false;
}

function shutdown() {
  WM.closeAll();
  document.getElementById('desktop').hidden = true;
  document.getElementById('taskbar').hidden = true;
  document.getElementById('shutdown').hidden = false;
}
