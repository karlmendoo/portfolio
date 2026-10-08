"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Lenis and ScrollTrigger share GSAP's ticker; there is no competing RAF loop.
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
      // Update navigation immediately, including when already at the target or
      // when a wheel gesture interrupts the smooth scroll before completion.
      if (window.location.hash !== hash)
        window.history.pushState(null, "", hash);
      focusTarget(target);
      // Lenis reads CSS scroll-padding itself; adding an offset would double it.
      if (lenis)
        lenis.scrollTo(target, { duration: 0.95 });
      else {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
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
      const tick = (time: number) => smooth.raf(time * 1000);
      smooth.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      gsap.from(".hero-line", {
        yPercent: 108,
        duration: 1.25,
        stagger: 0.12,
        ease: "power4.out",
        clearProps: "transform",
      });
      gsap.from(".hero-topline", {
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        clearProps: "opacity",
      });
      gsap.from(".hero-bottom", {
        opacity: 0,
        duration: 0.9,
        delay: 0.4,
        clearProps: "opacity",
      });
      gsap.to(".hero-name", {
        y: -40,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.from(".about h2 em", {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ".about", start: "top 78%", once: true },
        clearProps: "clipPath",
      });
      gsap.utils.toArray<HTMLElement>(".label-line").forEach((line) =>
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.15,
          ease: "power3.inOut",
          scrollTrigger: { trigger: line, start: "top 88%", once: true },
          clearProps: "transform",
        }),
      );
      gsap.utils.toArray<HTMLElement>(".experience-row").forEach((row) =>
        gsap.from(row.querySelector(".experience-content"), {
          x: 30,
          opacity: 0.3,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
          clearProps: "transform,opacity",
        }),
      );
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
          xPercent: -22,
          ease: "none",
          scrollTrigger: {
            trigger: ".expertise",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );
      gsap.to(".education-mark", {
        rotation: 12,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: ".education",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.from(".contact-line", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.1,
        stagger: 0.14,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ".contact", start: "top 70%", once: true },
        clearProps: "clipPath",
      });
      return () => {
        gsap.ticker.remove(tick);
        smooth.off("scroll", ScrollTrigger.update);
        smooth.destroy();
        lenis = null;
      };
    });
    const progressContext = gsap.context(() => {
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
        .querySelectorAll<HTMLElement>("main > section, footer")
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
      progressContext.revert();
    };
  }, []);
  return null;
}
