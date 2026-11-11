"use client";
// Sticky nav for the single-page site. Links jump to sections (#projects…),
// and an IntersectionObserver watches which section is on screen so the
// matching link is underlined as you scroll ("scroll spy").

import { useEffect, useState } from "react";
import { profile } from "@/data/resume";

const links = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "ask", label: "Ask" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = ["top", ...links.map((l) => l.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // A section counts as "current" when it crosses a thin line 30% down the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -69% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect(); // clean up when the component goes away
  }, []);

  // Opening a link like /#experience: the browser jumps before the fonts load,
  // then the text above grows and pushes the section down. Re-scroll once
  // fonts are ready so the visitor lands exactly on the section.
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (!target) return;
    document.fonts.ready.then(() => target.scrollIntoView({ behavior: "instant" }));
  }, []);

  return (
    <header className="nav-bar">
      <nav className="nav">
        <a href="#top" className="logo">{profile.name}</a>
        <div className="nav-links">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "active" : ""}
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
