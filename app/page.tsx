// The whole site is one scrolling page. Each section has an id
// (#top, #projects, #experience, #ask, #contact) that the sticky nav links to.

import Home from "@/components/sections/Home";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Ask from "@/components/sections/Ask";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <Home />
      <Projects />
      <Experience />
      <Ask />
      <Contact />
    </>
  );
}
