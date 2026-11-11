// =============================================================================
// RAG step 1 of 3: CHUNKING
//
// We turn the structured resume data into small, self-contained passages
// ("chunks"). Later, retrieval picks the few chunks most relevant to a
// question, and only those are sent to the AI.
//
// Two rules make a good chunk:
//   1. ONE TOPIC: one project, one job, one degree. If a chunk mixes topics,
//      a question about one of them drags in noise from the others.
//   2. SELF-CONTAINED: it must make sense on its own. "Built a leaderboard"
//      is useless out of context; "Sinchana's internship at 361Firm: built a
//      leaderboard…" is not. So every chunk names who, what, and when.
// =============================================================================

import {
  profile,
  projects,
  hackathons,
  experience,
  education,
  leadership,
  skills,
} from "@/data/resume";

export type Chunk = {
  id: string; // unique, stable id, e.g. "project:docupilot"
  title: string; // short label shown as a source under answers
  section: "Profile" | "Project" | "Hackathon" | "Experience" | "Education" | "Leadership" | "Skills";
  href: string; // which page of the site this fact lives on
  text: string; // the passage itself: what gets searched and sent to the AI
};

const sentence = (parts: string[]) => parts.join(" ");

export function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];

  // About and contact details
  chunks.push({
    id: "profile",
    title: "About Sinchana",
    section: "Profile",
    href: "/",
    text: sentence([
      `${profile.fullName} (${profile.name}) is based in ${profile.location}.`,
      // profile.about is written as "I'm…" for the Home page; a chunk must be
      // unambiguous out of context, so this one says who explicitly.
      "She is an M.S. Computer Science student at Rutgers University and a part-time lecturer for Discrete Structures and Algorithms.",
      "She likes owning the whole stack: the data pipeline, the model, the API, and the interface people actually use.",
      `She is ${profile.openTo.charAt(0).toLowerCase()}${profile.openTo.slice(1)}`,
      `Contact: email ${profile.email}, LinkedIn ${profile.linkedin}, GitHub ${profile.github}.`,
    ]),
  });

  // One chunk per project
  for (const p of projects) {
    chunks.push({
      id: `project:${p.slug}`,
      title: p.title,
      section: "Project",
      href: "/projects",
      text: sentence([
        `Project: ${p.title} (${p.year}).`,
        p.summary,
        ...p.bullets,
        `Tech stack: ${p.tags.join(", ")}.`,
        `Areas: ${p.categories.join(", ")}.`,
      ]),
    });
  }

  // One chunk per hackathon
  for (const h of hackathons) {
    chunks.push({
      id: `hackathon:${h.slug}`,
      title: `${h.title} (${h.event})`,
      section: "Hackathon",
      href: "/projects",
      text: sentence([
        `Hackathon project: ${h.title}, built at ${h.event}. Result: ${h.award}.`,
        h.summary,
        ...h.bullets,
      ]),
    });
  }

  // One chunk per job
  for (const r of experience) {
    chunks.push({
      id: `experience:${r.title}:${r.org}`,
      title: `${r.title}, ${r.org.split(/[,·]/)[0].trim()}`,
      section: "Experience",
      href: "/experience",
      text: sentence([`Work experience: ${r.title} at ${r.org}, ${r.when}.`, ...r.bullets]),
    });
  }

  // One chunk per degree
  for (const d of education) {
    chunks.push({
      id: `education:${d.degree}`,
      title: `${d.degree}, ${d.school.split(",")[0]}`,
      section: "Education",
      href: "/experience",
      text: `Education: ${d.degree} at ${d.school}, ${d.when}. GPA ${d.gpa}. Coursework: ${d.coursework.join(", ")}.`,
    });
  }

  for (const r of leadership) {
    chunks.push({
      id: `leadership:${r.title}`,
      title: r.title,
      section: "Leadership",
      href: "/experience",
      text: sentence([`Leadership: ${r.title}, ${r.org}.`, ...r.bullets]),
    });
  }

  // All skills in one chunk: "what's her tech stack?" should see the whole list
  chunks.push({
    id: "skills",
    title: "Skills",
    section: "Skills",
    href: "/experience",
    text: "Technical skills. " + skills.map((s) => `${s.group}: ${s.items.join(", ")}.`).join(" "),
  });

  return chunks;
}
