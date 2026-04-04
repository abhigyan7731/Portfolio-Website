// Minimal local replacements for GSAP Club plugins (SplitText, ScrollSmoother)
export class SplitText {
  constructor(target, _opts) {
    this.chars = [];
    this.words = [];
    this.lines = [];
    const elems = [];
    if (typeof target === "string") {
      elems.push(...Array.from(document.querySelectorAll(target)));
    } else if (Array.isArray(target)) {
      target.forEach((t) => {
        if (typeof t === "string") {
          elems.push(...Array.from(document.querySelectorAll(t)));
        } else if (t instanceof Element) elems.push(t);
      });
    } else if (target instanceof Element) elems.push(target);

    elems.forEach((el) => {
      const text = el.textContent || "";
      el.innerHTML = text
        .split(" ")
        .map((w) =>
          `<span class="split-word">${[...w]
            .map((c) => `<span class="split-char">${c}</span>`)
            .join("")}</span>`
        )
        .join(" ");
      this.words.push(...Array.from(el.querySelectorAll(".split-word")));
      this.chars.push(...Array.from(el.querySelectorAll(".split-char")));
    });
  }
  revert() {}
}

export const ScrollSmoother = {
  create: (_opts) => ({
    scrollTop: (n) => window.scrollTo(0, n),
    paused: (_v) => {},
    scrollTo: (section) => {
      try {
        const el = document.querySelector(section);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } catch (e) {}
    },
    kill: () => {},
  }),
  refresh: (_force) => {},
};
