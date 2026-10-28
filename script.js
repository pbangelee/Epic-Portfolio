const revealEls = document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .photo-wrap, .doodle');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

const nav = document.querySelector('nav');
const progressBar = document.querySelector('.nav-progress-bar');

const handleNavScroll = () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
window.addEventListener('resize', handleNavScroll);
handleNavScroll();

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'Copied';
      btn.classList.add('copied');
    } catch (e) {
      btn.textContent = 'Press Ctrl+C';
    }
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
  });
});


/* ---------- Shared motion setup ---------- */
document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Page transitions ---------- */
/* Nav links get a soft fade; other internal links get the red sweep. */
if (!reduceMotion) {
  const panel = document.createElement('div');
  panel.className = 'page-transition';
  panel.style.visibility = 'hidden';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor"/></svg>';
  document.body.appendChild(panel);

  const SWEEP = 'transform .6s cubic-bezier(.7,0,.2,1)';
  const FADE_OUT = 'opacity .3s ease';
  const FADE_IN = 'opacity .5s ease';

  const resetPanel = () => {
    panel.style.visibility = 'hidden';
    panel.classList.remove('soft');
    panel.style.transition = 'none';
    panel.style.transform = 'translateY(100%)';
    panel.style.opacity = '';
  };

  const cover = (soft) => {
    panel.style.visibility = 'visible';
    panel.classList.toggle('soft', soft);
    if (soft) {
      panel.style.transition = 'none';
      panel.style.transform = 'none';
      panel.style.opacity = '0';
      void panel.offsetHeight;
      panel.style.transition = FADE_OUT;
      panel.style.opacity = '1';
    } else {
      panel.style.opacity = '';
      panel.style.transition = SWEEP;
      panel.style.transform = 'translateY(0)';
    }
  };

  const reveal = (soft) => {
    panel.style.visibility = 'visible';
    const root = document.documentElement;
    panel.classList.toggle('soft', soft);
    panel.style.transition = 'none';
    if (soft) {
      panel.style.transform = 'none';
      panel.style.opacity = '1';
    } else {
      panel.style.opacity = '';
      panel.style.transform = 'translateY(0)';
    }
    root.classList.remove('entering', 'entering-soft');
    void panel.offsetHeight;
    if (soft) {
      panel.style.transition = FADE_IN;
      panel.style.opacity = '0';
    } else {
      panel.style.transition = SWEEP;
      panel.style.transform = 'translateY(-100%)';
    }
  };

  panel.addEventListener('transitionend', () => {
    if (panel.style.transform === 'translateY(-100%)' || panel.style.opacity === '0') panel.style.visibility = 'hidden';
  });

  const root = document.documentElement;
  const wasSoft = root.classList.contains('entering-soft');
  if (wasSoft || root.classList.contains('entering')) {
    try { sessionStorage.removeItem('pt'); } catch (e) {}
    requestAnimationFrame(() => setTimeout(() => reveal(wasSoft), wasSoft ? 60 : 220));
  }

  window.addEventListener('pageshow', (e) => { if (e.persisted) resetPanel(); });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target || a.hasAttribute('download')) return;
    if (a.protocol !== location.protocol || a.host !== location.host) return;
    if (a.pathname === location.pathname) return;
    e.preventDefault();
    const soft = !!a.closest('nav');
    try { sessionStorage.setItem('pt', soft ? 'soft' : '1'); } catch (err) {}
    cover(soft);
    setTimeout(() => { window.location.href = a.href; }, soft ? 300 : 620);
  });
}

/* ---------- Scroll-driven sparkles ---------- */
const sparkles = document.querySelectorAll('.sparkle');

if (!reduceMotion && sparkles.length) {
  let vel = 0, lastY = window.scrollY;
  const angles = [0, 0];
  const speeds = [1.1, -0.8];

  const tick = () => {
    const y = window.scrollY;
    vel += (Math.min(Math.abs(y - lastY), 60) - vel) * 0.08;
    lastY = y;
    sparkles.forEach((s, i) => {
      angles[i] += speeds[i % 2] * (0.4 + vel * 0.5);
      s.style.transform = `rotate(${angles[i]}deg)`;
    });
    requestAnimationFrame(tick);
  };
  tick();
}


/* ---------- Gentle parallax for decorative pieces ---------- */
const parallaxEls = document.querySelectorAll('[data-parallax]');
if (!reduceMotion && parallaxEls.length) {
  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      const off = r.top + r.height / 2 - vh / 2;
      el.style.translate = `0 ${(-off * parseFloat(el.dataset.parallax)).toFixed(1)}px`;
    });
  };
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}
