"use client";
// The form has no server yet, so "Send" opens the visitor's email app
// with the message already filled in, addressed to you.

import { useState } from "react";
import { profile } from "@/data/resume";

export default function ContactForm() {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !message) {
      setError("Add your name and a message first.");
      return;
    }
    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${data.get("email") ?? ""})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} onChange={() => setError("")}>
      <label className="field"><span>Name</span><input className="input" name="name" placeholder="Jane Doe" /></label>
      <label className="field"><span>Email</span><input className="input" name="email" type="email" placeholder="jane@company.com" /></label>
      <label className="field"><span>Message</span><textarea className="input" name="message" placeholder="Hi Sinchana, I'd love to talk about…" /></label>
      {error && <p style={{ color: "#a33", margin: "0 0 12px", fontSize: 14 }}>{error}</p>}
      <button className="btn" type="submit">Send message</button>
    </form>
  );
}
