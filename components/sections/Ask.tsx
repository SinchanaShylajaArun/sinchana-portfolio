import Chat from "@/components/Chat";

// Section 4: the RAG assistant
export default function Ask() {
  return (
    <section id="ask" className="scroll-section">
      <header className="container section-head">
        <div className="kicker">Ask about my work</div>
        <h2 className="section-title">Have a question? Ask.</h2>
        <p className="lede">An AI assistant that answers from my résumé and shows its sources.</p>
      </header>

      <div className="container">
        <Chat />
      </div>

      <div className="stripes band" style={{ marginTop: 56 }}>
        <div className="container">
          <div className="panel panel-title"><h3 className="panel-heading">How it works</h3></div>
          <div className="how">
            <div className="panel"><b>01</b><h4>Chunk</h4><p>My résumé is split into small passages, one per project or role.</p></div>
            <div className="panel"><b>02</b><h4>Retrieve</h4><p>Your question is matched against every passage to find the best few.</p></div>
            <div className="panel"><b>03</b><h4>Generate</h4><p>An LLM answers using only those passages and cites them.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
