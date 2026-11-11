import Image from "next/image";
import { profile } from "@/data/resume";

// Section 1: the landing hero (headline, two intro lines, photo)
export default function Home() {
  return (
    <section id="top" className="scroll-section">
      <div className="container hero">
        <div>
          <div className="kicker">{profile.headline}</div>
          <h1>Real problems.<br />Thoughtful systems.<br />Software that helps.</h1>
          <p className="lede hero-intro">{profile.intro}</p>
          <div className="ctas">
            <a className="btn" href="#projects">Explore my work</a>
            <a className="btn ghost" href="#ask">Ask about me</a>
          </div>
        </div>
        <div className="photo">
          <Image src="/photo.jpg" alt={`Portrait of ${profile.name}`} fill priority sizes="(max-width: 860px) 90vw, 380px" />
        </div>
      </div>
    </section>
  );
}
