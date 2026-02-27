import HydrationGauge from "./HydrationGauge";

export default function ResultCard({ result, onAskChatbot, onSave }) {
  const { hydrationPercent, status, level, moistureLevel, skinType, confidence, tips } = result;
  const colMap = { good: "var(--good)", moderate: "var(--moderate)", low: "var(--low)" };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-xl)", overflow: "hidden", animation: "slideUp 0.5s ease" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border)", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700 }}>Analysis Complete</span>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Today · {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
        {/* Gauge column */}
        <div style={{ padding: "2.5rem 2rem", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", background: "linear-gradient(180deg,var(--surface) 0%,var(--surface2) 100%)" }}>
          <HydrationGauge percent={hydrationPercent} level={level} size={190} />
          <span style={{ padding: "5px 18px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: `${colMap[level]}18`, color: colMap[level], border: `1px solid ${colMap[level]}40` }}>{status}</span>
        </div>

        {/* Details column */}
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Meta stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[["Moisture", moistureLevel, colMap[level]], ["Skin Type", skinType, "var(--teal)"], ["Confidence", `${confidence}%`, "var(--teal)"]].map(([k, v, c]) => (
              <div key={k} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: c, marginBottom: "0.25rem" }}>{v}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Recommendations</div>
            {tips.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", fontSize: "0.9rem", lineHeight: 1.5 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", fontSize: "0.6rem", flexShrink: 0, marginTop: 1 }}>✓</div>
                <span>{t}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={onAskChatbot}
              style={{ padding: "11px 22px", borderRadius: "var(--radius)", background: "var(--grad1)", border: "none", color: "#05080f", fontWeight: 800, fontSize: "0.9rem", boxShadow: "0 0 24px var(--teal-glow)", transition: "all 0.2s" }}
              onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform = "none"}
            >◈ Ask AI Expert</button>
            {onSave && (
              <button
                onClick={onSave}
                style={{ padding: "11px 22px", borderRadius: "var(--radius)", background: "var(--surface3)", border: "1px solid var(--border2)", color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = "var(--teal)"; e.target.style.color = "var(--teal)"; }}
                onMouseLeave={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.color = "var(--text)"; }}
              >▤ Save to History</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
