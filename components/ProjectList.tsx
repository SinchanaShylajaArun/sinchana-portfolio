"use client";
// Runs in the browser because the filter buttons change what's shown (state).

import { useState } from "react";
import { projects, type Category } from "@/data/resume";
import ExpandCard from "./ExpandCard";

const filters: ("All" | Category)[] = ["All", "Full-stack", "AI / ML", "Computer vision", "Research"];

export default function ProjectList() {
  // useState remembers which filter is selected; changing it re-renders the list.
  const [active, setActive] = useState<"All" | Category>("All");

  const shown = active === "All" ? projects : projects.filter((p) => p.categories.includes(active));

  return (
    <>
      <div className="filters">
        {filters.map((f) => (
          <button key={f} className={`filter ${active === f ? "on" : ""}`} onClick={() => setActive(f)}>
            {f}
          </button>
        ))}
      </div>
      <div className="grid-2">
        {shown.map((p, i) => (
          <ExpandCard
            key={p.slug}
            title={p.title}
            subtitle={p.year}
            summary={p.summary}
            bullets={p.bullets}
            links={p.links}
            tags={p.tags}
            defaultOpen={active === "All" && i === 0}
          />
        ))}
      </div>
    </>
  );
}
