import { assetPath } from "@/lib/paths";
import { SplitText } from "./split-text";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="hero-stage">
        <div className="hero-topline mono">
          <span>PERSONAL FIELD NOTES</span>
          <span>CALOOCAN, PHILIPPINES</span>
          <span>2026 / VOL. 01</span>
        </div>
        <div className="hero-title-wrap">
          <span className="hero-title-caption mono">
            COMPUTER SCIENCE · DATA SCIENCE · BACKEND AI
          </span>
          <h1
            id="hero-heading"
            className="hero-name"
            aria-label="Normand Karol Mendoza"
          >
            <span className="hero-name-row">
              <SplitText text="NORMAND" />
              <em className="hero-karol">Karol</em>
            </span>
            <span className="hero-name-row hero-last">
              <SplitText text="MENDOZA" />
              <span className="hero-asterisk" aria-hidden="true">
                ✳
              </span>
            </span>
          </h1>
          <div className="hero-reveal">
            <span className="mono">A WORK IN PROGRESS</span>
            <p>
              A mind for systems.
              <br />
              <em>An instinct for people.</em>
            </p>
          </div>
        </div>
        <div className="hero-bottom">
          <a className="scroll-cue mono" href="#about">
            <span className="scroll-track" aria-hidden="true">
              <span />
            </span>
            SCROLL TO EXPLORE
          </a>
          <p>
            Computer Science student at UST.
            <br />
            Backend AI intern at FlyRank AI.
          </p>
          <a
            className="text-link"
            href={assetPath("/normand-karol-mendoza-cv.pdf")}
            download
            data-cursor="CV"
          >
            Download CV{" "}
            <span className="link-plus" aria-hidden="true">
              +
            </span>
          </a>
        </div>
        <div className="hero-edge mono" aria-hidden="true">
          <span>NKM / INDEX</span>
          <span>THE NEXT CHAPTER</span>
        </div>
      </div>
    </section>
  );
}
