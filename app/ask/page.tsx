import type { Metadata } from "next";
import Chat from "@/components/Chat";

export const metadata: Metadata = { title: "Ask" };

export default function AskPage() {
  return (
    <>
      <header className="container page-head">
        <div className="kicker">Ask about my work</div>
        <h1>Have a question? Ask.</h1>
        <p className="lede">An AI assistant that answers from my résumé and shows its sources.</p>
      </header>

      <section className="container">
        <Chat />
      </section>

      <section className="stripes band" style={{ marginTop: 56 }}>
        <div className="container">
          <div className="panel panel-title"><h2>How it works</h2></div>
          <div className="how">
            <div className="panel"><b>01</b><h4>Chunk</h4><p>My résumé is split into small passages, one per project or role.</p></div>
            <div className="panel"><b>02</b><h4>Retrieve</h4><p>Your question is matched against every passage to find the best few.</p></div>
            <div className="panel"><b>03</b><h4>Generate</h4><p>An LLM answers using only those passages and cites them.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
