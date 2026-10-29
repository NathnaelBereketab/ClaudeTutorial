const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("status");
const minutesInput = document.getElementById("minutesInput");

let remaining = getInputSeconds();
let intervalId = null;

function getInputSeconds() {
  const minutes = Math.min(180, Math.max(1, parseInt(minutesInput.value, 10) || 25));
  minutesInput.value = minutes;
  return minutes * 60;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function render() {
  display.textContent = formatTime(remaining);
  document.title = `${formatTime(remaining)} - Pomodoro`;
}

// Three-note chime generated with the Web Audio API, so no sound file is needed.
function playSoundEffect() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const start = ctx.currentTime + i * 0.3;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.5, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1.2);
  });
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  startBtn.textContent = "Start";
  minutesInput.disabled = false;
}

function tick() {
  remaining--;
  render();
  if (remaining <= 0) {
    stopTimer();
    statusText.textContent = "Time's up! Take a break.";
    playSoundEffect();
  }
}

startBtn.addEventListener("click", () => {
  if (intervalId) {
    stopTimer();
    statusText.textContent = "Paused";
    return;
  }
  if (remaining <= 0) remaining = getInputSeconds();
  intervalId = setInterval(tick, 1000);
  startBtn.textContent = "Pause";
  statusText.textContent = "Focusing...";
  minutesInput.disabled = true;
});

resetBtn.addEventListener("click", () => {
  stopTimer();
  remaining = getInputSeconds();
  statusText.textContent = "Ready to focus";
  render();
});

minutesInput.addEventListener("change", () => {
  if (intervalId) return;
  remaining = getInputSeconds();
  statusText.textContent = "Ready to focus";
  render();
});

render();
