/* ============================================================
   EQUIS CAPITAL — Main JS
   ============================================================ */

// ── NAV SCROLL ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE MENU ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── REVEAL ON SCROLL ─────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // stagger siblings in same parent
  const siblings = el.parentElement.querySelectorAll('.reveal');
  const idx = Array.from(siblings).indexOf(el);
  el.dataset.delay = idx * 80;
  observer.observe(el);
});

// ── STAT COUNTER ANIMATION ───────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = String(target).includes('.');
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat__num[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero__stats');
if (statsEl) statsObserver.observe(statsEl);

// ── PORTFOLIO FILTER ─────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.deal-card').forEach(card => {
      const cat = card.dataset.category || '';
      if (filter === 'all' || cat.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── TESTIMONIAL SLIDER ───────────────────────────────────────
(function initSlider() {
  const track = document.getElementById('testimonialTrack');
  const cards = track ? track.querySelectorAll('.tcard') : [];
  const dotsContainer = document.getElementById('tDots');
  if (!track || cards.length === 0) return;

  const perView = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  let current = 0;

  function totalPages() {
    return Math.ceil(cards.length / perView());
  }

  function cardWidth() {
    const gapPx = 24;
    const pv = perView();
    return (track.parentElement.offsetWidth - gapPx * (pv - 1)) / pv;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const dot = document.createElement('button');
      dot.className = 'tdot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(page) {
    current = Math.max(0, Math.min(page, totalPages() - 1));
    const gapPx = 24;
    const pv = perView();
    const offset = current * pv * (cardWidth() + gapPx);
    track.style.transform = `translateX(-${offset}px)`;
    dotsContainer.querySelectorAll('.tdot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  document.getElementById('tPrev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('tNext')?.addEventListener('click', () => goTo(current + 1));

  buildDots();
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  // Auto-advance
  setInterval(() => goTo((current + 1) % totalPages()), 5000);
})();

// ── MEDIA TABS ───────────────────────────────────────────────
document.querySelectorAll('.media-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.media__content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById('tab-' + tab.dataset.tab);
    if (target) target.classList.add('active');
  });
});
