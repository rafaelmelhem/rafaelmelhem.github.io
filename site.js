const { setMixcloudKey, setAudioUrl, setLinkUrl, releaseUrl, coverUrl } = window.portfolioConfig;
const play = document.querySelector("#play");
const label = document.querySelector("#play-label");
const audio = document.querySelector("#set-audio");
const status = document.querySelector("#play-status");
const setLink = document.querySelector("#set-link");

if (setMixcloudKey) {
  const showUrl = new URL(setMixcloudKey, "https://www.mixcloud.com/");
  const widgetUrl = new URL("https://www.mixcloud.com/widget/iframe/");
  widgetUrl.search = new URLSearchParams({ feed: showUrl.pathname, mini: "1", hide_cover: "1" });

  document.querySelector("#mixcloud-frame").src = widgetUrl.href;
  document.querySelector("#mixcloud-link").href = showUrl.href;
  document.querySelector("#mixcloud-player").hidden = false;
  play.hidden = true;
  status.hidden = true;
} else if (setLinkUrl && !setAudioUrl) {
  setLink.href = setLinkUrl;
  setLink.hidden = false;
  play.hidden = true;
  status.textContent = "";
}

if (!setMixcloudKey && setAudioUrl) {
  audio.src = setAudioUrl;
  play.disabled = false;
  status.textContent = "";

  function syncPlayback() {
    const playing = !audio.paused && !audio.ended;
    play.classList.toggle("is-playing", playing);
    label.textContent = playing ? "Pausar set" : "Ouvir set";
  }

  for (const eventName of ["playing", "pause", "ended"]) {
    audio.addEventListener(eventName, syncPlayback);
  }

  audio.addEventListener("error", () => {
    syncPlayback();
    if (setLinkUrl) {
      setLink.href = setLinkUrl;
      setLink.hidden = false;
      play.hidden = true;
      status.textContent = "Ouça o set na plataforma.";
    } else {
      status.textContent = "O áudio está indisponível agora.";
    }
  });

  play.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    status.textContent = "";
    play.setAttribute("aria-busy", "true");
    try {
      await audio.play();
    } catch {
      if (setLink.hidden) status.textContent = "Não foi possível reproduzir o set.";
    } finally {
      play.removeAttribute("aria-busy");
    }
  });
}

if (releaseUrl) {
  const link = document.querySelector("#release-link");
  link.href = releaseUrl;
  link.hidden = false;
}

if (coverUrl) {
  const cover = document.querySelector("#cover-image");
  cover.addEventListener("load", () => {
    document.querySelector("#cover-placeholder").hidden = true;
    cover.hidden = false;
  }, { once: true });
  cover.src = coverUrl;
}
