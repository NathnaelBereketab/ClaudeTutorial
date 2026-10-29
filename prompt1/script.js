const DEFAULT_SECONDS = 25 * 60;

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("status");

let remaining = DEFAULT_SECONDS;
let intervalId = null;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function render() {
  display.textContent = formatTime(remaining);
  document.title = `${formatTime(remaining)} - Pomodoro`;
}

function playNotification() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1);
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  startBtn.textContent = "Start";
}

function tick() {
  remaining--;
  render();
  if (remaining <= 0) {
    stopTimer();
    statusText.textContent = "Time's up! Take a break.";
    playNotification();
  }
}

startBtn.addEventListener("click", () => {
  if (intervalId) {
    stopTimer();
    statusText.textContent = "Paused";
    return;
  }
  if (remaining <= 0) remaining = DEFAULT_SECONDS;
  intervalId = setInterval(tick, 1000);
  startBtn.textContent = "Pause";
  statusText.textContent = "Focusing...";
});

resetBtn.addEventListener("click", () => {
  stopTimer();
  remaining = DEFAULT_SECONDS;
  statusText.textContent = "Ready to focus";
  render();
});

render();
