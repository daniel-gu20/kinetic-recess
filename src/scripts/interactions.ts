// Site-wide interaction layer. Effects are opt-in via data-attributes and fail
// OPEN: content is visible without JS, and a safety net guarantees nothing stays
// hidden even if scroll detection misbehaves.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function inView(el: Element, ratio = 0.88): boolean {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return r.top < vh * ratio && r.bottom > 0;
}

function reveals() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal],[data-reveal-stagger]"));
  if (reduce) { els.forEach((e) => e.classList.add("is-visible")); return; }
  let pending = els.slice();
  const check = () => {
    pending = pending.filter((el) => {
      if (inView(el)) { el.classList.add("is-visible"); return false; }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  };
  let raf = 0;
  const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { check(); raf = 0; }); };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  check(); // reveal whatever is already in view
  // Safety net: never let anything stay hidden.
  setTimeout(() => els.forEach((e) => e.classList.add("is-visible")), 2600);
}

function countUps() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-countup]"));
  els.forEach((el) => {
    const target = parseInt(el.dataset.countup || el.textContent || "0", 10);
    if (isNaN(target)) return;
    const finalText = String(target).padStart(2, "0");
    if (reduce) { el.textContent = finalText; return; }
    let done = false;
    const animate = () => {
      if (done) return; done = true;
      const dur = 900, start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased)).padStart(2, "0");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    // animate when scrolled into view; the real value is already rendered, so
    // if this never triggers the number is simply correct (not stuck at 00).
    const onScroll = () => { if (inView(el, 0.85)) { animate(); window.removeEventListener("scroll", onScroll); } };
    if (inView(el, 0.85)) animate();
    else window.addEventListener("scroll", onScroll, { passive: true });
  });
}

function floodlight() {
  if (reduce) return;
  document.querySelectorAll<HTMLElement>("[data-floodlight]").forEach((zone) => {
    let raf = 0;
    zone.addEventListener("pointermove", (ev) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = zone.getBoundingClientRect();
        zone.style.setProperty("--mx", `${((ev.clientX - r.left) / r.width) * 100}%`);
        zone.style.setProperty("--my", `${((ev.clientY - r.top) / r.height) * 100}%`);
        raf = 0;
      });
    });
  });
}

const run = () => { reveals(); countUps(); floodlight(); };
if (document.readyState !== "loading") run();
else document.addEventListener("DOMContentLoaded", run);
