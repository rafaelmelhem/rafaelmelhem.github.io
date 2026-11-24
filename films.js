const filmDialog = document.querySelector("#film-dialog");
const filmVideo = document.querySelector("#film-video");
const activeFilmTitle = document.querySelector("#active-film-title");
const activeFilmCredit = document.querySelector("#active-film-credit");
let activeFilmLink;

for (const link of document.querySelectorAll(".film-link")) {
  link.addEventListener("click", (event) => {
    if (!filmDialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    activeFilmLink = link;
    activeFilmTitle.textContent = link.querySelector(".film-name").textContent;
    activeFilmCredit.textContent = link.querySelector(".film-credit").textContent;
    document.querySelector("#set-audio").pause();
    filmVideo.poster = link.querySelector("img").src;
    filmVideo.src = link.href;
    filmDialog.showModal();
    filmVideo.play().catch(() => {});
  });
}

filmDialog.addEventListener("close", () => {
  filmVideo.pause();
  filmVideo.removeAttribute("src");
  filmVideo.load();
  activeFilmLink?.focus();
});
