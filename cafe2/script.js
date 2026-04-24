/* ===== SUNNY STREET CAFE — script.js ===== */

(function () {
  'use strict';

  /* ─── Navbar scroll ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ─── Burger ─── */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ─── Horizontal Scroll Menu ─── */
  const track = document.getElementById('menuTrack');
  const wrap = document.getElementById('menuTrackWrap');
  const arrLeft = document.getElementById('arrLeft');
  const arrRight = document.getElementById('arrRight');
  const dotsContainer = document.getElementById('scrollDots');
  const catTabs = document.getElementById('catTabs');

  let allCards = Array.from(track.querySelectorAll('.menu-card'));
  let visibleCards = [...allCards];
  let currentIndex = 0;
  const CARD_WIDTH = 230 + 18; // width + gap
  let cardsPerView = () => Math.floor(wrap.offsetWidth / CARD_WIDTH) || 1;

  /* Build dots */
  function buildDots() {
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(visibleCards.length / cardsPerView());
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const page = Math.round(currentIndex / cardsPerView());
    dotsContainer.querySelectorAll('.scroll-dot').forEach((d, i) => {
      d.classList.toggle('active', i === page);
    });
  }

  function goToPage(page) {
    currentIndex = page * cardsPerView();
    applyTranslate();
    updateDots();
    updateArrows();
  }

  function applyTranslate() {
    const max = Math.max(0, visibleCards.length - cardsPerView());
    currentIndex = Math.min(currentIndex, max);
    currentIndex = Math.max(0, currentIndex);
    track.style.transform = `translateX(-${currentIndex * CARD_WIDTH}px)`;
  }

  function updateArrows() {
    arrLeft.style.opacity = currentIndex <= 0 ? '.35' : '1';
    arrLeft.style.pointerEvents = currentIndex <= 0 ? 'none' : 'auto';
    const max = Math.max(0, visibleCards.length - cardsPerView());
    arrRight.style.opacity = currentIndex >= max ? '.35' : '1';
    arrRight.style.pointerEvents = currentIndex >= max ? 'none' : 'auto';
  }

  arrLeft.addEventListener('click', () => {
    currentIndex -= cardsPerView();
    applyTranslate();
    updateDots();
    updateArrows();
  });

  arrRight.addEventListener('click', () => {
    currentIndex += cardsPerView();
    applyTranslate();
    updateDots();
    updateArrows();
  });

  /* ─── Category filter ─── */
  catTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;

    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;
    currentIndex = 0;
    track.style.transform = 'translateX(0)';

    // Reset order & show/hide
    allCards.forEach(card => {
      const matches = cat === 'all' || card.dataset.cat === cat;
      card.style.display = matches ? 'flex' : 'none';
      card.style.flexDirection = 'column';
    });

    visibleCards = allCards.filter(c => cat === 'all' || c.dataset.cat === cat);

    // Animate cards in
    visibleCards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity .35s ease, transform .35s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    });

    buildDots();
    updateArrows();
  });

  /* ─── Touch / swipe on mobile ─── */
  let touchStartX = 0;
  wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { currentIndex++; } else { currentIndex--; }
      applyTranslate();
      updateDots();
      updateArrows();
    }
  });

  /* ─── Keyboard navigation ─── */
  document.addEventListener('keydown', e => {
    const menuSection = document.getElementById('menu');
    const rect = menuSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') { currentIndex++; applyTranslate(); updateDots(); updateArrows(); }
      if (e.key === 'ArrowLeft') { currentIndex--; applyTranslate(); updateDots(); updateArrows(); }
    }
  });

  /* ─── Init ─── */
  buildDots();
  updateArrows();
  window.addEventListener('resize', () => {
    buildDots();
    applyTranslate();
    updateArrows();
  });

  /* ─── Scroll reveal ─── */
  const revealEls = document.querySelectorAll('.about-grid, .contact-grid, .menu-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .6s ease ${i * 0.04}s, transform .6s ease ${i * 0.04}s`;
    revealObserver.observe(el);
  });

  /* ─── Contact form ─── */
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = 'var(--green)';
    setTimeout(() => {
      btn.textContent = 'Send Message ☕';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  });

})();
