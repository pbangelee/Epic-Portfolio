(() => {
  /* Scrapbook: drag the polaroids around (mouse), arrow keys also nudge them */
  const table = document.querySelector('[data-scrap]');
  if (!table) return;
  const desktop = window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px)');
  let top = 10;

  table.querySelectorAll('.polaroid, .sticky-note').forEach((card) => {
    let bx = 0, by = 0, lx = 0, ly = 0, pid = null;

    const shift = (ddx, ddy) => {
      const c = card.getBoundingClientRect();
      const t = table.getBoundingClientRect();
      const nl = Math.min(Math.max(c.left + ddx, t.left - c.width * .4), t.right - c.width * .6);
      const nt = Math.min(Math.max(c.top + ddy, t.top - c.height * .2), t.bottom - c.height * .8);
      bx += nl - c.left;
      by += nt - c.top;
      card.style.setProperty('--dx', bx + 'px');
      card.style.setProperty('--dy', by + 'px');
    };

    card.addEventListener('pointerdown', (e) => {
      if (!desktop.matches || e.button !== 0 || e.target.closest('a')) return;
      pid = e.pointerId;
      card.setPointerCapture(pid);
      lx = e.clientX; ly = e.clientY;
      card.classList.add('is-dragging');
      card.style.zIndex = ++top;
      e.preventDefault();
    });
    card.addEventListener('pointermove', (e) => {
      if (pid !== e.pointerId) return;
      shift(e.clientX - lx, e.clientY - ly);
      lx = e.clientX; ly = e.clientY;
    });
    const drop = (e) => {
      if (pid !== e.pointerId) return;
      pid = null;
      card.classList.remove('is-dragging');
    };
    card.addEventListener('pointerup', drop);
    card.addEventListener('pointercancel', drop);

    card.addEventListener('keydown', (e) => {
      const k = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
      if (!k || !desktop.matches) return;
      e.preventDefault();
      card.style.zIndex = ++top;
      shift(k[0], k[1]);
    });
  });
})();
