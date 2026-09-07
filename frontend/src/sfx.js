import audioManager from "./services/audioManager.js";

export function playClick() {
  audioManager.playClick();
}

export function playCorrect() {
  audioManager.playCorrect();
}

export function playIncorrect() {
  audioManager.playIncorrect();
}

export function playReward() {
  audioManager.playReward();
}

export function playWin() {
  audioManager.playWin();
}

export function resumeAudio() {
  audioManager.ensureContext();
}

export default {
  playClick,
  playCorrect,
  playIncorrect,
  playReward,
  playWin,
  resumeAudio,
  audioManager
};

