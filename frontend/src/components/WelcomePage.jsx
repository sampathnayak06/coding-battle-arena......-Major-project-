import React from "react";
import "./WelcomePage.css";

export default function WelcomePage({ onContinue }) {
  return (
    <div className="welcome-shell">
      <div className="welcome-bg" aria-hidden="true" />
      <div className="welcome-overlay" />

      <div className="welcome-content glass-panel">
        <h1 className="welcome-title">Coding Battle Arena</h1>
        <p className="welcome-subtitle">Real-time 1v1 coding duels — sharpen skills, climb ranks, and win rewards.</p>

        <section className="welcome-section">
          <h3>What we offer</h3>
          <ul>
            <li>Fast-paced 1v1 battles with a mix of MCQ and coding challenges.</li>
            <li>Live HP combat, accuracy tracking and ELO rating changes.</li>
            <li>AI practice mode for solo training with adjustable time limits.</li>
            <li>Vault of curated problems and a global leaderboard.</li>
          </ul>
        </section>

        <section className="welcome-section">
          <h3>Guidelines</h3>
          <ol>
            <li>Be respectful — fair play keeps the community strong.</li>
            <li>Write clear, concise code in the allotted time.</li>
            <li>Use practice mode to warm up before ranked matches.</li>
            <li>Report any bugs or unfair behavior through the support channel.</li>
          </ol>
        </section>

        <div className="welcome-actions">
          <button className="btn btn-start" onClick={onContinue}>Enter the Arena</button>
        </div>
      </div>
    </div>
  );
}
