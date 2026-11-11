import Link from "next/link";
import Image from "next/image";
import { profile, stats, experience, education } from "@/data/resume";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container hero">
        <div>
          <div className="kicker">{profile.headline}</div>
          <h1>Real problems.<br />Thoughtful systems.<br />Software that helps.</h1>
          <p className="lede">{profile.intro}</p>
          <div className="ctas">
            <Link className="btn" href="/projects">Explore my work</Link>
            <Link className="btn ghost" href="/ask">Ask about me</Link>
          </div>
        </div>
        {/* next/image resizes and compresses the photo automatically for each screen size */}
        <div className="photo">
          <Image
            src="/photo.jpg"
            alt={`Portrait of ${profile.name}`}
            fill
            priority
            sizes="(max-width: 860px) 90vw, 380px"
          />
        </div>
      </section>

      {/* About + stats on the striped band */}
      <section className="stripes band">
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
      </section>

      {/* Call to action */}
      <section className="band center">
        <div className="kicker">Ask about my work</div>
        <h2 style={{ margin: "10px 0 18px" }}>Curious? Ask the assistant.</h2>
        <Link className="btn" href="/ask">Open the assistant</Link>
      </section>
    </>
  );
}
