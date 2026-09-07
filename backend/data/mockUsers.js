import { getTierForElo } from "./animeData.js";

export const mockUsers = [
  { id: "u1", username: "ShadowByte", heroId: "gojo", elo: 3120, coins: 4500, wins: 210, losses: 34 },
  { id: "u2", username: "NullPointer_Kun", heroId: "sasuke", elo: 2890, coins: 3120, wins: 180, losses: 55 },
  { id: "u3", username: "RecursionQueen", heroId: "killua", elo: 2650, coins: 2800, wins: 150, losses: 60 },
  { id: "u4", username: "You", heroId: "naruto", elo: 1680, coins: 450, wins: 28, losses: 7 },
  { id: "u5", username: "SegFaultSaitama", heroId: "saitama", elo: 1590, coins: 900, wins: 40, losses: 38 },
  { id: "u6", username: "PirateStack", heroId: "luffy", elo: 1420, coins: 610, wins: 22, losses: 25 },
  { id: "u7", username: "GreenSwordAlgo", heroId: "zoro", elo: 1210, coins: 300, wins: 15, losses: 20 }
];

export function getLeaderboard() {
  return [...mockUsers]
    .sort((a, b) => b.elo - a.elo)
    .map((u, i) => ({ rank: i + 1, ...u, tier: getTierForElo(u.elo).name }));
}

export function getUserProfile(userId = "u4") {
  const user = mockUsers.find((u) => u.id === userId) || mockUsers[3];
  return {
    ...user,
    tier: getTierForElo(user.elo).name,
    skills: {
      arrays: 92,
      dynamicProgramming: 78,
      graphs: 61,
      strings: 88,
      trees: 74
    },
    badges: ["First Blood", "5-Win Streak", "AI Slayer", "Speed Coder"]
  };
}
