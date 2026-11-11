import type { Metadata } from "next";
import { profile } from "@/data/resume";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "LinkedIn", value: "/in/sinchanasarun ↗", href: profile.linkedin },
    { label: "GitHub", value: "SinchanaShylajaArun ↗", href: profile.github },
    { label: "Location", value: profile.location },
  ];

  return (
    <>
      <header className="container page-head">
        <div className="kicker">Get in touch</div>
        <h1>Let&apos;s build something together.</h1>
        <p className="lede">{profile.openTo}</p>
      </header>

      <section className="stripes band">
        <div className="container">
          <div className="panel contact">
            <div>
              {channels.map((c) =>
                c.href ? (
                  <a key={c.label} className="channel" href={c.href} target="_blank" rel="noreferrer">
                    <span>{c.label}</span>{c.value}
                  </a>
                ) : (
                  <div key={c.label} className="channel"><span>{c.label}</span>{c.value}</div>
                ),
              )}
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
