(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Count-up numbers */
  const counts = document.querySelectorAll('.count');
  const run = (el) => {
    const to = +el.dataset.to;
    if (reduce) { el.textContent = to; return; }
    const start = performance.now(), dur = 1400;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: .6 });
    counts.forEach((c) => io.observe(c));
  }

  /* Accordion cards */
  document.querySelectorAll('.tl-head').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.tl-item');
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* Filters */
  const chips = document.querySelectorAll('.rs-chip');
  const items = document.querySelectorAll('.tl-item');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => {
      const on = c === chip;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    items.forEach((it) => {
      const match = f === 'all' || it.dataset.cats.split(' ').includes(f);
      it.classList.toggle('is-dim', !match);
      if (match && f !== 'all') {
        it.classList.add('is-open');
        it.querySelector('.tl-head').setAttribute('aria-expanded', 'true');
      }
    });
  }));

  /* The thread draws itself as you scroll */
  const thread = document.querySelector('[data-thread]');
  if (!thread) return;
  const prog = thread.querySelector('.thread-prog');
  const pen = thread.querySelector('.thread-pen');
  const update = () => {
    const r = thread.getBoundingClientRect();
    let p = (window.innerHeight * 0.6 - r.top) / r.height;
    p = Math.max(0, Math.min(1, p));
    prog.style.strokeDashoffset = String(1 - p);
    pen.style.top = (p * 100) + '%';
    pen.style.opacity = p > 0 ? '1' : '0';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
