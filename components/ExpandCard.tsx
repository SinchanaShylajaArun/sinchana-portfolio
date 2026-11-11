import type { Link } from "@/data/resume";

// One card that opens in place. It's built on the HTML <details> element:
// clicking the <summary> opens/closes it, with no JavaScript needed.
// Used for both projects and hackathons.

type Props = {
  title: string;
  subtitle: string; // year or event
  summary: string;
  bullets: string[];
  links: Link[];
  tags?: string[];
  award?: string;
  defaultOpen?: boolean;
};

export default function ExpandCard({ title, subtitle, summary, bullets, links, tags, award, defaultOpen }: Props) {
  return (
    <details className="card" open={defaultOpen}>
      <summary>
        <div className="card-top">
          <div>
            <h3>{title}</h3>
            <div className="year">{subtitle}</div>
          </div>
          <span className="toggle" aria-hidden>+</span>
        </div>
        {award && <span className="award">{award}</span>}
        <p>{summary}</p>
        {tags && (
          <div className="tags">{tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        )}
      </summary>
      <div className="card-more">
        <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
        {links.map((l) => (
          <a key={l.href + l.label} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
        ))}
      </div>
    </details>
  );
}
