// ─────────────────────────────────────────────
//  EmailJS Configuration — replace ALL three
//  placeholders before going live:
//
//  1. Go to https://www.emailjs.com/ and sign up
//  2. Add an Email Service  → copy its Service ID
//  3. Create an Email Template with these variables:
//       {{from_name}}  {{phone}}  {{email}}  {{message}}
//     Set "To Email" in the template to:
//       insiderdirectdine@gmail.com
//  4. Copy your Public Key from Account → API Keys
// ─────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'rK0OPm6fwp6vmfVi5';   // Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_jhm81qe';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_xbc191p';  // e.g. 'template_xyz789'

document.addEventListener('DOMContentLoaded', () => {

    // --- INITIALISE EMAILJS (must happen after DOM ready so SDK is loaded) ---
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.warn('EmailJS SDK not loaded — check the <script> tag in <head>.');
    }

    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- MOBILE MENU TOGGLE ---
    const hamburger   = document.querySelector('.hamburger');
    const mobileMenu  = document.querySelector('.mobile-menu');
    const closeMenu   = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeMenu.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- PHONE MOCKUP: MICRO-INTERACTIONS ---
    const phoneWrapper = document.querySelector('.phone-float-wrapper');
    if (phoneWrapper) {
        const actions = [
            { delay: 4000,  sel: '.ps-add-btn',               cls: 'ps-tapped',        off: 300  },
            { delay: 7500,  sel: '.ps-btn--fill',              cls: 'ps-tapped',        off: 250  },
            { delay: 11000, sel: '.ps-menu-card:nth-child(3)', cls: 'ps-card--hovered', off: 800  },
            { delay: 14500, sel: '.ps-add-btn:last-of-type',   cls: 'ps-tapped',        off: 300  },
            { delay: 18000, sel: '.ps-btn--wa',                cls: 'ps-tapped',        off: 400  },
            { delay: 22000, sel: '.ps-btn--ghost',             cls: 'ps-tapped',        off: 300  },
        ];

        const interactionStyle = document.createElement('style');
        interactionStyle.textContent = `
            .ps-tapped        { transform: scale(0.92) !important; opacity: 0.75 !important; }
            .ps-card--hovered { transform: translateY(-3px) !important;
                                box-shadow: 0 6px 14px rgba(62,39,35,0.18) !important;
                                animation: none !important; }
        `;
        document.head.appendChild(interactionStyle);

        function runSequence() {
            actions.forEach(({ delay, sel, cls, off }) => {
                setTimeout(() => {
                    const el = phoneWrapper.querySelector(sel);
                    if (!el) return;
                    el.classList.add(cls);
                    setTimeout(() => el.classList.remove(cls), off);
                }, delay);
            });
        }

        runSequence();
        setInterval(runSequence, 28000);
    }

    // --- BOOK APPOINTMENT MODAL ---
    const bookModal      = document.getElementById('bookModal');
    const openBookModal  = document.getElementById('openBookModal');
    const closeBookModal = document.getElementById('closeBookModal');
    const waForm         = document.getElementById('wa-form');
    const submitBtn      = document.getElementById('submitBtn');
    const formFeedback   = document.getElementById('form-feedback');

    function openModal() {
        bookModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        hideFeedback();
        waForm.reset();
        // Reset submit button in case it was left in loading state
        setSubmitState(false);
        setTimeout(() => {
            const firstInput = bookModal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 400);
    }

    function closeModal() {
        bookModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showFeedback(type, msg) {
        formFeedback.textContent = msg;
        formFeedback.className   = 'form-feedback ' + type;
        // Scroll feedback into view inside the modal box
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideFeedback() {
        formFeedback.textContent = '';
        formFeedback.className   = 'form-feedback';
    }

    function setSubmitState(loading) {
        submitBtn.disabled  = loading;
        submitBtn.innerHTML = loading
            ? '<i class="fas fa-spinner fa-spin"></i> Sending…'
            : '<i class="fas fa-paper-plane"></i> Book Appointment';
    }

    // Open triggers
    if (openBookModal) openBookModal.addEventListener('click', openModal);

    ['navBookBtn', 'mobileBookBtn', 'heroBookBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    });

    // Close triggers
    if (closeBookModal) closeBookModal.addEventListener('click', closeModal);

    bookModal.addEventListener('click', (e) => {
        if (e.target === bookModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookModal.classList.contains('open')) closeModal();
    });

    // ─────────────────────────────────────────
    //  FORM SUBMIT → EMAILJS
    //  Template must have these exact variables:
    //    {{from_name}}, {{phone}}, {{email}}, {{message}}
    // ─────────────────────────────────────────
    waForm.addEventListener('submit', (e) => {
        e.preventDefault();   // ← prevents page reload
        hideFeedback();

        const name    = document.getElementById('name').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Client-side validation
        if (!name || !phone) {
            showFeedback('error', '⚠️ Please fill in your name and phone number.');
            return;
        }

        // Guard: SDK must be available
        if (typeof emailjs === 'undefined') {
            showFeedback('error', '❌ Email service unavailable. Please refresh the page and try again.');
            return;
        }

        setSubmitState(true);

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name : name,
            phone     : phone,
            email     : email   || 'Not provided',
            message   : message || 'No message provided'
        })
        .then(() => {
            setSubmitState(false);
            showFeedback('success', '✅ Appointment booked! We\'ll be in touch soon.');
            waForm.reset();
            setTimeout(closeModal, 2500);
        })
        .catch((err) => {
            setSubmitState(false);
            console.error('EmailJS send error:', err);       // visible in DevTools
            showFeedback('error', '❌ Something went wrong. Please try again or email us at insiderdirectdine@gmail.com');
        });
    });

});
