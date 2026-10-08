export function Hero() {
  return (
    <section className="hero section" id="top" aria-labelledby="hero-heading">
      <div className="hero-topline">
        <span>COMPUTER SCIENCE · BACKEND AI</span>
        <span>CALOOCAN CITY, PHILIPPINES</span>
      </div>
      <h1 id="hero-heading" className="hero-name">
        <span className="line-mask">
          <span className="hero-line">Normand Karol</span>
        </span>
        <span className="line-mask second-line">
          <span className="hero-line">
            Mendoza<span className="name-period">.</span>
          </span>
        </span>
      </h1>
      <div className="hero-bottom">
        <div className="hero-position">
          <span className="eyebrow">A LITTLE ABOUT MY DIRECTION</span>
          <p>
            A mind for systems.
            <br />
            <em>An instinct for people.</em>
          </p>
        </div>
        <div className="hero-summary">
          <p>
            Computer Science student at UST.
            <br />
            Backend AI intern at FlyRank AI.
            <br />
            Bringing clarity, care, and coordination
            <br className="desktop-break" /> to the work I do.
          </p>
          <a className="text-link" href="#experience">
            Explore my experience{" "}
            <span className="link-plus" aria-hidden="true">
              +
            </span>
          </a>
        </div>
        <a href="#about" className="scroll-cue" aria-label="Scroll to about">
          <span className="scroll-track">
            <span />
          </span>
          <span>SCROLL TO DISCOVER</span>
        </a>
      </div>
      <div className="hero-rule">
        <span>PERSONAL PORTFOLIO</span>
        <span>01 — 05</span>
      </div>
    </section>
  );
}
