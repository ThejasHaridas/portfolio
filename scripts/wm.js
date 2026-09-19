/* ==========================================================================
   wm.js — a small window manager: open, focus, drag, resize, min/max/close
   ========================================================================== */

const WM = (() => {
  const layer = () => document.getElementById('windowLayer');
  const taskbar = () => document.getElementById('taskButtons');

  const windows = new Map();   // id -> { el, taskBtn, state }
  let zTop = 10;
  let cascade = 0;
  let activeId = null;

  const isSmall = () => window.matchMedia('(max-width: 720px)').matches;

  /* ---------- creation ---------- */

  function open(opts) {
    const id = opts.id;

    if (windows.has(id)) {           // already open: restore + focus
      const w = windows.get(id);
      if (w.state.minimized) restore(id);
      focus(id);
      return w.el;
    }

    const el = document.createElement('section');
    el.className = 'win' + (opts.dialog ? ' win--dialog' : '');
    el.dataset.winId = id;
    el.setAttribute('role', opts.dialog ? 'alertdialog' : 'dialog');
    el.setAttribute('aria-label', opts.title);

    const w = Math.min(opts.width || 620, window.innerWidth - 24);
    const h = Math.min(opts.height || 440, window.innerHeight - 70);
    const pos = nextPosition(w, h);
    Object.assign(el.style, {
      width: w + 'px', height: opts.dialog ? 'auto' : h + 'px',
      left: pos.x + 'px', top: pos.y + 'px', zIndex: ++zTop
    });

    el.innerHTML = chrome(opts);
    const host = el.querySelector('[data-slot="content"]');
    if (opts.node) host.appendChild(opts.node);
    else if (opts.html) host.innerHTML = opts.html;

    layer().appendChild(el);
    windows.set(id, { el, taskBtn: null, state: { minimized: false, maximized: false, prev: null }, opts });

    if (!opts.dialog) addTaskButton(id, opts);
    wire(id, el);
    focus(id);
    return el;
  }

  function chrome(o) {
    const controls = o.dialog
      ? `<button class="win-ctl win-ctl--close" data-act="close" title="Close" aria-label="Close">&#10005;</button>`
      : `<button class="win-ctl" data-act="minimize" title="Minimize" aria-label="Minimize">&#95;</button>
         <button class="win-ctl" data-act="maximize" title="Maximize" aria-label="Maximize">&#9633;</button>
         <button class="win-ctl win-ctl--close" data-act="close" title="Close" aria-label="Close">&#10005;</button>`;

    const menubar = o.menu
      ? `<nav class="win-menubar">${o.menu.map(m => `<button type="button" data-menu="${m}">${m}</button>`).join('')}</nav>`
      : '';

    const address = o.address
      ? `<div class="win-addressbar"><label>Address</label>
           <div class="addr-field"><span aria-hidden="true">${o.icon || '&#128193;'}</span>${o.address}</div>
         </div>`
      : '';

    const status = o.status
      ? `<div class="win-statusbar">${o.status.map(s => `<span>${s}</span>`).join('')}</div>`
      : '';

    return `
      <header class="win-title" data-drag>
        <span class="win-title-icon" aria-hidden="true">${o.icon || '&#128187;'}</span>
        <span class="win-title-text">${o.title}</span>
        <span class="win-controls">${controls}</span>
      </header>
      ${menubar}${address}
      <div class="win-body ${o.flat ? 'win-body--flat' : ''}" data-slot="content"></div>
      ${status}
      ${o.dialog ? '' : '<div class="win-resize" data-resize></div>'}`;
  }

  function nextPosition(w, h) {
    if (isSmall()) return { x: 0, y: 0 };
    const step = 24;
    const maxX = Math.max(10, window.innerWidth - w - 20);
    const maxY = Math.max(10, window.innerHeight - h - 50);
    // start clear of the desktop icon column so icons stay reachable
    const x = Math.min(104 + cascade * step, maxX);
    const y = Math.min(28 + cascade * step, maxY);
    cascade = (cascade + 1) % 7;
    return { x, y };
  }

  /* ---------- behaviour ---------- */

  function wire(id, el) {
    el.addEventListener('mousedown', () => focus(id), true);
    el.addEventListener('touchstart', () => focus(id), { capture: true, passive: true });

    el.querySelector('.win-controls').addEventListener('click', e => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'close') close(id);
      else if (act === 'minimize') minimize(id);
      else if (act === 'maximize') toggleMax(id);
    });

    const bar = el.querySelector('[data-drag]');
    bar.addEventListener('dblclick', () => { if (!el.classList.contains('win--dialog')) toggleMax(id); });
    dragify(id, el, bar);

    const grip = el.querySelector('[data-resize]');
    if (grip) resizify(id, el, grip);
  }

  function dragify(id, el, handle) {
    let sx, sy, ox, oy, moving = false;

    const down = e => {
      if (e.target.closest('.win-ctl')) return;
      const w = windows.get(id);
      if (!w || w.state.maximized || isSmall()) return;
      const p = point(e);
      sx = p.x; sy = p.y;
      ox = el.offsetLeft; oy = el.offsetTop;
      moving = true;
      el.classList.add('is-dragging');
      document.addEventListener('mousemove', move);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('mouseup', up);
      document.addEventListener('touchend', up);
    };

    const move = e => {
      if (!moving) return;
      e.preventDefault();
      const p = point(e);
      const nx = clamp(ox + p.x - sx, -el.offsetWidth + 90, window.innerWidth - 90);
      const ny = clamp(oy + p.y - sy, 0, window.innerHeight - 60);
      el.style.left = nx + 'px';
      el.style.top = ny + 'px';
    };

    const up = () => {
      moving = false;
      el.classList.remove('is-dragging');
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchend', up);
    };

    handle.addEventListener('mousedown', down);
    handle.addEventListener('touchstart', down, { passive: true });
  }

  function resizify(id, el, grip) {
    let sx, sy, ow, oh, sizing = false;

    const down = e => {
      const w = windows.get(id);
      if (!w || w.state.maximized || isSmall()) return;
      const p = point(e);
      sx = p.x; sy = p.y; ow = el.offsetWidth; oh = el.offsetHeight;
      sizing = true;
      el.classList.add('is-resizing');
      document.addEventListener('mousemove', move);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('mouseup', up);
      document.addEventListener('touchend', up);
      e.preventDefault();
    };

    const move = e => {
      if (!sizing) return;
      e.preventDefault();
      const p = point(e);
      el.style.width  = Math.max(260, ow + p.x - sx) + 'px';
      el.style.height = Math.max(160, oh + p.y - sy) + 'px';
    };

    const up = () => {
      sizing = false;
      el.classList.remove('is-resizing');
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchend', up);
    };

    grip.addEventListener('mousedown', down);
    grip.addEventListener('touchstart', down, { passive: false });
  }

  /* ---------- state ---------- */

  function focus(id) {
    const w = windows.get(id);
    if (!w) return;
    activeId = id;
    w.el.style.zIndex = ++zTop;
    windows.forEach((other, key) => {
      other.el.classList.toggle('is-inactive', key !== id);
      other.taskBtn?.classList.toggle('is-active', key === id && !other.state.minimized);
    });
  }

  function minimize(id) {
    const w = windows.get(id);
    if (!w) return;
    w.state.minimized = true;
    w.el.classList.add('is-minimized');
    w.taskBtn?.classList.remove('is-active');
    const next = [...windows.keys()].reverse().find(k => !windows.get(k).state.minimized);
    if (next) focus(next); else activeId = null;
  }

  function restore(id) {
    const w = windows.get(id);
    if (!w) return;
    w.state.minimized = false;
    w.el.classList.remove('is-minimized');
    focus(id);
  }

  function toggleMax(id) {
    const w = windows.get(id);
    if (!w) return;
    w.state.maximized = !w.state.maximized;
    w.el.classList.toggle('is-maximized', w.state.maximized);
    const btn = w.el.querySelector('[data-act="maximize"]');
    if (btn) btn.innerHTML = w.state.maximized ? '&#10064;' : '&#9633;';
    focus(id);
  }

  function close(id) {
    const w = windows.get(id);
    if (!w) return;
    w.el.remove();
    w.taskBtn?.remove();
    windows.delete(id);
    if (activeId === id) {
      const next = [...windows.keys()].reverse().find(k => !windows.get(k).state.minimized);
      if (next) focus(next); else activeId = null;
    }
  }

  function closeAll() { [...windows.keys()].forEach(close); cascade = 0; }

  /* ---------- taskbar ---------- */

  function addTaskButton(id, opts) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'task-btn';
    btn.innerHTML = `<span aria-hidden="true">${opts.icon || '&#128187;'}</span><span>${opts.title}</span>`;
    btn.addEventListener('click', () => {
      const w = windows.get(id);
      if (!w) return;
      if (w.state.minimized) restore(id);
      else if (activeId === id) minimize(id);
      else focus(id);
    });
    taskbar().appendChild(btn);
    windows.get(id).taskBtn = btn;
  }

  /* ---------- dialog helper ---------- */

  function dialog({ id, title, icon = '&#9888;', message, buttons = ['OK'] }) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;flex:1;min-width:0;background:var(--xp-face)';
    wrap.innerHTML = `
      <div class="win-scroll">
        <div class="dlg-row">
          <div class="dlg-icon" aria-hidden="true">${icon}</div>
          <div class="dlg-msg">${message}</div>
        </div>
      </div>
      <div class="dlg-actions">
        ${buttons.map(b => `<button class="xp-btn" data-dlg="${b}">${b}</button>`).join('')}
      </div>`;
    const el = open({ id, title, icon, dialog: true, width: 400, node: wrap });
    wrap.querySelectorAll('[data-dlg]').forEach(b =>
      b.addEventListener('click', () => close(id)));
    return el;
  }

  /* ---------- utils ---------- */

  const point = e => e.touches?.[0]
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  return { open, close, closeAll, focus, minimize, restore, toggleMax, dialog,
           has: id => windows.has(id), count: () => windows.size };
})();
