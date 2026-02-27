import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import ImageUploader from "../components/ImageUploader";
import ResultCard from "../components/ResultCard";
import ResultSkeleton from "../components/ResultSkeleton";
import ChatbotPanel from "../components/ChatbotPanel";
import generateResult from "../utils/generateResult";

function StepHeader({ num, label, title, desc, active }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: active ? "var(--teal)" : "var(--text-muted)", marginBottom: "0.6rem", transition: "color 0.3s" }}>
        <div style={{ width: 20, height: 20, background: active ? "var(--teal-dim)" : "var(--surface2)", border: `1px solid ${active ? "rgba(45,212,191,0.3)" : "var(--border)"}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, transition: "all 0.3s" }}>{num}</div>
        {label}
      </div>
      <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "0.5rem", lineHeight: 1.1, color: active ? "var(--text)" : "var(--text-muted)", transition: "color 0.3s" }}>{title}</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 480 }}>{desc}</p>
    </div>
  );
}

export default function AnalyzePage() {
  const { setAnalysisResult, setAnalysisImage } = useApp();
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const chatRef = useRef(null);
  const prefillRef = useRef(null);

  const handleImageSelect = (img) => {
    setImage(img);
    setResult(null);
  };

  const doAnalyze = () => {
    if (!image || analyzing) return;
    setResult(null);
    setAnalyzing(true);
    setTimeout(() => {
      const r = generateResult();
      setResult(r);
      setAnalysisResult(r);
      setAnalysisImage(image);
      setAnalyzing(false);
    }, 3000);
  };

  const askChatbot = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
    if (result && prefillRef.current) {
      setTimeout(() => prefillRef.current(`My analysis shows ${result.hydrationPercent}% hydration (${result.status}). Moisture: ${result.moistureLevel}, Skin: ${result.skinType}. Please give a detailed explanation and personalized skincare routine.`), 700);
    }
  };

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem", display: "flex", flexDirection: "column", gap: "4rem" }}>

        {/* Steps 1 & 2 side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }} className="main-az-grid">

          {/* Step 1: Upload */}
          <section>
            <StepHeader num="1" label="Upload" title="Take or Upload a Selfie" desc="Use a clear, front-facing photo with good natural lighting for the most accurate hydration analysis." active={true} />
            <ImageUploader onImageSelect={handleImageSelect} image={image} scanning={analyzing} />

            {/* Photo tips */}
            <div style={{ marginTop: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.9rem" }}>📸 Photo Tips</div>
              {[["💡", "Good lighting", "Natural daylight, no harsh shadows."], ["🧖", "Clean face", "Remove makeup and glasses."], ["📐", "Face forward", "Full face visible, direct camera angle."], ["🚫", "No filters", "Raw camera only — no beauty modes."]].map(([ic, t, d]) => (
                <div key={t} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.6rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{ic}</span>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}><strong style={{ color: "var(--text)" }}>{t}</strong> — {d}</div>
                </div>
              ))}
            </div>

            {/* Analyze button */}
            {image && (
              <div style={{ marginTop: "1.25rem" }}>
                <button
                  onClick={doAnalyze}
                  disabled={analyzing}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "14px 32px", background: analyzing ? "var(--surface3)" : "var(--grad1)", border: analyzing ? "1px solid var(--border2)" : "none", borderRadius: "var(--radius)", color: analyzing ? "var(--text-muted)" : "#05080f", fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: "1rem", cursor: analyzing ? "wait" : "pointer", boxShadow: analyzing ? "none" : "0 0 32px var(--teal-glow)", transition: "all 0.25s", opacity: analyzing ? 0.8 : 1 }}
                  onMouseEnter={e => { if (!analyzing) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                >
                  {analyzing
                    ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(200,200,200,0.2)", borderTopColor: "var(--teal)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Analyzing Skin...</>
                    : <>✦ {result ? "Re-Analyze" : "Analyze Hydration"}</>}
                </button>
                {result && !analyzing && (
                  <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--good)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>✓</span> Analysis complete — upload a new photo to re-analyze
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Step 2: Results */}
          <section>
            <StepHeader num="2" label="Results" title="Your Hydration Report" desc="Your skin hydration score, moisture level, and personalized recommendations will appear here." active={!!result || analyzing} />

            {analyzing ? (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border)", background: "var(--surface2)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid var(--teal)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Analyzing your skin...</span>
                </div>
                <div style={{ padding: "2.5rem", textAlign: "center" }}>
                  <div style={{ position: "relative", width: 190, height: 190, margin: "0 auto 1.5rem" }}>
                    <svg width="190" height="190" viewBox="0 0 190 190">
                      <circle cx="95" cy="95" r="79" fill="none" stroke="var(--surface3)" strokeWidth="12" />
                      <circle cx="95" cy="95" r="79" fill="none" stroke="var(--teal)" strokeWidth="12"
                        strokeDasharray="496" strokeDashoffset="124"
                        strokeLinecap="round" transform="rotate(-90 95 95)"
                        style={{ animation: "spin 2s linear infinite", transformOrigin: "95px 95px", filter: "drop-shadow(0 0 8px rgba(45,212,191,0.6))" }}
                      />
                      <text x="95" y="88" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="14" fontFamily="Outfit,sans-serif" fontWeight="500">Reading</text>
                      <text x="95" y="108" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="12" fontFamily="Outfit,sans-serif">skin data...</text>
                    </svg>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 280, margin: "0 auto" }}>
                    Our AI is analyzing 14 skin biomarkers from your photo. This takes about 3 seconds.
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.25rem" }}>
                    {["Surface texture", "Light reflection", "Moisture markers"].map((s, i) => (
                      <span key={i} style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 100, background: "var(--teal-dim)", color: "var(--teal)", border: "1px solid rgba(45,212,191,0.2)", animation: `pulseGlow 1.5s ${i * 0.3}s infinite` }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : result ? (
              <div style={{ animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                <ResultCard result={result} onAskChatbot={askChatbot} onSave={null} />
              </div>
            ) : (
              <ResultSkeleton />
            )}
          </section>
        </div>
        <style>{`@media(max-width:900px){.main-az-grid{grid-template-columns:1fr!important;}}`}</style>

        {/* Step 3: Chatbot */}
        <section ref={chatRef} style={{ borderTop: "1px solid var(--border)", paddingTop: "4rem" }}>
          <StepHeader num="3" label="Expert Chat" title="Ask the AI Skin Expert" desc="Get personalized advice, product recommendations, and deep explanations from our Claude-powered dermatology AI." active={true} />
          <ChatbotPanel hydrationResult={result} prefillRef={prefillRef} />
        </section>

      </div>
    </div>
  );
}
