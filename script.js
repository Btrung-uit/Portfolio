document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // --- Active Navigation Link using IntersectionObserver ---
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const current = entry.target.getAttribute('id');
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "-40% 0px -60% 0px" });

    sections.forEach(sec => navObserver.observe(sec));

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Check Device Type ---
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Custom Cursor Glow (Desktop Only) ---
    const cursor = document.querySelector('.cursor-glow');
    let cursorRAF = null;
    let targetCursorX = 0, targetCursorY = 0;

    if (cursor && isDesktop) {
        document.addEventListener('mousemove', (e) => {
            if (cursor.style.top === '-1000px') {
                cursor.style.top = '0px';
                cursor.style.left = '0px';
            }
            
            targetCursorX = e.clientX;
            targetCursorY = e.clientY;

            if (!cursorRAF) {
                cursorRAF = window.requestAnimationFrame(() => {
                    cursor.style.transform = `translate(calc(${targetCursorX}px - 50%), calc(${targetCursorY}px - 50%))`;
                    cursorRAF = null;
                });
            }
        }, { passive: true });
        
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }


    // --- Subtle 3D Tilt Effect for Cards (Desktop Only) ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (isDesktop) {
        tiltCards.forEach(card => {
            let rect;
            card.addEventListener('mouseenter', () => {
                rect = card.getBoundingClientRect();
            });

            card.addEventListener('mousemove', (e) => {
                if (!rect) rect = card.getBoundingClientRect(); // Fallback
                
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                window.requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                window.requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                });
                rect = null; // Clear cache on leave
            });
        });
    }

    // --- Optional Subtle Background Micro-interaction (Desktop Only) ---
    const bgArtwork = document.querySelector('.bg-artwork');
    let bgRAF = null;
    
    if (bgArtwork && isDesktop && !prefersReducedMotion) {
        document.addEventListener('mousemove', (e) => {
            if (!bgRAF) {
                bgRAF = window.requestAnimationFrame(() => {
                    // Maximum movement of 5px for extreme subtlety and performance
                    const x = (e.clientX / window.innerWidth - 0.5) * 10; 
                    const y = (e.clientY / window.innerHeight - 0.5) * 10;
                    
                    bgArtwork.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                    bgRAF = null;
                });
            }
        }, { passive: true });
    }

    // --- Unified Scroll Handler ---
    const navbar = document.querySelector('.navbar');
    let isScrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                // Navbar Update
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }, { passive: true });

});
