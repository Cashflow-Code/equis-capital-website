/* ============================================================
   EQUIS CAPITAL — Main JS
   ============================================================ */

// ── NAV SCROLL ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE MENU ─────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

burger.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ── COUNTER ANIMATION ────────────────────────────────────────
function runCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dec    = parseInt(el.dataset.dec || '0');
  const dur    = 2000;
  const start  = performance.now();
  const ease   = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = target * ease(p);
    el.textContent = (dec > 0 ? v.toFixed(dec) : Math.round(v)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const metricsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-target]').forEach(runCounter);
    metricsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const metricsEl = document.querySelector('.hero__metrics');
if (metricsEl) metricsObserver.observe(metricsEl);

// ── FADE-UP REVEALS ──────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ── PORTFOLIO FILTER ─────────────────────────────────────────
document.querySelectorAll('.pf-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.deal').forEach(card => {
      const cat = card.dataset.cat || '';
      card.classList.toggle('hidden', f !== 'all' && !cat.includes(f));
    });
  });
});

// ── TESTIMONIAL SLIDER ───────────────────────────────────────
(function () {
  const slides = document.querySelectorAll('.tsl__slide');
  const dotsEl = document.getElementById('tslDots');
  if (!slides.length) return;

  let cur = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'tsl__dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  });

  function go(n) {
    slides[cur].classList.remove('active');
    dotsEl.children[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dotsEl.children[cur].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => go(cur + 1), 6000);
  }

  document.getElementById('tslPrev')?.addEventListener('click', () => go(cur - 1));
  document.getElementById('tslNext')?.addEventListener('click', () => go(cur + 1));

  timer = setInterval(() => go(cur + 1), 6000);
})();

// ── MEDIA TABS ───────────────────────────────────────────────
document.querySelectorAll('.media__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.media__tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.media__pane').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('pane-' + tab.dataset.tab)?.classList.add('active');
  });
});
