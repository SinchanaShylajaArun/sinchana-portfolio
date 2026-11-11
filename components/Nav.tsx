"use client";
// "use client" = this component runs in the browser, because it needs to know
// which page you're on (usePathname) to underline the active link.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/resume";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/ask", label: "Ask" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname(); // e.g. "/projects"

  return (
    <header className="nav-bar">
      <nav className="nav">
        <Link href="/" className="logo">{profile.name}</Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
