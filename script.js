const revealEls = document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .photo-wrap, .doodle');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

const nav = document.querySelector('nav');
const progressBar = document.querySelector('.nav-progress-bar');

const handleNavScroll = () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();