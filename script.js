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

    // --- Cinematic SVG Aurora Parallax & Mouse Interaction ---
    const parallaxLayers = [
        { el: document.querySelector('.p-back'), scrollFactorY: -0.015, scrollFactorX: -0.005, mouseFactor: -0.005 },
        { el: document.querySelector('.p-mid'), scrollFactorY: -0.035, scrollFactorX: -0.010, mouseFactor: -0.010 },
        { el: document.querySelector('.p-main'), scrollFactorY: -0.060, scrollFactorX: -0.015, mouseFactor: -0.015 },
        { el: document.querySelector('.p-front'), scrollFactorY: -0.090, scrollFactorX: -0.020, mouseFactor: -0.020 }
    ];

    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let targetMouseX = 0, targetMouseY = 0;
    let currentMouseX = 0, currentMouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let animationRunning = false;
    const EPSILON = 0.5;

    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    }, { passive: true });

    if (isDesktop) {
        document.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX - windowHalfX;
            targetMouseY = e.clientY - windowHalfY;
            startParallax();
        }, { passive: true });
    }

    function renderParallax() {
        if (prefersReducedMotion) return;
        
        let needsUpdate = false;

        // Scroll lerp
        if (Math.abs(targetScroll - currentScroll) > EPSILON) {
            currentScroll += (targetScroll - currentScroll) * 0.04;
            needsUpdate = true;
        } else {
            currentScroll = targetScroll;
        }
        
        // Mouse lerp
        if (isDesktop) {
            if (Math.abs(targetMouseX - currentMouseX) > EPSILON || Math.abs(targetMouseY - currentMouseY) > EPSILON) {
                currentMouseX += (targetMouseX - currentMouseX) * 0.05;
                currentMouseY += (targetMouseY - currentMouseY) * 0.05;
                needsUpdate = true;
            } else {
                currentMouseX = targetMouseX;
                currentMouseY = targetMouseY;
            }
        }

        if (needsUpdate) {
            parallaxLayers.forEach(layer => {
                if (layer.el) {
                    const yOffset = currentScroll * layer.scrollFactorY;
                    const xOffset = currentScroll * layer.scrollFactorX;
                    const mouseXOffset = currentMouseX * layer.mouseFactor;
                    const mouseYOffset = currentMouseY * layer.mouseFactor;
                    layer.el.style.transform = `translate3d(${xOffset + mouseXOffset}px, ${yOffset + mouseYOffset}px, 0)`;
                }
            });
            requestAnimationFrame(renderParallax);
        } else {
            animationRunning = false;
        }
    }

    function startParallax() {
        if (!animationRunning && !prefersReducedMotion) {
            animationRunning = true;
            requestAnimationFrame(renderParallax);
        }
    }

    // --- Unified Scroll Handler ---
    const navbar = document.querySelector('.navbar');
    let isScrollTicking = false;

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
        
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

        startParallax();
    }, { passive: true });

    // Initial trigger
    if (!prefersReducedMotion) {
        startParallax();
    }

});
