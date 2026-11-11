import { experience, education, leadership, skills, type Role } from "@/data/resume";

function Entry({ when, title, org, bullets }: { when: string; title: string; org: string; bullets: string[] }) {
  return (
    <div className="entry">
      <div className="when">{when}</div>
      <div>
        <h4 className="entry-title">{title}</h4>
        <div className="org">{org}</div>
        <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      </div>
    </div>
  );
}

const roleEntry = (r: Role) => <Entry key={r.title + r.org} {...r} />;

// Section 3: work, education, leadership, skills
export default function Experience() {
  return (
    <section id="experience" className="scroll-section">
      <header className="container section-head">
        <div className="kicker">Experience and education</div>
        <h2 className="section-title">Where I&apos;ve been.</h2>
        {/* Add your PDF as /public/resume.pdf and this link works */}
        <div className="ctas"><a className="btn" href="/resume.pdf" download>Download résumé (PDF)</a></div>
      </header>

      <div className="container timeline">
        <h3 className="timeline-heading">Work</h3>
        {experience.map(roleEntry)}

        <h3 className="timeline-heading">Education</h3>
        {education.map((d) => (
          <Entry
            key={d.degree}
            when={d.when}
            title={d.degree}
            org={`${d.school} · GPA ${d.gpa}`}
            bullets={[`Coursework: ${d.coursework.join(", ")}.`]}
          />
        ))}

        <h3 className="timeline-heading">Leadership</h3>
        {leadership.map(roleEntry)}
      </div>

      <div className="stripes band" style={{ marginTop: 56 }}>
        <div className="container">
          <div className="panel panel-title"><h3 className="panel-heading">Skills</h3></div>
          <div className="skill-grid">
            {skills.map((s) => (
              <div className="panel" key={s.group}>
                <h4>{s.group}</h4>
                <p>{s.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
