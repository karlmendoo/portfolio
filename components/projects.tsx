const projects = [
  {
    name: "McGPT",
    repo: "https://github.com/karlmendoo/mc-gpt",
    kind: "MINECRAFT PAPER PLUGIN",
    headline: "A conversation,\ninside the game.",
    description:
      "A Minecraft Paper plugin that connects in-game chat to Google Gemini. Players can ask questions through a chat trigger or the /ai command, with configurable responses and cooldowns.",
    technologies: ["Java", "Paper", "Gemini API"],
    detail: "Chat commands · Optional chat context · Per-player cooldowns",
    className: "mcgpt",
    art: "!ai",
    annotation: "CHAT × INTELLIGENCE",
  },
  {
    name: "SpotiCraft",
    repo: "https://github.com/karlmendoo/spoticraft",
    kind: "MINECRAFT FABRIC MOD",
    headline: "Your soundtrack.\nYour world.",
    description:
      "A Fabric mod that brings YouTube audio playback into Minecraft. Connect a Google account, browse playlists and liked videos, and control in-game playback powered by LavaPlayer.",
    technologies: ["Java", "Fabric", "YouTube API", "LavaPlayer"],
    detail: "Google OAuth · Playlist browsing · In-game playback controls",
    className: "spoticraft",
    art: "SC",
    annotation: "SOUND × PLAY",
  },
];

export function Projects() {
  return (
    <section id="work" className="work" aria-labelledby="work-heading">
      <div className="work-intro section">
        <div className="section-label">
          <span>03 / SELECTED WORK</span>
          <span className="label-line" />
          <span>EXPLORE THE SOURCE</span>
        </div>
        <h2 id="work-heading">
          Side projects.
          <br />
          <em>Real curiosity.</em>
        </h2>
        <p>
          Two explorations at the intersection
          <br />
          of code and the worlds I enjoy.
        </p>
      </div>
      {projects.map((project, index) => (
        <article
          key={project.name}
          className={`project-panel ${project.className}`}
          aria-labelledby={`project-${index}`}
        >
          <div className="project-art" aria-hidden="true">
            <div className="project-art-top mono">
              <span>EXPLORATION / 0{index + 1}</span>
              <span>{project.annotation}</span>
            </div>
            <div className="project-art-word">{project.art}</div>
            <div className="project-art-grid" />
            <div className="project-art-bottom mono">
              <span>{project.kind}</span>
              <span>BY NKM</span>
            </div>
          </div>
          <div className="project-copy">
            <div className="project-heading">
              <span className="mono project-number">0{index + 1} /</span>
              <h3 id={`project-${index}`}>{project.name}</h3>
              <a
                className="project-source text-link"
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="SOURCE"
                aria-label={`${project.name} source on GitHub (opens in a new tab)`}
              >
                Source code{" "}
                <span className="link-plus" aria-hidden="true">
                  +
                </span>
              </a>
            </div>
            <div className="project-details">
              <p className="project-statement">
                {project.headline.split("\n").map((line, i) => (
                  <span key={line}>{i === 1 ? <em>{line}</em> : line}</span>
                ))}
              </p>
              <div>
                <p className="project-description">{project.description}</p>
                <ul
                  className="project-technologies"
                  aria-label={`${project.name} technologies`}
                >
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <p className="project-detail mono">{project.detail}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
