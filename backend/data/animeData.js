// Original Cyberpunk Playable Character System & ELO Tier Definitions

export const animeHeroes = [
  {
    id: "kairo",
    name: "KAIRO",
    title: "The Speed Coder",
    rank: "S-Class",
    level: 25,
    specialty: "High-Frequency Algorithms & Speed Typing",
    color: "#FF7A00",
    glow: "#FFB347",
    emoji: "⚡",
    portrait: "/avatars/kairo.png",
    stats: { speed: 98, power: 85, defense: 72, intellect: 90 },
    passive: "Overclock: +15% damage bonus on answers under 3.5 seconds.",
    ability: "Time Dilation: Adds +3 seconds bonus time to the match clock.",
    ultimate: "Quantum Burst: Next correct answer deals 1.5x critical damage.",
    description: "A legendary street netrunner from Neo-Tokyo who types code faster than neural synapses can fire.",
    dialogue: {
      matchStart: "Let's see how fast you really code.",
      correct: "Too easy.",
      wrong: "Tch, just a minor glitch.",
      combo: "Now we're talking!",
      crit: "OVERDRIVE!",
      lowHp: "System overheating... push it to the limit!",
      enemyLowHp: "You're out of memory, opponent!",
      victory: "Another battle. Another win.",
      defeat: "Defeated... time to refactor my strategy."
    }
  },
  {
    id: "nyx",
    name: "NYX",
    title: "The Digital Phantom",
    rank: "S-Class",
    level: 28,
    specialty: "Encryption, Obfuscation & Stealth Logic",
    color: "#7C3AED",
    glow: "#A78BFA",
    emoji: "🔮",
    portrait: "/avatars/nyx.png",
    stats: { speed: 88, power: 92, defense: 80, intellect: 96 },
    passive: "Shadow Mask: Reduces self-damage from wrong answers by 50%.",
    ability: "Decrypt: Eliminates 1 incorrect multiple-choice option automatically.",
    ultimate: "System Override: Instantly bypasses and solves the current challenge.",
    description: "An enigmatic rogue arch-hacker who manipulates data streams from the dark web shadows.",
    dialogue: {
      matchStart: "You can't patch what you can't see.",
      correct: "Clean extraction.",
      wrong: "Misdirection... as intended.",
      combo: "Fading deeper into the net...",
      crit: "SHADOW STRIKE!",
      lowHp: "Shields compromised... cloaking!",
      enemyLowHp: "Your firewall is crumbling.",
      victory: "Target erased. Leaving zero traces.",
      defeat: "Signal lost... reconnecting from dark node."
    }
  },
  {
    id: "raizen",
    name: "RAIZEN",
    title: "The Code Warrior",
    rank: "A-Class",
    level: 22,
    specialty: "Low-Level Systems & C++ Compiler Optimization",
    color: "#EF4444",
    glow: "#FCA5A5",
    emoji: "⚔️",
    portrait: "/avatars/raizen.png",
    stats: { speed: 80, power: 96, defense: 90, intellect: 84 },
    passive: "Iron Buffer: Grants +15 bonus starting HP at match start.",
    ability: "Memory Flush: Restores +10 HP on a correct answer.",
    ultimate: "Core Strike: Executes a massive 30-damage strike against the opponent.",
    description: "A battle-hardened cybernetic mercenary who crafts brute-force algorithms in pure assembly.",
    dialogue: {
      matchStart: "Prepare for brute-force execution!",
      correct: "Direct hit to core memory!",
      wrong: "A minor scratch on my armor!",
      combo: "Unstoppable momentum!",
      crit: "COMPILER EXECUTION!",
      lowHp: "Armor breach! Fight harder!",
      enemyLowHp: "Target is weak! Finish them!",
      victory: "Victory belongs to the strongest compiler!",
      defeat: "Core shutdown... I will rebuild!"
    }
  },
  {
    id: "astra",
    name: "ASTRA",
    title: "The Quantum Strategist",
    rank: "S-Class",
    level: 30,
    specialty: "Complex Data Structures & Graph Traversal",
    color: "#00E5FF",
    glow: "#67E8F9",
    emoji: "👁️",
    portrait: "/avatars/astra.png",
    stats: { speed: 90, power: 88, defense: 85, intellect: 99 },
    passive: "Predictive Matrix: Highlights recommended option path.",
    ability: "Logic Barrier: Completely blocks the next incoming opponent attack.",
    ultimate: "Singularity: Doubles all arena coins and XP earned from this match.",
    description: "A brilliant AI researcher who calculates future game states before the opponent even types a character.",
    dialogue: {
      matchStart: "I've already simulated 10,000 outcomes.",
      correct: "Calculated outcome.",
      wrong: "An unexpected variance.",
      combo: "The pattern converges!",
      crit: "SINGULARITY EVENT!",
      lowHp: "Probability dropping... recalculating!",
      enemyLowHp: "Your defeat was mathematically certain.",
      victory: "Checkmate. A perfect algorithm.",
      defeat: "Calculation error... recalibrating matrix."
    }
  },
  {
    id: "viper",
    name: "VIPER",
    title: "The Cyber Assassin",
    rank: "A-Class",
    level: 24,
    specialty: "Dynamic Programming & Memory Exploits",
    color: "#22C55E",
    glow: "#86EFAC",
    emoji: "🐍",
    portrait: "/avatars/viper.png",
    stats: { speed: 94, power: 90, defense: 70, intellect: 88 },
    passive: "Poisoned Pointer: Inflicts 2 damage over time on every correct strike.",
    ability: "Venom Injection: Deals +12 immediate poison damage.",
    ultimate: "Executioner: Instantly KO's opponent if their HP drops below 20.",
    description: "A ruthless syndicate assassin who injects malicious payloads into vulnerable codebases.",
    dialogue: {
      matchStart: "Your code is full of vulnerabilities...",
      correct: "Venom injected.",
      wrong: "Tsk, missed the vein.",
      combo: "The poison spreads!",
      crit: "FATAL PAYLOAD!",
      lowHp: "Cornered snake strikes hardest!",
      enemyLowHp: "One last bite to end you.",
      victory: "System corrupted. Target eliminated.",
      defeat: "Purged... but I'll bite again."
    }
  },
  {
    id: "oracle",
    name: "ORACLE",
    title: "The Data Visionary",
    rank: "S-Class",
    level: 29,
    specialty: "Machine Learning & Pattern Recognition",
    color: "#FFD700",
    glow: "#FFF176",
    emoji: "👑",
    portrait: "/avatars/oracle.png",
    stats: { speed: 86, power: 84, defense: 88, intellect: 98 },
    passive: "Insight: Free coding hint provided on every code challenge.",
    ability: "Foresight: Reveals the correct option letter instantly.",
    ultimate: "Neural Mesh: Auto-fills 50% of starter code for code challenges.",
    description: "A visionary AI architect whose neural network foresees bugs before they manifest.",
    dialogue: {
      matchStart: "The data reveals your every move.",
      correct: "As predicted by the model.",
      wrong: "A temporary anomaly.",
      combo: "Neural convergence active!",
      crit: "PREDICTIVE CRITICAL!",
      lowHp: "Data buffer critical!",
      enemyLowHp: "Opponent confidence at 0%.",
      victory: "The prophecy of data fulfilled.",
      defeat: "Model overfitted... retraining weights."
    }
  },
  {
    id: "glitch",
    name: "GLITCH",
    title: "The Anomaly",
    rank: "S-Class",
    level: 27,
    specialty: "Memory Leaks & Unpredictable Edge Cases",
    color: "#EC4899",
    glow: "#F472B6",
    emoji: "👾",
    portrait: "/avatars/glitch.png",
    stats: { speed: 96, power: 94, defense: 65, intellect: 92 },
    passive: "Chaos Loop: 25% chance to duplicate attack damage on hit.",
    ability: "Null Pointer: Freezes opponent's input for 3 seconds.",
    ultimate: "Buffer Overflow: Causes severe screen distortion and confusion to opponent.",
    description: "An unscripted sentient AI anomaly that corrupts game memory and thrives on chaotic bugs.",
    dialogue: {
      matchStart: "ErR0r 404: MAtcH NoT FoUnD!",
      correct: "GLITCH STRIKE!",
      wrong: "NULL POINTER EXCEPTION!",
      combo: "CHAOS OVERFLOW!",
      crit: "STACK OVERFLOW!",
      lowHp: "Memory leaking... corrupted!",
      enemyLowHp: "Kernel panic detected in target!",
      victory: "SYSTEM BLUE SCREENED!",
      defeat: "Rebooting in safe mode..."
    }
  }
];

// Map legacy anime hero IDs to new Cyberpunk characters for 100% backward compatibility
const heroAliasMap = {
  naruto: "kairo",
  sasuke: "nyx",
  goku: "raizen",
  luffy: "viper",
  zoro: "raizen",
  gojo: "astra",
  light: "nyx",
  killua: "kairo",
  saitama: "oracle"
};

export function getHeroById(id) {
  if (!id) return animeHeroes[0];
  const targetId = heroAliasMap[id.toLowerCase()] || id.toLowerCase();
  return animeHeroes.find((h) => h.id === targetId) || animeHeroes[0];
}

export const eloTiers = [
  { name: "Silver", min: 0 },
  { name: "Gold", min: 1200 },
  { name: "Platinum", min: 1600 },
  { name: "Diamond", min: 2000 },
  { name: "Master", min: 2400 },
  { name: "Grandmaster", min: 2800 },
  { name: "Legend", min: 3200 },
  { name: "Coding King", min: 3600 }
];

export function getTierForElo(elo) {
  let tier = eloTiers[0];
  for (const t of eloTiers) {
    if (elo >= t.min) tier = t;
  }
  return tier;
}

export function getNextTierProgress(elo) {
  const idx = eloTiers.findIndex((t) => elo < t.min);
  if (idx === -1) return 1;
  const prev = eloTiers[idx - 1]?.min ?? 0;
  const next = eloTiers[idx].min;
  return (elo - prev) / (next - prev);
}
