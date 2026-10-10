import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { TechnicalSkills } from "@/components/technical-skills";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Expertise } from "@/components/expertise";
import { Education } from "@/components/education";
import { Contact } from "@/components/contact";
import { PortfolioMotion } from "@/components/motion";
import { MusicProvider } from "@/components/music-provider";
import { MusicPlayer, MiniPlayer } from "@/components/music-player";
import { getMusicTracks } from "@/lib/music-assets";
import { Currently } from "@/components/currently";

export default function Home() {
  return (
    <MusicProvider tracks={getMusicTracks()}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <section
          id="about"
          className="about section"
          aria-labelledby="about-heading"
        >
          <div className="section-label">
            <span>01 / A LITTLE CONTEXT</span>
            <span className="label-line" />
            <span>CURIOUS, BY NATURE</span>
          </div>
          <div className="about-statement">
            <span className="about-marker" aria-hidden="true">
              (nkm)
            </span>
            <h2 id="about-heading">
              I’m interested in
              <br />
              how things <em>work.</em>
              <br />
              And who they
              <br />
              <em>work for.</em>
            </h2>
          </div>
          <div className="about-bottom">
            <div className="about-aside">
              <Currently />
              <p className="about-note mono">
                TECHNOLOGY. PEOPLE.
                <br />A GROWING PERSPECTIVE.
              </p>
            </div>
            <div className="about-copy">
              <p>
                I’m Normand, a Computer Science student majoring in Data Science
                at the University of Santo Tomas, currently exploring backend AI
                engineering through my internship at FlyRank AI.
              </p>
              <p>
                My experience also lives beyond technology: leading a news
                writing team, coordinating events, and helping student
                organizations turn plans into well-run activities. Across all of
                it, I value clear communication and thoughtful collaboration.
              </p>
              <a className="text-link" href="#experience">
                Explore my experience{" "}
                <span className="link-plus" aria-hidden="true">
                  +
                </span>
              </a>
            </div>
          </div>
        </section>
        <TechnicalSkills />
        <Projects />
        <Experience />
        <Expertise />
        <Education />
        <MusicPlayer />
      </main>
      <Contact />
      <MiniPlayer />
      <PortfolioMotion />
    </MusicProvider>
  );
}
