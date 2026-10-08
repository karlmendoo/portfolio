import { assetPath } from "@/lib/paths";
export function Education() {
  return (
    <section
      id="education"
      className="education section"
      aria-labelledby="education-heading"
    >
      <div className="section-label">
        <span>06 / EDUCATION & LEARNING</span>
        <span className="label-line" />
      </div>
      <div className="education-title">
        <h2 id="education-heading">
          Always
          <br />
          <em>a student.</em>
        </h2>
        <span className="education-mark" aria-hidden="true">
          &
        </span>
      </div>
      <div className="education-list">
        <article className="education-row">
          <span className="education-kind">UNIVERSITY</span>
          <div>
            <h3>University of Santo Tomas</h3>
            <p>
              Bachelor of Science in Computer Science
              <br />
              <span>Major in Data Science</span>
            </p>
          </div>
          <span className="education-date">Aug 2025 — Present</span>
        </article>
        <article className="education-row">
          <span className="education-kind">SENIOR HIGH SCHOOL</span>
          <div>
            <h3>Notre Dame of Greater Manila</h3>
            <p>
              Science, Technology, Engineering
              <br />
              and Mathematics Strand
            </p>
          </div>
          <span className="education-date">2023 — 2025</span>
        </article>
        <article className="education-row workshop">
          <span className="education-kind">SEMINAR / WORKSHOP</span>
          <div>
            <h3>BayLayn 2024</h3>
            <p>DLSU</p>
          </div>
          <span className="education-date">2024</span>
        </article>
      </div>
      <div className="resume-row">
        <p>For the full picture.</p>
        <a className="text-link" href={assetPath("/normand-karol-mendoza-cv.pdf")} download>
          Download my CV{" "}
          <span className="download-icon" aria-hidden="true">
            +
          </span>
        </a>
      </div>
    </section>
  );
}
