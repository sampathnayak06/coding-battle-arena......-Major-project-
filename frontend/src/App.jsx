import { useEffect, useState } from "react";
import ParticleCanvas from "./components/ParticleCanvas.jsx";
import TopTaskbar from "./components/TopTaskbar.jsx";
import HomePage from "./components/HomePage.jsx";
import MainLevelHub from "./components/MainLevelHub.jsx";
import RightDotNav from "./components/RightDotNav.jsx";
import TopThreeDotMenu from "./components/TopThreeDotMenu.jsx";
import AssistStickyNote from "./components/AssistStickyNote.jsx";
import HistoryStickyNote from "./components/HistoryStickyNote.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import LobbyPage from "./components/LobbyPage.jsx";
import BattleArena from "./components/BattleArena.jsx";
import VictoryDefeatModal from "./components/VictoryDefeatModal.jsx";
import LeaderboardPage from "./components/LeaderboardPage.jsx";
import VaultPage from "./components/VaultPage.jsx";
import CampaignMapPage from "./components/CampaignMapPage.jsx";
import CampaignVictoryModal from "./components/CampaignVictoryModal.jsx";
import ThemeStickyNote from "./components/ThemeStickyNote.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import settingsService from "./services/settingsService.js";
import { loadSavedTheme, applyTheme } from "./services/themeService.js";
import { fetchMe, fetchProfile, getToken, setToken, fetchLevels, fetchLevelDetails, completeLevel } from "./api.js";
import { socket, reconnectSocketWithAuth } from "./socket.js";
import ControlsHUD from "./components/ControlsHUD.jsx";

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authView, setAuthView] = useState("login"); // login | signup

  const [profile, setProfile] = useState(null);
  const [showHomePage, setShowHomePage] = useState(true); // true = landing home page, false = game view
  const [activeView, setActiveView] = useState("hub"); // 'hub' | 'arena' | 'ai' | 'world' | 'vault' | 'leaderboard'
  const [stickyPanel, setStickyPanel] = useState(null); // 'assist' | 'history' | null
  const [connected, setConnected] = useState(socket.connected);
  const [showAuthTransition, setShowAuthTransition] = useState(false);

  const [matchData, setMatchData] = useState(null); // active BattleArena payload
  const [matchResult, setMatchResult] = useState(null); // VictoryDefeatModal payload
  const [campaignLevelConfig, setCampaignLevelConfig] = useState(null);
  const [campaignResult, setCampaignResult] = useState(null); // CampaignVictoryModal payload
  const [showAssistHUD, setShowAssistHUD] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Initialize theme and settings on mount
  useEffect(() => {
    applyTheme(loadSavedTheme());
    settingsService.loadSettings();
  }, []);

  // Restore session from token
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

  // Load full profile once authed
  useEffect(() => {
    if (!authUser || authUser.isGuest) return;
    refreshProfile();
  }, [authUser]);

  // Global ESC key to close active sticky note panel or return to hub
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (stickyPanel) {
          setStickyPanel(null);
        } else if (showHomePage) {
          // Keep home page
        } else if (activeView !== "hub" && !matchData) {
          setActiveView("hub");
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stickyPanel, showHomePage, activeView, matchData]);

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
      skills: { arrays: 60, dynamicProgramming: 52, graphs: 38, strings: 68, trees: 45 },
      badges: ["Guest Pass"]
    };

    showLoginOverlay();
    setAuthUser(guestProfile);
    setProfile(guestProfile);
    reconnectSocketWithAuth();
  }

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      if (authUser && !authUser.isGuest) refreshProfile();
    };
    const onDisconnect = () => setConnected(false);
    const onUserDataUpdated = () => {
      console.log("[socket] user:dataUpdated received -> Refreshing profile...");
      refreshProfile();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("user:dataUpdated", onUserDataUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("user:dataUpdated", onUserDataUpdated);
    };
  }, [authUser]);

  function handleLogout() {
    setToken(null);
    setAuthUser(null);
    setProfile(null);
    setShowHomePage(true);
    setActiveView("hub");
    setStickyPanel(null);
    socket.disconnect();
  }

  function handleMatchStart(data) {
    setMatchData(data);
    setShowHomePage(false);
    setActiveView("hub");
    setStickyPanel(null);
  }

  function handleAuthSuccess(user) {
    showLoginOverlay();
    setAuthUser(user);
    setProfile(user);
  }

  // Launch campaign level with chosen language
  async function handleStartCampaignLevel({ levelId, language = "javascript", levelConfig }) {
    try {
      const lang = String(language).toLowerCase();
      const res = await fetchLevelDetails(levelId, lang);
      const levelSeries = res.series || [];
      setCampaignLevelConfig(res.level || levelConfig);
      setShowHomePage(false);
      setMatchData({
        roomCode: `camp_lvl_${levelId}_${lang}`,
        series: levelSeries,
        endsAt: Date.now() + (levelConfig?.timeLimitMinutes || 10) * 60 * 1000,
        vsAI: true,
        language: lang,
        level: { level: levelId, name: levelConfig?.title || `Level ${levelId}` },
        mode: "campaign",
        campaignLevelId: levelId
      });
      setStickyPanel(null);
    } catch (err) {
      console.error("[App] handleStartCampaignLevel error:", err);
    }
  }

  // Next campaign level launch from victory modal
  async function handleNextCampaignLevel(nextLevelId) {
    setCampaignResult(null);
    try {
      const levelsRes = await fetchLevels();
      const nextLvl = (levelsRes.levels || []).find((l) => l.levelId === nextLevelId);
      if (nextLvl) {
        handleStartCampaignLevel({ levelId: nextLevelId, language: matchData?.language || "javascript", levelConfig: nextLvl });
      } else {
        setShowHomePage(false);
        setActiveView("world");
      }
    } catch (err) {
      console.error("[App] handleNextCampaignLevel error:", err);
      setShowHomePage(false);
      setActiveView("world");
    }
  }

  // Handle match end across all modes
  async function handleMatchEnd(result) {
    if (matchData?.mode === "campaign") {
      const levelId = matchData.campaignLevelId;
      const me = (result.players || []).find((p) => !p.isAI) || {};
      const questionsCleared = me.questionsCleared || 0;
      const totalQuestions = matchData.series?.length || 5;
      const accuracy = me.accuracy || (totalQuestions > 0 ? Math.round((questionsCleared / totalQuestions) * 100) : 0);
      const score = me.score || (questionsCleared * 100 + (accuracy >= 80 ? 150 : 50));
      const lang = matchData.language || "javascript";

      try {
        const completionRes = await completeLevel(levelId, {
          score,
          accuracy,
          questionsCleared,
          totalQuestions,
          language: lang
        });
        setMatchData(null);
        setCampaignResult(completionRes);
        refreshProfile();
      } catch (err) {
        console.error("[App] completeLevel error:", err);
        setMatchData(null);
        setCampaignResult({ passed: false, score, accuracy });
      }
    } else {
      setMatchResult(result);
      setMatchData(null);
    }
  }

  function handleContinueToHub() {
    setMatchResult(null);
    setMatchData(null);
    setShowHomePage(false);
    setActiveView("hub");
    refreshProfile();
  }

  // --- Auth gate ---
  if (!authChecked) {
    return (
      <div className="app-shell">
        <ParticleCanvas />
        <div className="auth-shell">
          <p className="lobby-status">Loading Coding Battle Arena…</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="app-shell">
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
      <ControlsHUD visible={showAssistHUD} />
      <ParticleCanvas />
      {showAuthTransition && <div className="auth-transition-overlay" />}

      {/* PERMANENT TOP TASKBAR (HUD) */}
      {!matchData && (
        <TopTaskbar
          player={profile}
          connected={connected}
          onHomeClick={() => {
            setShowHomePage(true);
            setActiveView("hub");
          }}
          onLogout={handleLogout}
          onOpenAssist={() => setStickyPanel((prev) => (prev === "assist" ? null : "assist"))}
          onOpenHistory={() => setStickyPanel((prev) => (prev === "history" ? null : "history"))}
          onOpenTheme={() => setStickyPanel((prev) => (prev === "theme" ? null : "theme"))}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {/* RIGHT-SIDE VERTICAL DOT NAVIGATION */}
      {!matchData && (
        <RightDotNav
          activeSection={showHomePage ? "" : activeView}
          onSelectSection={(sectionId) => {
            if (sectionId === "history") {
              setStickyPanel((prev) => (prev === "history" ? null : "history"));
            } else {
              setStickyPanel(null);
              setShowHomePage(false);
              setActiveView(sectionId);
            }
          }}
        />
      )}

      {/* MAIN FULL-SCREEN VIEW AREA */}
      <main className="app-body">
        {matchData ? (
          <BattleArena
            matchData={matchData}
            player={{ ...authUser, ...profile }}
            onMatchEnd={handleMatchEnd}
          />
        ) : showHomePage ? (
          <HomePage
            player={profile}
            onEnterArena={() => {
              setShowHomePage(false);
              setActiveView("hub");
            }}
            onNavigateSection={(sectionId) => {
              setShowHomePage(false);
              setActiveView(sectionId);
            }}
          />
        ) : activeView === "arena" || activeView === "ai" ? (
          <LobbyPage
            mode={activeView}
            onMatchStart={handleMatchStart}
            onCancel={() => setActiveView("hub")}
          />
        ) : activeView === "world" ? (
          <CampaignMapPage
            player={profile}
            onStartLevel={({ levelId, levelConfig, language }) => {
              handleStartCampaignLevel({ levelId, levelConfig, language: language || "javascript" });
            }}
            onBack={() => setActiveView("hub")}
          />
        ) : activeView === "vault" ? (
          <VaultPage onBack={() => setActiveView("hub")} />
        ) : activeView === "leaderboard" ? (
          <LeaderboardPage currentUserId={authUser.id} onBack={() => setActiveView("hub")} />
        ) : (
          <MainLevelHub
            player={profile}
            onStartLevel={handleStartCampaignLevel}
          />
        )}
      </main>

      {/* --- STICKY NOTE SIDE PANELS (NOT FULL-SCREEN) --- */}
      {stickyPanel === "assist" && (
        <AssistStickyNote onClose={() => setStickyPanel(null)} />
      )}

      {stickyPanel === "history" && (
        <HistoryStickyNote player={profile} onClose={() => setStickyPanel(null)} />
      )}

      {stickyPanel === "theme" && (
        <ThemeStickyNote onClose={() => setStickyPanel(null)} />
      )}

      {/* System Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}

      {/* Match Result Modals */}
      {matchResult && <VictoryDefeatModal result={matchResult} onContinue={handleContinueToHub} />}

      {campaignResult && (
        <CampaignVictoryModal
          result={campaignResult}
          levelConfig={campaignLevelConfig}
          onNextLevel={handleNextCampaignLevel}
          onRetry={(levelId) => {
            setCampaignResult(null);
            if (campaignLevelConfig) handleStartCampaignLevel({ levelId, levelConfig: campaignLevelConfig, language: matchData?.language || "javascript" });
          }}
          onReturnToMap={() => {
            setCampaignResult(null);
            setShowHomePage(false);
            setActiveView("world");
          }}
        />
      )}
    </div>
  );
}
