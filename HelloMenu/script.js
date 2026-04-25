/* ============================================================
   LOADER — hide after page ready
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('done');
    }, 800);
  }
});

/* ============================================================
   NAV — .scrolled on scroll
   ============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
function toggleMob() {
  document.getElementById('mobMenu')?.classList.toggle('open');
  document.getElementById('ham')?.classList.toggle('active');
}

function closeMob() {
  document.getElementById('mobMenu')?.classList.remove('open');
  document.getElementById('ham')?.classList.remove('active');
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.sr-l, .sr-r, .sr').forEach(el => revealObs.observe(el));

/* ============================================================
   MENU TABS
   ============================================================ */
document.querySelectorAll('.mt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.f;
    document.querySelectorAll('.mc').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.c === filter) ? '' : 'none';
    });
  });
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLb(emoji, caption) {
  document.getElementById('lb')?.classList.add('open');
  const lbE = document.getElementById('lbE');
  const lbC = document.getElementById('lbC');
  if (lbE) lbE.textContent = emoji;
  if (lbC) lbC.textContent = caption;
  document.body.style.overflow = 'hidden';
}

function closeLb() {
  document.getElementById('lb')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLb();
});
