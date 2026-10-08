// One accessible phrase; the visual characters animate independently.
export function SplitText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`split-text ${className}`} aria-label={text}>
      <span aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <span className="split-char" key={index}>
            {character === " " ? "\u00a0" : character}
          </span>
        ))}
      </span>
    </span>
  );
}
