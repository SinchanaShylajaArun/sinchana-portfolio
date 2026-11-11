import { profile } from "@/data/resume";
import ContactForm from "@/components/ContactForm";

// Section 5: contact
export default function Contact() {
  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "LinkedIn", value: "/in/sinchanasarun ↗", href: profile.linkedin },
    { label: "GitHub", value: "SinchanaShylajaArun ↗", href: profile.github },
    { label: "Location", value: profile.location },
  ];

  return (
    <section id="contact" className="scroll-section">
      <header className="container section-head">
        <div className="kicker">Get in touch</div>
        <h2 className="section-title">Let&apos;s build something together.</h2>
        <p className="lede">{profile.openTo}</p>
      </header>

      <div className="stripes band">
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
      </div>
    </section>
  );
}
