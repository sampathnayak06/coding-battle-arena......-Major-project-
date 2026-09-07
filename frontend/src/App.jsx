import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import ParticleCanvas from "./components/ParticleCanvas.jsx";
import GameHubHome from "./components/GameHubHome.jsx";
import WelcomePage from "./components/WelcomePage.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import LobbyPage from "./components/LobbyPage.jsx";
import BattleArena from "./components/BattleArena.jsx";
import VictoryDefeatModal from "./components/VictoryDefeatModal.jsx";
import LeaderboardPage from "./components/LeaderboardPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import MatchHistoryPage from "./components/MatchHistoryPage.jsx";
import VaultPage from "./components/VaultPage.jsx";
import WorldLevelsPage from "./components/WorldLevelsPage.jsx";
import { fetchMe, fetchProfile, getToken, setToken } from "./api.js";
import { socket, reconnectSocketWithAuth } from "./socket.js";
import ControlsHUD from "./components/ControlsHUD.jsx";

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authView, setAuthView] = useState("login"); // login | signup

  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("hub");
  const [pageHistory, setPageHistory] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [showAuthTransition, setShowAuthTransition] = useState(false);

  const [battleMode, setBattleMode] = useState(null); // 'arena' | 'ai' — drives Lobby
  const [matchData, setMatchData] = useState(null); // active BattleArena payload
  const [matchResult, setMatchResult] = useState(null); // VictoryDefeatModal payload
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAssist, setShowAssist] = useState(false);

  // --- Bootstrapping: restore session from token ---
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthChecked(true);
      return;
    }
    fetchMe()
      .then(({ user }) => {
        setAuthUser(user);
        setProfile((prev) => prev || user);
        reconnectSocketWithAuth();
      })
      .catch(() => setToken(null))
      .finally(() => setAuthChecked(true));
  }, []);

  // --- Load full profile (elo/coins/hero/etc) once authed ---
  useEffect(() => {
    if (!authUser || authUser.isGuest) return;
    refreshProfile();
  }, [authUser]);

  function refreshProfile() {
    fetchProfile(authUser?.id)
      .then(({ profile }) => setProfile(profile))
      .catch(() => {
        setProfile((prev) => prev || authUser);
      });
  }

  function showLoginOverlay() {
    setShowAuthTransition(true);
    window.requestAnimationFrame(() => {
      setTimeout(() => setShowAuthTransition(false), 550);
    });
  }

  function loginGuest() {
    const guestProfile = {
      id: "guest",
      username: "Guest",
      heroId: "naruto",
      elo: 750,
      coins: 0,
      wins: 0,
      losses: 0,
      isGuest: true,
      skills: {
        arrays: 60,
        dynamicProgramming: 52,
        graphs: 38,
        strings: 68,
        trees: 45
      },
      badges: ["Guest Pass"]
    };

    showLoginOverlay();
    setAuthUser(guestProfile);
    setProfile(guestProfile);
    reconnectSocketWithAuth();
  }

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  function navigate(tabId) {
    if (tabId === activeTab) return;
    setPageHistory((prev) => [...prev, activeTab]);
    setActiveTab(tabId);
    if (tabId !== "arena" && tabId !== "ai") {
      setBattleMode(null);
      setMatchData(null);
    } else {
      setBattleMode(tabId);
    }
  }

  function goBack() {
    setPageHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop();
      setActiveTab(last);
      if (last !== "arena" && last !== "ai") {
        setBattleMode(null);
        setMatchData(null);
      }
      return next;
    });
  }

  function handleLogout() {
    setToken(null);
    setAuthUser(null);
    setProfile(null);
    setActiveTab("hub");
    setPageHistory([]);
    socket.disconnect();
  }

  function handleMatchStart(data) {
    setMatchData(data);
  }

  function handleAuthSuccess(user) {
    showLoginOverlay();
    setAuthUser(user);
    setProfile(user);
  }

  function handleMatchEnd(result) {
    setMatchResult(result);
    setMatchData(null);
  }

  function handleContinueToHub() {
    setMatchResult(null);
    setBattleMode(null);
    setActiveTab("hub");
    setPageHistory([]);
    refreshProfile();
  }

  // --- Auth gate ---
  if (!authChecked) {
    return (
      <div className="app-shell">
        <ControlsHUD visible={showAssist} />
        <ParticleCanvas />
        <div className="auth-shell">
          <p className="lobby-status">Loading…</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="app-shell">
        <ControlsHUD visible={showAssist} />
        <ParticleCanvas />
        {authView === "login" ? (
          <LoginPage
            onAuthed={handleAuthSuccess}
            onLoginGuest={loginGuest}
            onSwitchToSignup={() => setAuthView("signup")}
          />
        ) : (
          <SignupPage onAuthed={handleAuthSuccess} onSwitchToLogin={() => setAuthView("login")} />
        )}
        {showAuthTransition && <div className="auth-transition-overlay" />}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <ControlsHUD visible={showAssist} />
      <ParticleCanvas />
      {showAuthTransition && <div className="auth-transition-overlay" />}
      <Navbar
        activeTab={activeTab}
        onNavigate={navigate}
        canGoBack={pageHistory.length > 0}
        onBack={goBack}
        connected={connected}
        username={authUser.username}
        onLogout={handleLogout}
        minimal={!!matchData}
        showAssist={showAssist}
        onToggleAssist={() => setShowAssist((s) => !s)}
      />
      <main className="app-body">
        {activeTab === "hub" && showWelcome ? (
          <WelcomePage onContinue={() => setShowWelcome(false)} />
        ) : null}
        {activeTab === "hub" && !showWelcome && profile && <GameHubHome player={profile} onNavigate={navigate} />}
        {activeTab === "hub" && !showWelcome && !profile && <p className="lobby-status">Loading your stats…</p>}

        {(activeTab === "arena" || activeTab === "ai") &&
          (matchData ? (
            <BattleArena matchData={matchData} player={{ ...authUser, ...profile }} onMatchEnd={handleMatchEnd} />
          ) : (
            <LobbyPage
              mode={battleMode}
              onMatchStart={handleMatchStart}
              onCancel={() => navigate("hub")}
            />
          ))}

        {activeTab === "leaderboard" && <LeaderboardPage currentUserId={authUser.id} />}
        {activeTab === "profile" && profile && <ProfilePage player={profile} />}
        {activeTab === "profile" && !profile && <p className="lobby-status">Loading profile…</p>}
        {activeTab === "history" && profile && <MatchHistoryPage player={profile} />}
        {activeTab === "history" && !profile && <p className="lobby-status">Loading history…</p>}
        {activeTab === "vault" && <VaultPage />}
        {activeTab === "world" && <WorldLevelsPage />}
      </main>

      {matchResult && <VictoryDefeatModal result={matchResult} onContinue={handleContinueToHub} />}
    </div>
  );
}
