if ("IntersectionObserver" in window) {
    const revealThreshold = 0.25;
    const revealObserver = new IntersectionObserver((entries) => {
        for (const { target, intersectionRatio } of entries) {
            if (intersectionRatio >= revealThreshold) {
                target.classList.remove("reveal-pending");
                revealObserver.unobserve(target);
            }
        }
    }, { threshold: revealThreshold });

    for (const image of document.querySelectorAll(".project-media img")) {
        image.classList.add("reveal-pending");
        revealObserver.observe(image);
    }
}
