import { currently } from "@/lib/personal-details";

export function Currently() {
  return (
    <aside className="currently" aria-labelledby="currently-heading">
      <h3 id="currently-heading" className="currently-heading eyebrow">
        CURRENTLY
      </h3>
      <span className="currently-rule" aria-hidden="true" />
      <p className="currently-primary">{currently.primary}</p>
      <p className="currently-secondary">{currently.secondary}</p>
      <p className="currently-availability mono">
        <span className="currently-dot" aria-hidden="true" />
        {currently.availability}
      </p>
    </aside>
  );
}
