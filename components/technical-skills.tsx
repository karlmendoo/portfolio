import { github } from "@/lib/content";
const groups = [
  { label: "Programming language", items: ["Java"], mark: "{ }" },
  { label: "Web technologies", items: ["HTML", "CSS"], mark: "</>" },
  { label: "Database", items: ["MongoDB"], mark: "[ ]" },
  { label: "Tools & environment", items: ["Docker", "Linux"], mark: "$_" },
];
export function TechnicalSkills() {
  return <section id="skills" className="technical section" aria-labelledby="skills-heading">
    <div className="section-label"><span>02 / TECHNICAL INDEX</span><span className="label-line" /><span>THE TOOLKIT</span></div>
    <div className="technical-intro"><h2 id="skills-heading">Behind<br /><em>the thinking.</em></h2><p>Languages, technologies, and tools<br />that are part of my practice.</p></div>
    <div className="technical-list">{groups.map((group, index) => <article className="technical-row" key={group.label} data-cursor="EXPLORE">
      <span className="technical-index mono">0{index + 1}</span>
      <div><span className="technical-category mono">{group.label}</span><h3>{group.items.map((item, i) => <span key={item}>{i > 0 && <span className="skill-divider" aria-hidden="true"> / </span>}{item}</span>)}</h3></div>
      <span className="technical-mark" aria-hidden="true">{group.mark}</span>
    </article>)}</div>
    <div className="technical-foot"><span className="mono">CODE, IN CONTEXT.</span><a className="text-link" href={github} target="_blank" rel="noopener noreferrer" data-cursor="GITHUB">Visit my GitHub <span className="link-plus" aria-hidden="true">+</span></a></div>
  </section>;
}
