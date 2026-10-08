import { expertise } from "@/lib/content";
export function Expertise() {
  return (
    <section
      id="expertise"
      className="expertise section"
      aria-labelledby="expertise-heading"
    >
      <div className="section-label">
        <span>05 / THE HUMAN SIDE</span>
        <span className="label-line" />
      </div>
      <div className="expertise-intro">
        <h2 id="expertise-heading">
          What I bring
          <br />
          <em>to the table.</em>
        </h2>
        <p>
          The human skills behind
          <br />
          the work. Built through
          <br />
          real teams and real responsibilities.
        </p>
      </div>
      <div className="expertise-list">
        {expertise.map((item, index) => (
          <details
            className="expertise-item"
            key={item.title}
            open={index === 0}
          >
            <summary>
              <span className="expertise-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <span className="expertise-subtitle">{item.subtitle}</span>
              <span className="disclosure-symbol" aria-hidden="true" />
            </summary>
            <div className="expertise-detail">
              <p>{item.description}</p>
            </div>
          </details>
        ))}
      </div>
      <div className="type-ribbon" aria-hidden="true">
        <div className="ribbon-track">
          <span>
            Clarity. <em>Care.</em> Collaboration. <em>Curiosity.</em>&nbsp;
          </span>
          <span>
            Clarity. <em>Care.</em> Collaboration. <em>Curiosity.</em>&nbsp;
          </span>
        </div>
      </div>
    </section>
  );
}
