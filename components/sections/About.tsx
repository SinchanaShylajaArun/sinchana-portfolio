import { about } from "@/data/resume";

// Section 2: a fuller introduction. Story on the right, quick facts on the left.
export default function About() {
  return (
    <section id="about" className="scroll-section stripes band">
      <div className="container">
        <div className="panel about-panel">
          <div className="about-side">
            <div className="kicker">About me</div>
            <h2 className="about-heading">{about.heading}</h2>
            <dl className="facts">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="about-story">
            {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
