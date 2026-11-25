if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        for (const { target, isIntersecting } of entries) {
            if (isIntersecting) {
                target.classList.remove("reveal-pending");
                revealObserver.unobserve(target);
            }
        }
    }, { rootMargin: "0px 0px -16px" });

    const revealTargets = Array.from(document.querySelectorAll("[data-reveal]")).filter(
        (element) => element.getBoundingClientRect().top >= window.innerHeight
    );
    for (const element of revealTargets) {
        element.classList.add("reveal-pending");
        revealObserver.observe(element);
    }
}

const hero = document.querySelector(".hero");
const lens = document.querySelector(".cursor-lens");
const pointerMotion = matchMedia("(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)");

function prepareLens() {
    const lensMap = document.querySelector("#cursor-refraction feImage");
    const size = Number(lensMap.getAttribute("width"));
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) return false;

    const map = context.createImageData(size, size);
    const radius = size / 2;
    const center = radius - 0.5;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const offsetX = center - x;
            const offsetY = center - y;
            const distance = Math.hypot(offsetX, offsetY) / radius;
            // Sample closer to the center, with stronger refraction near the rim.
            const refraction = 0.25 + 0.12 * distance ** 3;
            const index = (y * size + x) * 4;
            map.data[index] = 127.5 + 255 * offsetX * refraction / radius;
            map.data[index + 1] = 127.5 + 255 * offsetY * refraction / radius;
            map.data[index + 3] = 255;
        }
    }
    context.putImageData(map, 0, 0);
    lensMap.setAttribute("href", canvas.toDataURL());
    return true;
}

let lensReady;
let pointerFrame = 0;
let pointerX;
let pointerY;
let overHero;

function updatePointerEffects() {
    pointerFrame = 0;
    lensReady ??= CSS.supports("backdrop-filter", 'url("#cursor-refraction")') && prepareLens();
    if (lensReady) {
        lens.style.setProperty("--lens-x", `${pointerX}px`);
        lens.style.setProperty("--lens-y", `${pointerY}px`);
        lens.classList.add("is-visible");
    }
    if (overHero) {
        hero.style.setProperty("--light-x", `${(pointerX / innerWidth - 0.5) * 160}px`);
        hero.style.setProperty("--light-y", `${(pointerY / innerHeight - 0.5) * 110}px`);
    } else {
        hero.style.removeProperty("--light-x");
        hero.style.removeProperty("--light-y");
    }
}

function clearPointerEffects() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    lens.classList.remove("is-visible");
    hero.style.removeProperty("--light-x");
    hero.style.removeProperty("--light-y");
}

window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !pointerMotion.matches) return;

    pointerX = event.clientX;
    pointerY = event.clientY;
    overHero = hero.contains(event.target);
    if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointerEffects);
}, { passive: true });

document.documentElement.addEventListener("pointerleave", clearPointerEffects);
window.addEventListener("blur", clearPointerEffects);
pointerMotion.addEventListener("change", clearPointerEffects);
