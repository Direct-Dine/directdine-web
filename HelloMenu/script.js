/* PRELOADER */
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('out'), 1500));

/* NAV SCROLL & BOTTOM BAR REVEAL */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('stuck', y > 50);
  
  const mbb = document.getElementById('mbb');
  if (mbb) mbb.classList.toggle('on', y > 400);
  
  const flCall = document.getElementById('flCall');
  if (flCall) flCall.classList.toggle('on', y > 400);
}, { passive: true });

/* MOBILE MENU */
function toggleMob() {
  const m = document.getElementById('mobMenu'), h = document.getElementById('ham');
  m.classList.toggle('open');
  h.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}
function closeMob() {
  document.getElementById('mobMenu').classList.remove('open');
  document.getElementById('ham').classList.remove('open');
  document.body.style.overflow = '';
}

/* PREMIUM SCROLL REVEAL OBSERVER */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Add a slight delay for smoother cascading effect if multiple items appear
      setTimeout(() => {
        e.target.classList.add('in');
      }, 50); 
      obs.unobserve(e.target);
    }
  });
}, { threshold: .15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sr, .sr-l, .sr-r').forEach(el => obs.observe(el));

/* MENU FILTER TABS WITH LUXURY ANIMATION */
document.querySelectorAll('.mt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const f = btn.dataset.f;
    document.querySelectorAll('.mc').forEach((c, i) => {
      const show = f === 'all' || c.dataset.c === f;
      c.classList.toggle('hidden', !show);
      
      if (show) {
        c.style.animation = 'none';
        c.offsetHeight; // force reflow for animation restart
        // Custom cubic-bezier for a "snap and settle" high-end feel
        c.style.animation = `mcIn .6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s both`;
      }
    });
  });
});

const styleSheet = document.createElement('style');
styleSheet.textContent = '@keyframes mcIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(styleSheet);

/* LIGHTBOX FOR GALLERY */
function openLb(emoji, caption) {
  document.getElementById('lbE').textContent = emoji;
  document.getElementById('lbC').textContent = caption;
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  document.getElementById('lb').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb() });

/* HERO PARALLAX (SMOOTH) */
let lastKnownScrollPosition = 0;
let ticking = false;

window.addEventListener('scroll', () => {
  lastKnownScrollPosition = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (lastKnownScrollPosition < window.innerHeight) {
        document.querySelectorAll('.ff').forEach((el, i) => {
          // Adjusted math for a slower, floaty parallax effect
          el.style.transform = `translateY(${lastKnownScrollPosition * (0.05 + i * 0.01)}px)`;
        });
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });