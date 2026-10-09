"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function PortfolioMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let lenis: Lenis | null = null;
    let mounted = true;
    const media = gsap.matchMedia();
    const focusTarget = (target: HTMLElement) => {
      const hadTabIndex = target.hasAttribute("tabindex");
      if (!hadTabIndex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (!hadTabIndex)
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          { once: true },
        );
    };
    function onAnchor(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (window.location.hash !== hash)
        window.history.pushState(null, "", hash);
      focusTarget(target);
      if (lenis) lenis.scrollTo(target, { duration: 0.9 });
      else target.scrollIntoView({ behavior: "instant", block: "start" });
    }
    document.addEventListener("click", onAnchor);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const smooth = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });
      lenis = smooth;
      // One clock for Lenis, ScrollTrigger, and cursor motion.
      const tick = (time: number) => smooth.raf(time * 1000);
      smooth.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      gsap.from(".hero-name .split-char", {
        yPercent: 90,
        opacity: 0,
        stagger: 0.028,
        duration: 1.15,
        ease: "power4.out",
        clearProps: "transform,opacity",
      });
      gsap.from(".hero-topline,.hero-title-caption,.hero-bottom", {
        opacity: 0,
        y: 12,
        stagger: 0.1,
        delay: 0.3,
        duration: 0.8,
        clearProps: "transform,opacity",
      });
      gsap.utils.toArray<HTMLElement>(".label-line").forEach((line) =>
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.95,
          ease: "power3.inOut",
          scrollTrigger: { trigger: line, start: "top 90%", once: true },
          clearProps: "transform",
        }),
      );
      gsap.utils
        .toArray<HTMLElement>(
          ".technical-row,.experience-row,.education-row,.music-art-reveal,.music-controls",
        )
        .forEach((row) =>
          gsap.from(row, {
            y: 30,
            opacity: 0.2,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 94%", once: true },
            clearProps: "transform,opacity",
          }),
        );
      gsap.from(".about-statement h2", {
        y: 65,
        opacity: 0.3,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-statement",
          start: "top 90%",
          once: true,
        },
        clearProps: "transform,opacity",
      });
      gsap.fromTo(
        ".timeline-rail span",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: ".experience-list",
            start: "top 45%",
            end: "bottom 65%",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".ribbon-track",
        { xPercent: 0 },
        {
          xPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: ".expertise",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      gsap.from(".contact-line", {
        y: 50,
        opacity: 0.2,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact", start: "top 85%", once: true },
        clearProps: "transform,opacity",
      });
      return () => {
        gsap.ticker.remove(tick);
        smooth.off("scroll", ScrollTrigger.update);
        smooth.destroy();
        lenis = null;
      };
    });
    media.add(
      "(min-height: 600px) and (prefers-reduced-motion: no-preference)",
      () => {
        // The hero works with native touch scrolling as well as mouse scrolling.
        document.documentElement.classList.add("motion-hero");
        const hero = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
          },
        });
        hero
          .to(
            ".hero-name-row:first-child",
            {
              xPercent: -7,
              y: -35,
              rotation: -3,
              opacity: 0,
              ease: "power2.in",
            },
            0,
          )
          .to(
            ".hero-last",
            { xPercent: 8, y: 40, rotation: 3, opacity: 0, ease: "power2.in" },
            0,
          )
          .fromTo(
            ".hero-reveal",
            { autoAlpha: 0, scale: 0.9 },
            { autoAlpha: 1, scale: 1, ease: "power2.out" },
            0.4,
          )
          .to(".hero-reveal", { y: -35, ease: "none" }, 0.9);
        return () => {
          document.documentElement.classList.remove("motion-hero");
        };
      },
    );
    media.add(
      "(min-width: 1000px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        document.documentElement.classList.add("motion-desktop");
        gsap.to(".about-marker", {
          y: 80,
          rotation: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(".education-mark", {
          y: -70,
          rotation: 9,
          ease: "none",
          scrollTrigger: {
            trigger: ".education",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>(".project-art").forEach((art) => {
          gsap.fromTo(
            art.querySelector(".project-art-word"),
            { y: 65, rotation: -3 },
            {
              y: -65,
              rotation: 3,
              ease: "none",
              scrollTrigger: {
                trigger: art,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
          gsap.fromTo(
            art.querySelector(".project-art-grid"),
            { scale: 1.4 },
            {
              scale: 1.7,
              ease: "none",
              scrollTrigger: {
                trigger: art,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            },
          );
        });
        const cursor = document.querySelector<HTMLElement>(".cursor");
        if (!cursor) return;
        const xTo = gsap.quickTo(cursor, "x", {
          duration: 0.18,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(cursor, "y", {
          duration: 0.18,
          ease: "power3.out",
        });
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          xTo(event.clientX);
          yTo(event.clientY);
          cursor.style.opacity = "1";
          const target = (event.target as Element).closest<HTMLElement>(
            "[data-cursor],a,button,summary",
          );
          cursor.dataset.active = String(!!target);
          const label = cursor.querySelector<HTMLElement>(".cursor-label");
          if (label)
            label.textContent =
              target?.dataset.cursor ??
              (target?.tagName === "SUMMARY" ? "OPEN" : "VIEW");
        };
        const hide = () => {
          cursor.style.opacity = "0";
        };
        document.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", hide);
        window.addEventListener("blur", hide);
        return () => {
          document.documentElement.classList.remove("motion-desktop");
          document.removeEventListener("pointermove", move);
          document.documentElement.removeEventListener("pointerleave", hide);
          window.removeEventListener("blur", hide);
          xTo.tween.kill();
          yTo.tween.kill();
          cursor.style.opacity = "0";
        };
      },
    );
    const navigationContext = gsap.context(() => {
      gsap.to(".reading-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: "max",
          scrub: true,
        },
      });
      document
        .querySelectorAll<HTMLElement>("main > section,footer")
        .forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 25%",
            end: "bottom 25%",
            onToggle: (self) => {
              if (!self.isActive) return;
              document
                .querySelectorAll<HTMLAnchorElement>("[data-nav]")
                .forEach((link) => {
                  if (link.dataset.nav === section.id)
                    link.setAttribute("aria-current", "location");
                  else link.removeAttribute("aria-current");
                });
            },
          });
        });
    });
    const refresh = () => {
      if (mounted) {
        lenis?.resize();
        ScrollTrigger.refresh();
      }
    };
    const details = document.querySelectorAll("details");
    details.forEach((item) => item.addEventListener("toggle", refresh));
    document.fonts.ready.then(refresh);
    return () => {
      mounted = false;
      document.removeEventListener("click", onAnchor);
      details.forEach((item) => item.removeEventListener("toggle", refresh));
      media.revert();
      navigationContext.revert();
    };
  }, []);
  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor-label" />
    </div>
  );
}
