"use client";
import { useEffect, useRef, useState } from "react";
import { github } from "@/lib/content";
const links = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Work", "work"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];
export function Navigation() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="navigation">
      <a
        className="wordmark"
        href="#top"
        aria-label="Normand Karol Mendoza, back to top"
      >
        nk<span>m.</span>
      </a>
      <button
        className="menu-button"
        ref={menuButton}
        type="button"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span
          className={open ? "menu-symbol open" : "menu-symbol"}
          aria-hidden="true"
        >
          <i />
          <i />
        </span>
      </button>
      <nav
        id="main-navigation"
        className={open ? "nav-links open" : "nav-links"}
        aria-label="Main navigation"
      >
        {links.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            data-nav={id}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
      <a
        className="nav-contact"
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="GITHUB"
        aria-label="GitHub profile of karlmendoo (opens in a new tab)"
      >
        <svg viewBox="0 0 24 24" className="github-icon" aria-hidden="true">
          <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.12.67-3.78-1.32-3.78-1.32-.5-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.49-.28-5.11-1.25-5.11-5.56 0-1.23.44-2.24 1.15-3.03-.12-.28-.5-1.43.11-2.99 0 0 .94-.3 3.08 1.15a10.73 10.73 0 0 1 5.6 0c2.14-1.45 3.07-1.15 3.07-1.15.62 1.56.23 2.7.12 2.99.71.79 1.14 1.8 1.14 3.03 0 4.32-2.62 5.27-5.13 5.55.4.35.76 1.03.76 2.07v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
        </svg>
        GitHub
      </a>
      <div className="reading-progress" aria-hidden="true" />
    </header>
  );
}
