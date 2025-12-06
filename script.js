const inputEl = document.getElementById("secondsInput");
const startBtn = document.getElementById("startBtn");
const displayEl = document.getElementById("display");
const statusEl = document.getElementById("statusText");
const beepAudio = document.getElementById("beepAudio");

let timerId = null;
let remaining = 0;

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

async function ensureNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const result = await Notification.requestPermission();
    return result === "granted";
  }
  return false;
}

function showFinishedNotification() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification("Timer finished!", {
      body: "Your countdown has reached zero.",
    });
  }
}

function playBeep() {
  if (!beepAudio) return;
  beepAudio.currentTime = 0;
  beepAudio.play().catch(() => {
  });
}

function startCountdown() {
  const seconds = Number(inputEl.value);

  if (!seconds || seconds <= 0) {
    statusEl.textContent = "Please enter a valid number of seconds.";
    statusEl.classList.add("error");
    return;
  }

  statusEl.textContent = "Timer running...";
  statusEl.classList.remove("error");

  remaining = seconds;
  displayEl.textContent = formatTime(remaining);

  if (timerId !== null) {
    clearInterval(timerId);
  }

  timerId = setInterval(async () => {
    remaining -= 1;
    displayEl.textContent = formatTime(remaining);

    if (remaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      displayEl.textContent = "00:00";
      statusEl.textContent = "Timer finished!";
      playBeep();
      await ensureNotificationPermission();
      showFinishedNotification();
    }
  }, 1000);
}

startBtn.addEventListener("click", () => {
  ensureNotificationPermission();
  startCountdown();
});
