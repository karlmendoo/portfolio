"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Expertise", "expertise"],
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
            <span className="nav-dot" aria-hidden="true" />
          </a>
        ))}
      </nav>
      <a className="nav-contact" href="mailto:normandkarol.mendoza@ust.edu.ph">
        Let’s talk
        <span className="small-plus" aria-hidden="true">
          +
        </span>
      </a>
      <div className="reading-progress" aria-hidden="true" />
    </header>
  );
}
