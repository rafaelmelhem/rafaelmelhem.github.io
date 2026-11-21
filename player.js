const audio = document.querySelector("#set-audio");
const player = document.querySelector("#set-player");
const toggle = document.querySelector("#set-toggle");
const toggleLabel = document.querySelector("#set-toggle-label");
const position = document.querySelector("#set-position");
const elapsed = document.querySelector("#set-elapsed");
const duration = document.querySelector("#set-duration");
const status = document.querySelector("#set-status");

function formatTime(seconds) {
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor(whole / 60) % 60;
  const remainder = String(whole % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${remainder}` : `${minutes}:${remainder}`;
}

function updateProgress() {
  const hasDuration = Number.isFinite(audio.duration) && audio.duration > 0;
  position.disabled = !hasDuration || Boolean(audio.error);
  elapsed.textContent = formatTime(audio.currentTime);
  if (hasDuration) {
    duration.textContent = formatTime(audio.duration);
    position.max = Math.ceil(audio.duration);
    position.value = Math.floor(audio.currentTime);
    position.setAttribute("aria-valuetext", `${elapsed.textContent} de ${duration.textContent}`);
  }
}

function updatePlayback() {
  const playing = !audio.paused && !audio.ended;
  toggle.classList.toggle("is-playing", playing);
  toggleLabel.textContent = playing ? "Pausar set" : "Ouvir set";
}

function showError() {
  status.textContent = "Não foi possível carregar o set. Tente novamente.";
  status.hidden = false;
  updateProgress();
  updatePlayback();
}

for (const eventName of ["loadedmetadata", "durationchange", "timeupdate", "seeked", "ended"]) {
  audio.addEventListener(eventName, updateProgress);
}
for (const eventName of ["play", "pause", "ended"]) {
  audio.addEventListener(eventName, updatePlayback);
}
audio.addEventListener("error", showError);

toggle.addEventListener("click", async () => {
  if (!audio.paused && !audio.ended) {
    audio.pause();
    return;
  }

  status.hidden = true;
  if (audio.error) audio.load();
  try {
    await audio.play();
  } catch (error) {
    if (error.name !== "AbortError") showError();
  }
});

position.addEventListener("input", () => {
  audio.currentTime = Math.min(position.valueAsNumber, audio.duration);
  updateProgress();
});

updateProgress();
updatePlayback();
if (audio.error) showError();
audio.controls = false;
player.hidden = false;
