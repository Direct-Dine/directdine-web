/* ===== BON BOUQUET CAFÉ — script.js ===== */

(function () {
  'use strict';

  /* ─── Navbar ─── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('solid', window.scrollY > 80);
  });

  /* ─── Scroll reveal ─── */
  const fadeEls = document.querySelectorAll('.about-container, .contact-wrap, .mos-item');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  fadeEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .8s ease ${i * 0.05}s, transform .8s ease ${i * 0.05}s`;
    ro.observe(el);
  });

  /* ─── Reservation form ─── */
  const resForm = document.getElementById('resForm');
  if (resForm) {
    resForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = resForm.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Request Received ✦';
      btn.style.background = 'var(--brown)';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; resForm.reset(); }, 3500);
    });
  }

  /* ════════════════════════════════════════════
     BOOK MENU SYSTEM
  ════════════════════════════════════════════ */
  const spreads = Array.from(document.querySelectorAll('.book-spread'));
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const bpCurrent = document.getElementById('bpCurrent');
  const bpTotal = document.getElementById('bpTotal');
  const chTabs = document.querySelectorAll('.ch-tab');

  let current = 0;
  const total = spreads.length;
  let animating = false;

  bpTotal.textContent = total;

  function goToSpread(target, direction) {
    if (animating || target === current || target < 0 || target >= total) return;
    animating = true;

    const outSpread = spreads[current];
    const inSpread = spreads[target];

    // Determine slide direction class
    const slideOutClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    const slideInClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

    // Apply turn-out to current
    outSpread.classList.add('turning-out');

    setTimeout(() => {
      outSpread.classList.remove('active', 'turning-out');
      inSpread.style.opacity = '0';
      inSpread.style.transform = direction === 'next' ? 'rotateY(8deg) translateX(20px)' : 'rotateY(-8deg) translateX(-20px)';
      inSpread.classList.add('active');

      requestAnimationFrame(() => {
        inSpread.style.transition = 'opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)';
        inSpread.style.opacity = '1';
        inSpread.style.transform = 'rotateY(0deg) translateX(0)';

        setTimeout(() => {
          inSpread.style.transition = '';
          inSpread.style.transform = '';
          animating = false;
        }, 520);
      });

      current = target;
      updateUI();
    }, 420);
  }

  function updateUI() {
    bpCurrent.textContent = current + 1;

    // Buttons
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    // Chapter tabs
    chTabs.forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.spread) === current);
    });

    // Subtle page shadow depth
    const book = document.getElementById('book');
    const depth = (current / (total - 1)) * 6;
    book.style.boxShadow = `${depth}px 0 ${20 + depth * 2}px rgba(61,32,16,.${Math.round(15 + current * 3)})`;
  }

  prevBtn.addEventListener('click', () => goToSpread(current - 1, 'prev'));
  nextBtn.addEventListener('click', () => goToSpread(current + 1, 'next'));

  chTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = parseInt(tab.dataset.spread);
      const dir = target > current ? 'next' : 'prev';
      goToSpread(target, dir);
    });
  });

  /* ─── Keyboard navigation ─── */
  document.addEventListener('keydown', e => {
    const menu = document.getElementById('menu');
    const rect = menu.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') goToSpread(current + 1, 'next');
      if (e.key === 'ArrowLeft') goToSpread(current - 1, 'prev');
    }
  });

  /* ─── Touch / swipe ─── */
  const bookScene = document.getElementById('bookScene');
  let touchStartX = 0;
  bookScene.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  bookScene.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goToSpread(current + 1, 'next');
      else goToSpread(current - 1, 'prev');
    }
  });

  /* ─── Page corner hover sound (visual effect only) ─── */
  const rightPages = document.querySelectorAll('.page-right');
  rightPages.forEach(page => {
    page.addEventListener('mouseenter', () => {
      page.style.cursor = 'pointer';
    });
    page.addEventListener('click', () => {
      if (!nextBtn.disabled) goToSpread(current + 1, 'next');
    });
  });

  // Init
  updateUI();

})();
