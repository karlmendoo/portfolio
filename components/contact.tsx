"use client";
import { useEffect, useRef, useState } from "react";
import { email } from "@/lib/content";
export function Contact() {
  const [status, setStatus] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied");
    } catch {
      setStatus("Copy unavailable — use the email link");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus(""), 4500);
  }
  return (
    <footer
      id="contact"
      className="contact section"
      aria-labelledby="contact-heading"
    >
      <div className="section-label">
        <span>05 / CONTACT</span>
        <span className="label-line" />
        <span>LET’S CONNECT</span>
      </div>
      <h2 id="contact-heading">
        <span className="contact-line">Good things start</span>
        <span className="contact-line">
          with a <em>conversation.</em>
        </span>
      </h2>
      <div className="contact-bottom">
        <div>
          <p className="contact-intro">
            Have an opportunity, an idea,
            <br />
            or a conversation in mind?
          </p>
          <a className="contact-email" href={`mailto:${email}`}>
            {email}
          </a>
          <div className="copy-row">
            <button type="button" className="copy-button" onClick={copyEmail}>
              {status === "Email copied" ? "Copied" : "Copy email"}
              <span className="copy-icon" aria-hidden="true" />
            </button>
            <span role="status" aria-live="polite">
              {status}
            </span>
          </div>
        </div>
        <div className="contact-location">
          <span className="eyebrow">BASED IN</span>
          <p>
            Caloocan City
            <br />
            <em>Philippines</em>
          </p>
        </div>
      </div>
      <div className="footer-line">
        <a className="footer-name" href="#top">
          Normand Karol Mendoza
        </a>
        <span>© 2026</span>
        <a className="back-top text-link" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
