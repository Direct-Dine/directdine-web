// =======================
// NAVBAR SCROLL EFFECT
// =======================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});


// =======================
// SCROLL REVEAL
// =======================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".sr").forEach(el => observer.observe(el));


// =======================
// LIGHTBOX
// =======================
function openImg(img) {
  const lightbox = document.getElementById("lightbox");
  const lightImg = document.getElementById("lightImg");
  if (!lightbox || !lightImg) return;
  lightbox.style.display = "flex";
  lightImg.src = img.src;
  document.body.style.overflow = "hidden";
}

function closeImg() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.style.display = "none";
  document.body.style.overflow = "";
}

document.querySelectorAll(".gallery img").forEach(img => {
  img.addEventListener("click", () => openImg(img));
});

document.getElementById("lightbox")?.addEventListener("click", (e) => {
  if (e.target !== document.getElementById("lightImg")) closeImg();
});

document.querySelector(".lightbox-close")?.addEventListener("click", closeImg);


// =======================
// MOBILE NAV
// =======================
document.querySelector(".menu-btn")?.addEventListener("click", () => {
  const nav = document.getElementById("navLinks");
  if (!nav) return;
  nav.classList.toggle("active");
  document.body.style.overflow = nav.classList.contains("active") ? "hidden" : "";
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("navLinks");
    if (nav) nav.classList.remove("active");
    document.body.style.overflow = "";
  });
});


// =======================
// SMOOTH SCROLL
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#menu") return; // handled by book opener
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});


// =======================
// ESC KEY
// =======================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeImg();
    closeBook();
  }
});


// =======================
// BOOK MENU
// =======================
const overlay  = document.getElementById("menuOverlay");
const pages    = Array.from(document.querySelectorAll(".page"));
const btnPrev  = document.getElementById("bookPrev");
const btnNext  = document.getElementById("bookNext");
const dotsWrap = document.getElementById("indicatorDots");

let flippedCount = 0;
const TOTAL_PAGES = pages.length; // 2
const TOTAL_VIEWS = TOTAL_PAGES + 1; // 3 views total
const dots = [];

for (let i = 0; i < TOTAL_VIEWS; i++) {
  const d = document.createElement("div");
  d.className = "dot" + (i === 0 ? " active" : "");
  d.setAttribute("aria-label", "View " + (i + 1));
  d.addEventListener("click", () => goToView(i));
  dotsWrap.appendChild(d);
  dots.push(d);
}

function updateUI() {
  pages.forEach((page, idx) => {
    page.classList.toggle("flipped", idx < flippedCount);
  });
  btnPrev.disabled = flippedCount === 0;
  btnNext.disabled = flippedCount === TOTAL_PAGES;
  dots.forEach((d, i) => d.classList.toggle("active", i === flippedCount));
}

function goToView(view) {
  flippedCount = Math.max(0, Math.min(TOTAL_PAGES, view));
  updateUI();
}

btnNext?.addEventListener("click", () => {
  if (flippedCount < TOTAL_PAGES) { flippedCount++; updateUI(); }
});

btnPrev?.addEventListener("click", () => {
  if (flippedCount > 0) { flippedCount--; updateUI(); }
});

// Swipe
let touchStartX = 0;
overlay?.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
overlay?.addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0 && flippedCount < TOTAL_PAGES) { flippedCount++; updateUI(); }
    if (diff < 0 && flippedCount > 0)          { flippedCount--; updateUI(); }
  }
});

function openBook() {
  flippedCount = 0;
  updateUI();
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeBook() {
  overlay?.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("openMenuBook")?.addEventListener("click", openBook);
document.getElementById("closeMenuBook")?.addEventListener("click", closeBook);

overlay?.addEventListener("click", (e) => {
  if (e.target === overlay || e.target.classList.contains("book-overlay-bg")) closeBook();
});

// Nav "Menu" link opens the book instead of scrolling
document.querySelectorAll('#navLinks a[href="#menu"]').forEach(link => {
  link.addEventListener("click", (e) => {
    e.stopPropagation();
    const nav = document.getElementById("navLinks");
    if (nav) nav.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(openBook, 100);
  });
});

// Hero "Explore Menu" button also opens book
document.querySelectorAll('a.btn[href="#menu"]').forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    setTimeout(openBook, 50);
  });
});
