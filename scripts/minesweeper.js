/* ==========================================================================
   minesweeper.js — a working Minesweeper, because it would be rude not to
   ========================================================================== */

const Minesweeper = (() => {
  const COLS = 9, ROWS = 9, MINES = 10;

  function open() {
    const node = document.createElement('div');
    node.className = 'ms';
    node.innerHTML = `
      <div class="ms-hud">
        <span class="ms-lcd" data-mines>010</span>
        <button class="ms-face" type="button" data-face aria-label="New game">&#128578;</button>
        <span class="ms-lcd" data-time>000</span>
      </div>
      <div class="ms-grid" data-grid role="grid" aria-label="Minesweeper board"></div>
      <p class="ms-note">Left click to reveal &middot; right click (or long press) to flag</p>`;

    const el = WM.open({
      id: 'minesweeper', title: 'Minesweeper', icon: '&#128163;',
      width: 250, height: 330, flat: true,
      menu: ['Game', 'Help'],
      node
    });

    start(node);
    return el;
  }

  function start(root) {
    const gridEl = root.querySelector('[data-grid]');
    const faceEl = root.querySelector('[data-face]');
    const mineEl = root.querySelector('[data-mines]');
    const timeEl = root.querySelector('[data-time]');

    let board, revealed, flagged, over, won, started, ticks, timer;

    const pad = n => String(Math.max(0, Math.min(999, n))).padStart(3, '0');
    const idx = (r, c) => r * COLS + c;
    const inBounds = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

    function reset() {
      board = Array(ROWS * COLS).fill(0);
      revealed = Array(ROWS * COLS).fill(false);
      flagged = Array(ROWS * COLS).fill(false);
      over = won = started = false;
      ticks = 0;
      clearInterval(timer);
      timeEl.textContent = pad(0);
      mineEl.textContent = pad(MINES);
      faceEl.innerHTML = '&#128578;';
      render();
    }

    function place(safeR, safeC) {
      let placed = 0;
      while (placed < MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        if (board[idx(r, c)] === -1) continue;
        if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue; // safe first click
        board[idx(r, c)] = -1;
        placed++;
      }
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[idx(r, c)] === -1) continue;
          let n = 0;
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++)
              if (inBounds(r + dr, c + dc) && board[idx(r + dr, c + dc)] === -1) n++;
          board[idx(r, c)] = n;
        }
      }
    }

    function flood(r, c) {
      if (!inBounds(r, c)) return;
      const i = idx(r, c);
      if (revealed[i] || flagged[i]) return;
      revealed[i] = true;
      if (board[i] !== 0) return;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr || dc) flood(r + dr, c + dc);
    }

    function reveal(r, c) {
      if (over) return;
      const i = idx(r, c);
      if (revealed[i] || flagged[i]) return;

      if (!started) {
        started = true;
        place(r, c);
        timer = setInterval(() => { ticks++; timeEl.textContent = pad(ticks); }, 1000);
      }

      if (board[i] === -1) {
        over = true;
        clearInterval(timer);
        faceEl.innerHTML = '&#128565;';
        for (let k = 0; k < board.length; k++) if (board[k] === -1) revealed[k] = true;
        render(i);
        return;
      }

      flood(r, c);
      checkWin();
      render();
    }

    function toggleFlag(r, c) {
      if (over) return;
      const i = idx(r, c);
      if (revealed[i]) return;
      flagged[i] = !flagged[i];
      mineEl.textContent = pad(MINES - flagged.filter(Boolean).length);
      render();
    }

    function checkWin() {
      const safe = board.filter(v => v !== -1).length;
      const open = revealed.filter(Boolean).length;
      if (open === safe) {
        over = won = true;
        clearInterval(timer);
        faceEl.innerHTML = '&#128526;';
        mineEl.textContent = pad(0);
      }
    }

    function render(blownIdx) {
      gridEl.style.gridTemplateColumns = `repeat(${COLS}, 20px)`;
      gridEl.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = idx(r, c);
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'ms-cell';
          b.dataset.r = r; b.dataset.c = c;

          if (revealed[i]) {
            b.classList.add('is-open');
            if (board[i] === -1) {
              b.innerHTML = '&#128163;';
              if (i === blownIdx) b.classList.add('is-mine');
            } else if (board[i] > 0) {
              b.textContent = board[i];
              b.dataset.n = board[i];
            }
          } else if (flagged[i]) {
            b.innerHTML = '&#128681;';
          }
          gridEl.appendChild(b);
        }
      }
    }

    /* ----- input ----- */
    let pressTimer = null;

    gridEl.addEventListener('click', e => {
      const cell = e.target.closest('.ms-cell');
      if (cell) reveal(+cell.dataset.r, +cell.dataset.c);
    });

    gridEl.addEventListener('contextmenu', e => {
      e.preventDefault();
      const cell = e.target.closest('.ms-cell');
      if (cell) toggleFlag(+cell.dataset.r, +cell.dataset.c);
    });

    gridEl.addEventListener('touchstart', e => {
      const cell = e.target.closest('.ms-cell');
      if (!cell) return;
      pressTimer = setTimeout(() => {
        toggleFlag(+cell.dataset.r, +cell.dataset.c);
        pressTimer = 'done';
      }, 420);
    }, { passive: true });

    gridEl.addEventListener('touchend', e => {
      if (pressTimer === 'done') { e.preventDefault(); pressTimer = null; return; }
      clearTimeout(pressTimer);
      pressTimer = null;
    });

    faceEl.addEventListener('click', reset);
    reset();
  }

  return { open };
})();
