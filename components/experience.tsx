import { experience } from "@/lib/content";
export function Experience() {
  return (
    <section
      id="experience"
      className="experience section"
      aria-labelledby="experience-heading"
    >
      <div className="section-label">
        <span>02 / EXPERIENCE</span>
        <span className="label-line" />
        <span>2023 — PRESENT</span>
      </div>
      <div className="experience-heading">
        <h2 id="experience-heading">
          Learning
          <br />
          by <em>doing.</em>
        </h2>
        <p>
          From the newsroom to student organizations
          <br className="desktop-break" /> and backend AI. Different settings.
          <br className="desktop-break" /> The same care for the work.
        </p>
      </div>
      <div className="experience-layout">
        <aside className="experience-aside">
          <span className="eyebrow">A CONTINUOUS THREAD</span>
          <p>
            Technology.
            <br />
            People.
            <br />
            <em>Possibility.</em>
          </p>
          <div className="timeline-rail" aria-hidden="true">
            <span />
          </div>
          <span className="aside-note">
            A growing perspective,
            <br />
            one experience at a time.
          </span>
        </aside>
        <div className="experience-list">
          {experience.map((item, index) => (
            <article
              key={`${item.organization}-${item.role}`}
              className={`experience-row${index === 0 ? " featured" : ""}`}
            >
              <div className="experience-meta">
                <span className="experience-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.date}</span>
                {item.current && <span className="current-label">CURRENT</span>}
              </div>
              <div className="experience-content">
                <span className="discipline">{item.discipline}</span>
                <h3>{item.organization}</h3>
                <p className="role">{item.role}</p>
                <p className="experience-description">{item.description}</p>
                <span className="experience-context">{item.context}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="experience-end" aria-hidden="true">
        <span>THOUGHTFUL WORK</span>
        <span>SHARED PURPOSE</span>
      </div>
    </section>
  );
}
