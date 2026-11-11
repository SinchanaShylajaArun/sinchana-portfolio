import type { Metadata } from "next";
import { hackathons } from "@/data/resume";
import ProjectList from "@/components/ProjectList";
import ExpandCard from "@/components/ExpandCard";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <header className="container page-head">
        <div className="kicker">Selected work</div>
        <h1>Things I&apos;ve built.</h1>
        <p className="lede">Click a project to see more.</p>
      </header>

      <section className="container">
        <ProjectList />
      </section>

      <section className="stripes band" style={{ marginTop: 56 }}>
        <div className="container">
          <div className="panel panel-title">
            <h2>Built in a weekend</h2>
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
      </section>
    </>
  );
}
