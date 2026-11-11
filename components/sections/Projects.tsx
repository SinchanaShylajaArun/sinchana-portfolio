import { hackathons } from "@/data/resume";
import ProjectList from "@/components/ProjectList";
import ExpandCard from "@/components/ExpandCard";

// Section 2: projects (filterable, expandable) + hackathons
export default function Projects() {
  return (
    <section id="projects" className="scroll-section">
      <header className="container section-head">
        <div className="kicker">Selected work</div>
        <h2 className="section-title">Things I&apos;ve built.</h2>
        <p className="lede">Click a project to see more.</p>
      </header>

      <div className="container">
        <ProjectList />
      </div>

      <div className="stripes band" style={{ marginTop: 56 }}>
        <div className="container">
          <div className="panel panel-title">
            <h3 className="panel-heading">Built in a weekend</h3>
            <div className="kicker" style={{ marginTop: 6 }}>Hackathons</div>
          </div>
          <div className="grid-3">
            {hackathons.map((h) => (
              <ExpandCard
                key={h.slug}
                title={h.title}
                subtitle={h.event}
                award={h.award}
                summary={h.summary}
                bullets={h.bullets}
                links={h.links}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
