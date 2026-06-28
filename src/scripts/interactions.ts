// Site-wide interaction layer. All effects are opt-in via data-attributes and
// fully disabled under prefers-reduced-motion.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function reveals() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

function countUps() {
  const els = document.querySelectorAll<HTMLElement>("[data-countup]");
  els.forEach((el) => {
    const target = parseInt(el.dataset.countup || el.textContent || "0", 10);
    if (reduce || isNaN(target)) { el.textContent = String(target).padStart(2, "0"); return; }
    el.textContent = "00";
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        obs.unobserve(e.target);
        const dur = 900, start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased)).padStart(2, "0");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.6 });
    io.observe(el);
  });
}

function floodlight() {
  if (reduce) return;
  const zones = document.querySelectorAll<HTMLElement>("[data-floodlight]");
  zones.forEach((zone) => {
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
