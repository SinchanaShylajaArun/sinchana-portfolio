import type { Metadata } from "next";
import { experience, education, leadership, skills, type Role } from "@/data/resume";

export const metadata: Metadata = { title: "Experience" };

// A small helper component, only used on this page.
function Entry({ when, title, org, bullets }: { when: string; title: string; org: string; bullets: string[] }) {
  return (
    <div className="entry">
      <div className="when">{when}</div>
      <div>
        <h3>{title}</h3>
        <div className="org">{org}</div>
        <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      </div>
    </div>
  );
}

const roleEntry = (r: Role) => <Entry key={r.title + r.org} {...r} />;

export default function ExperiencePage() {
  return (
    <>
      <header className="container page-head">
        <div className="kicker">Experience and education</div>
        <h1>Where I&apos;ve been.</h1>
        {/* Add your PDF as /public/resume.pdf and this link works */}
        <div className="ctas"><a className="btn" href="/resume.pdf" download>Download résumé (PDF)</a></div>
      </header>

      <section className="container timeline">
        <h2>Work</h2>
        {experience.map(roleEntry)}

        <h2>Education</h2>
        {education.map((d) => (
          <Entry
            key={d.degree}
            when={d.when}
            title={d.degree}
            org={`${d.school} · GPA ${d.gpa}`}
            bullets={[`Coursework: ${d.coursework.join(", ")}.`]}
          />
        ))}

        <h2>Leadership</h2>
        {leadership.map(roleEntry)}
      </section>

      <section className="stripes band" style={{ marginTop: 56 }}>
        <div className="container">
          <div className="panel panel-title"><h2>Skills</h2></div>
          <div className="skill-grid">
            {skills.map((s) => (
              <div className="panel" key={s.group}>
                <h4>{s.group}</h4>
                <p>{s.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
