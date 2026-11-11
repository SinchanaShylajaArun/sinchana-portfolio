import Image from "next/image";
import { profile, stats, experience, education } from "@/data/resume";

// Section 1: hero + about + stats
export default function Home() {
  return (
    <section id="top" className="scroll-section">
      <div className="container hero">
        <div>
          <div className="kicker">{profile.headline}</div>
          <h1>Real problems.<br />Thoughtful systems.<br />Software that helps.</h1>
          <p className="lede">{profile.intro}</p>
          <div className="ctas">
            <a className="btn" href="#projects">Explore my work</a>
            <a className="btn ghost" href="#ask">Ask about me</a>
          </div>
        </div>
        <div className="photo">
          <Image src="/photo.jpg" alt={`Portrait of ${profile.name}`} fill priority sizes="(max-width: 860px) 90vw, 380px" />
        </div>
      </div>

      <div className="stripes band">
        <div className="container">
          <div className="panel about">
            <div>
              <div className="kicker">A little about me</div>
              <h2>Curious by nature, careful by habit.</h2>
            </div>
            <div>
              <p>{profile.about}</p>
              <div className="about-cols">
                <div>
                  <h4>Experience</h4>
                  <ul>{experience.slice(0, 3).map((r) => <li key={r.org}>{r.title}</li>)}</ul>
                </div>
                <div>
                  <h4>Education</h4>
                  <ul>{education.map((d) => <li key={d.degree}>{d.degree}</li>)}</ul>
                </div>
                <div>
                  <h4>Focus</h4>
                  <ul><li>RAG and LLM apps</li><li>Computer vision</li><li>Full-stack web</li></ul>
                </div>
              </div>
            </div>
          </div>
          <div className="stats">
            {stats.map((s) => (
              <div className="panel stat" key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
