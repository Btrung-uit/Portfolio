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


    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Subtract offset to trigger slightly before the section reaches the absolute top
            if (window.scrollY >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    // --- Parallax Aurora Background ---
    // (Handled entirely by CSS for smoother vertical band animations)


    // --- Custom Cursor Glow (Desktop Only) ---
    const cursor = document.querySelector('.cursor-glow');
    
    // Check if device supports hover (usually desktop)
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (cursor && isDesktop) {
        document.addEventListener('mousemove', (e) => {
            // Unhide cursor on first move
            if (cursor.style.top === '-1000px') {
                cursor.style.top = '0px';
                cursor.style.left = '0px';
            }
            
            // Use requestAnimationFrame for smoother following
            window.requestAnimationFrame(() => {
                cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
            });
        });
        
        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }


    // --- Subtle 3D Tilt Effect for Cards (Desktop Only) ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (isDesktop) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 5 degrees for subtlety)
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                window.requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                window.requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                });
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
    
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    });

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    });

    if (isDesktop) {
        document.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX - windowHalfX;
            targetMouseY = e.clientY - windowHalfY;
        });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderParallax() {
        if (!prefersReducedMotion) {
            // Smooth inertia interpolation (lerp)
            currentScroll += (targetScroll - currentScroll) * 0.04;
            
            if (isDesktop) {
                currentMouseX += (targetMouseX - currentMouseX) * 0.05;
                currentMouseY += (targetMouseY - currentMouseY) * 0.05;
            }

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
        }
    }

    if (!prefersReducedMotion) {
        renderParallax();
    }

});
