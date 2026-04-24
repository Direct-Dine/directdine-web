document.addEventListener("DOMContentLoaded", () => {
    
    // Smooth Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // Optional Parallax for Hero
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        let scrollPosition = window.pageYOffset;
        if (hero && scrollPosition < window.innerHeight) {
            hero.style.backgroundPosition = `20px ${30 + scrollPosition * 0.2}px, 100px ${80 + scrollPosition * 0.2}px`;
        }
    });

});