import { useState, useMemo } from "react";
import { STUDY_TOPICS, VAULT_CATEGORIES } from "../data/vaultTopics.js";

const ITEMS_PER_PAGE = 5;

export default function VaultPage({ onBack, player }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Active viewing state: null (list view) or active topic object
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("study"); // "study" | "personal"

  // Personal Notepad storage
  const [userNotes, setUserNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("vault_user_notes");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [saveStatus, setSaveStatus] = useState("");

  // Filter topics based on category & search query
  const filteredTopics = useMemo(() => {
    return STUDY_TOPICS.filter((t) => {
      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.explanation.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Calculate pagination boundaries
  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTopics = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredTopics.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTopics, safePage]);

  const handleCategoryChange = (catKey) => {
    setSelectedCategory(catKey);
    setCurrentPage(1);
    setActiveTopic(null);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
    setActiveTopic(null);
  };

  const handleSavePersonalNote = (topicKey, text) => {
    const updated = { ...userNotes, [topicKey]: text };
    setUserNotes(updated);
    try {
      localStorage.setItem("vault_user_notes", JSON.stringify(updated));
      setSaveStatus("✅ Personal notes saved!");
      setTimeout(() => setSaveStatus(""), 2200);
    } catch (e) {
      setSaveStatus("⚠️ Error saving notes.");
    }
  };

  const handleDeletePersonalNote = (topicKey) => {
    const updated = { ...userNotes };
    delete updated[topicKey];
    setUserNotes(updated);
    try {
      localStorage.setItem("vault_user_notes", JSON.stringify(updated));
      setSaveStatus("🗑️ Personal note deleted!");
      setTimeout(() => setSaveStatus(""), 2200);
    } catch (e) {
      setSaveStatus("⚠️ Error deleting note.");
    }
  };

  return (
    <div className="vault-page glass-panel" style={{ padding: "28px", borderRadius: 16 }}>
      {/* Top Back & Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        {onBack && (
          <button className="back-btn" onClick={onBack} style={{ padding: "10px 20px", fontSize: 13 }}>
            ← BACK
          </button>
        )}
      </div>

      {/* Hero Header */}
      <div className="vault-hero" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <span className="vault-icon" style={{ fontSize: 36 }}>📘</span>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, color: "#fff" }}>Programming Study Vault & Personal Notepad</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text-dim)" }}>
            Explore beginner-friendly study notes, syntax guides, and maintain your personal programming notebook.
          </p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="vault-selection-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {VAULT_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`vault-selection-btn ${selectedCategory === cat.key ? "active" : ""}`}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: selectedCategory === cat.key ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.03)",
              color: selectedCategory === cat.key ? "#38bdf8" : "#fff",
              border: selectedCategory === cat.key ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.2s ease"
            }}
            onClick={() => handleCategoryChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            className="auth-input"
            placeholder="🔍 Search programming topics, concepts, or syntax..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ padding: "10px 16px", fontSize: 13, margin: 0, width: "100%" }}
          />
        </div>
        {searchQuery && (
          <button className="btn btn-ghost" onClick={() => handleSearchChange("")} style={{ padding: "8px 16px", fontSize: 12 }}>
            Clear Search
          </button>
        )}
      </div>

      {/* Active Topic Detail View */}
      {activeTopic ? (
        <div className="glass-panel" style={{ padding: "24px", borderRadius: 14, border: `1px solid ${activeTopic.accent}50` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <button
              className="btn btn-ghost"
              onClick={() => setActiveTopic(null)}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              ← Back to Topic List
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className={`btn ${activeTab === "study" ? "btn-start" : "btn-ghost"}`}
                style={{ padding: "6px 14px", fontSize: 12 }}
                onClick={() => setActiveTab("study")}
              >
                📖 STUDY NOTE
              </button>
              <button
                className={`btn ${activeTab === "personal" ? "btn-start" : "btn-ghost"}`}
                style={{ padding: "6px 14px", fontSize: 12, borderColor: activeTopic.accent, color: activeTab === "personal" ? "#fff" : activeTopic.accent }}
                onClick={() => setActiveTab("personal")}
              >
                ✏️ MY PERSONAL NOTEPAD
              </button>
            </div>
          </div>

          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16, marginBottom: 20 }}>
            <span style={{ background: activeTopic.accent, color: "#000", fontWeight: 800, padding: "3px 10px", borderRadius: 6, fontSize: 11 }}>
              {activeTopic.category.toUpperCase()}
            </span>
            <h3 style={{ margin: "8px 0 4px 0", fontSize: 22, color: "#fff" }}>{activeTopic.title}</h3>
            <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 13 }}>{activeTopic.summary}</p>
          </div>

          {activeTab === "study" ? (
            <div style={{ display: "grid", gap: 20 }}>
              {/* Detailed Explanation */}
              <div className="glass-panel" style={{ padding: "18px", borderRadius: 10, background: "rgba(255,255,255,0.02)", borderLeft: `4px solid ${activeTopic.accent}` }}>
                <h4 style={{ margin: "0 0 8px 0", color: activeTopic.accent, fontSize: 15 }}>📌 Concept Explanation</h4>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>
                  {activeTopic.explanation}
                </p>
              </div>

              {/* Code / Syntax Example */}
              {activeTopic.example && (
                <div className="glass-panel" style={{ padding: "18px", borderRadius: 10, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffd700", fontSize: 14 }}>💻 Code Example</h4>
                  <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "#38bdf8", overflowX: "auto", lineHeight: 1.5 }}>
                    {activeTopic.example}
                  </pre>
                </div>
              )}

              {/* Key Takeaways */}
              {activeTopic.keyPoints && activeTopic.keyPoints.length > 0 && (
                <div className="glass-panel" style={{ padding: "18px", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#22c55e", fontSize: 14 }}>💡 Important Key Points</h4>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text-primary)", fontSize: 13, lineHeight: 1.6 }}>
                    {activeTopic.keyPoints.map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Personal Notepad Tab */
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
                  Personal Notepad for <strong>{activeTopic.title}</strong>
                </span>
                {saveStatus && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.15)", padding: "4px 10px", borderRadius: 6 }}>
                    {saveStatus}
                  </span>
                )}
              </div>

              <textarea
                className="auth-input"
                rows={10}
                placeholder={`Write your custom notes, formulas, or personal snippets for ${activeTopic.title} here...`}
                value={userNotes[activeTopic.key] || ""}
                onChange={(e) => handleSavePersonalNote(activeTopic.key, e.target.value)}
                style={{ width: "100%", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, resize: "vertical" }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleDeletePersonalNote(activeTopic.key)}
                  style={{ padding: "8px 16px", fontSize: 12, color: "#ef4444", borderColor: "#ef4444" }}
                  disabled={!userNotes[activeTopic.key]}
                >
                  🗑️ Clear Note
                </button>

                <button
                  className="btn btn-start"
                  onClick={() => handleSavePersonalNote(activeTopic.key, userNotes[activeTopic.key] || "")}
                  style={{ padding: "8px 20px", fontSize: 12 }}
                >
                  💾 Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Topic List View (Paginated to 5 items) */
        <div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>
            Showing <strong>{paginatedTopics.length}</strong> of <strong>{filteredTopics.length}</strong> available study topics
          </div>

          <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
            {paginatedTopics.length === 0 ? (
              <div className="glass-panel" style={{ padding: 30, textAlign: "center", color: "var(--text-dim)" }}>
                No study topics found matching your criteria. Try changing categories or clearing search.
              </div>
            ) : (
              paginatedTopics.map((topic, idx) => {
                const globalIndex = (safePage - 1) * ITEMS_PER_PAGE + idx + 1;
                const hasPersonalNote = !!userNotes[topic.key];

                return (
                  <div
                    key={topic.key}
                    className="glass-panel"
                    style={{
                      padding: "18px 22px",
                      borderRadius: 12,
                      borderLeft: `4px solid ${topic.accent}`,
                      background: "rgba(255,255,255,0.02)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => {
                      setActiveTopic(topic);
                      setActiveTab("study");
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, color: topic.accent, fontSize: 13 }}>
                          #{globalIndex}
                        </span>
                        <h4 style={{ margin: 0, fontSize: 16, color: "#fff" }}>{topic.title}</h4>
                        {hasPersonalNote && (
                          <span style={{ fontSize: 10, background: "rgba(255,215,0,0.2)", color: "#ffd700", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                            📝 Note Saved
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.4 }}>
                        {topic.summary}
                      </p>
                    </div>

                    <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 12, whiteSpace: "nowrap" }}>
                      Read Note →
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* REQUIRED PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div
              className="vault-pagination"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "16px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <button
                className="btn btn-ghost"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{ padding: "8px 20px", fontSize: 13, opacity: safePage <= 1 ? 0.4 : 1 }}
              >
                ← PREVIOUS
              </button>

              <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>
                PAGE {safePage} / {totalPages}
              </span>

              <button
                className="btn btn-ghost"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{ padding: "8px 20px", fontSize: 13, opacity: safePage >= totalPages ? 0.4 : 1 }}
              >
                NEXT →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
