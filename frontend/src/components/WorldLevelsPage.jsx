const WORLD_LEVELS = [
  {
    id: "crystal-caverns",
    title: "Crystal Caverns",
    subtitle: "Beginner realm for core logic and pattern recognition.",
    difficulty: "Easy",
    boss: "Crystal Warden",
    reward: "Speed Boots",
    progress: "45%",
    features: [
      "Basic algorithm puzzles",
      "Branching challenge choices",
      "Quick win streak rewards"
    ],
    color: "#38bdf8"
  },
  {
    id: "neon-nexus",
    title: "Neon Nexus",
    subtitle: "Intermediate tests focused on arrays, strings, and loops.",
    difficulty: "Medium",
    boss: "Neon Architect",
    reward: "Logic Amplifier",
    progress: "68%",
    features: [
      "Data transformation challenges",
      "Two-step code problems",
      "Progressive region unlocks"
    ],
    color: "#7c3aed"
  },
  {
    id: "shadow-shard",
    title: "Shadow Shard",
    subtitle: "Advanced arena for recursion, graph logic, and optimizations.",
    difficulty: "Hard",
    boss: "Shadow Reaper",
    reward: "Boss Emblem",
    progress: "92%",
    features: [
      "Recursive thinking exercises",
      "Graph and tree puzzles",
      "Time-sensitive boss rounds"
    ],
    color: "#f97316"
  }
];

export default function WorldLevelsPage() {
  return (
    <div className="world-levels-page glass-panel">
      <div className="world-levels-hero">
        <div className="world-levels-icon">🌍</div>
        <div>
          <h2>World Campaign Levels</h2>
          <p>Explore coding realms designed as progressive campaign zones. Each realm contains themed challenges, reward tiers, and narrative boss encounters.</p>
        </div>
      </div>

      <div className="world-levels-grid">
        {WORLD_LEVELS.map((level) => (
          <article key={level.id} className="world-level-card" style={{ borderColor: level.color }}>
            <div className="world-level-card-header" style={{ background: `${level.color}22` }}>
              <span className="world-level-badge" style={{ background: level.color }}>
                {level.difficulty}
              </span>
              <h3>{level.title}</h3>
              <p>{level.subtitle}</p>
            </div>
            <ul className="world-level-features">
              {level.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="world-level-meta">
              <span>Boss: <strong>{level.boss}</strong></span>
              <span>Reward: <strong>{level.reward}</strong></span>
            </div>
            <div className="world-level-progress">
              <span>Completion</span>
              <div className="world-level-progress-bar">
                <div style={{ width: level.progress }} />
              </div>
            </div>
            <button className="btn btn-start world-level-start">Enter Realm</button>
          </article>
        ))}
      </div>
    </div>
  );
}
