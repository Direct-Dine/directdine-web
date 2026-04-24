document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeMenu.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- SCROLL REVEAL ANIMATIONS ---
    // Using Intersection Observer for high-performance, smooth revealing elements
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- PHONE MOCKUP: MICRO-INTERACTIONS ---
    // Simulates a "real user" browsing: taps the add-to-cart button, hovers cards, etc.
    // Purely cosmetic — no state change needed.

    const phoneWrapper = document.querySelector('.phone-float-wrapper');
    if (phoneWrapper) {

        // Sequence of actions (ms delay, selector to trigger, class to toggle, toggle-off delay)
        const actions = [
            { delay: 4000,  sel: '.ps-add-btn',       cls: 'ps-tapped',   off: 300  },
            { delay: 7500,  sel: '.ps-btn--fill',      cls: 'ps-tapped',   off: 250  },
            { delay: 11000, sel: '.ps-menu-card:nth-child(3)', cls: 'ps-card--hovered', off: 800 },
            { delay: 14500, sel: '.ps-add-btn:last-of-type',   cls: 'ps-tapped',   off: 300  },
            { delay: 18000, sel: '.ps-btn--wa',        cls: 'ps-tapped',   off: 400  },
            { delay: 22000, sel: '.ps-btn--ghost',     cls: 'ps-tapped',   off: 300  },
        ];

        // Inject the tapped / hovered CSS once
        const interactionStyle = document.createElement('style');
        interactionStyle.textContent = `
            .ps-tapped        { transform: scale(0.92) !important; opacity: 0.75 !important; }
            .ps-card--hovered { transform: translateY(-3px) !important;
                                box-shadow: 0 6px 14px rgba(62,39,35,0.18) !important;
                                animation: none !important; }
        `;
        document.head.appendChild(interactionStyle);

        // Run the sequence, loop every 26s to stay in sync with psAutoScroll (28s)
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
        setInterval(runSequence, 28000); // keep in step with CSS scroll loop
    }
    const waForm = document.getElementById('wa-form');
    
    // --- BOOK APPOINTMENT MODAL ---
    const bookModal      = document.getElementById('bookModal');
    const openBookModal  = document.getElementById('openBookModal');
    const closeBookModal = document.getElementById('closeBookModal');

    function openModal() {
        bookModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Focus first input for accessibility
        setTimeout(() => {
            const firstInput = bookModal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 400);
    }

    function closeModal() {
        bookModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Open via CTA button in #book section
    if (openBookModal) openBookModal.addEventListener('click', openModal);

    // Open via navbar, mobile menu, hero buttons
    ['navBookBtn', 'mobileBookBtn', 'heroBookBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    });

    // Close via X button
    if (closeBookModal) closeBookModal.addEventListener('click', closeModal);

    // Close by clicking backdrop (outside modal box)
    bookModal.addEventListener('click', (e) => {
        if (e.target === bookModal) closeModal();
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookModal.classList.contains('open')) closeModal();
    });

    waForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent standard page reload
        
        // Get input values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // Use a default country code (+91) format base, adaptable for clients
        const targetNumber = '919999999999'; // REPLACE WITH ACTUAL AGENCY NUMBER
        
        // Construct the message
        const message = `Hi Direct Dine! 👋\n\nI want a premium website for my restaurant.\n\n*Name/Restaurant:* ${name}\n*Phone:* ${phone}\n\nPlease get back to me!`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Construct WhatsApp URL
        const waURL = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(waURL, '_blank');
        
        // Close modal and reset form
        closeModal();
        waForm.reset();
    });

});