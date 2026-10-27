const exercises = [
  {
    title: "Kol Açma ve Omuz Çevirme",
    description: "Ayakta dik durulur. Kollar iki yana açılarak omuzlardan kontrollü şekilde hareket ettirilir. Omuz ve kol kasları çalıştırılır.",
    recommendation: "5 öne • 5 arkaya",
    video: "video1 (1).mp4",
    preview: "previews/egzersiz-1.jpg",
    accent: "#e3201f"
  },
  {
    title: "Kol ve Omuz Esnetme",
    description: "Bir kol göğüs hizasında karşı tarafa uzatılır ve diğer elle desteklenerek esnetilir. Ardından kol başın arkasına alınarak esnetme yapılır.",
    recommendation: "Her kol • 8 saniye",
    video: "video1 (2).mp4",
    preview: "previews/egzersiz-2.jpg",
    accent: "#1a65d7"
  },
  {
    title: "Öne Eğilme ve Doğrulma",
    description: "Ayaklar hafif açık tutulur. Kollar yukarı kaldırılır, belden öne doğru eğilinir ve eller yere yaklaştırılır. Ardından başlangıç pozisyonuna dönülür.",
    recommendation: "5 tekrar",
    video: "video1 (3).mp4",
    preview: "previews/egzersiz-3.jpg",
    accent: "#17a337"
  },
  {
    title: "Yerinde Hafif Sıçrama",
    description: "Ayaklar hafifçe yerden kaldırılarak küçük sıçramalar yapılır. Kollar hareketin ritmine uygun şekilde kullanılır.",
    recommendation: "8 hafif sıçrama",
    video: "video1 (4).mp4",
    preview: "previews/egzersiz-4.jpg",
    accent: "#f06a13"
  },
  {
    title: "Yerinde Koşma ve Kolları Yukarı Kaldırma",
    description: "Önce yerinde hafif koşulur. Ardından kollar yukarı kaldırılarak sıçrama hareketleri yapılır.",
    recommendation: "15 sn koş • 5 sıçrama",
    video: "video1 (5).mp4",
    preview: "previews/egzersiz-5.jpg",
    accent: "#8f2ee8"
  },
  {
    title: "Boyun ve Gövdeyi Yana Esnetme",
    description: "Ayakta dik durulur. Baş ve gövde kontrollü şekilde yanlara eğilerek boyun ve bel çevresindeki kaslar esnetilir.",
    recommendation: "Her yana 2 kez • 5 saniye",
    video: "video1 (6).mp4",
    preview: "previews/egzersiz-6.jpg",
    accent: "#1099ab"
  },
  {
    title: "Öne Eğilerek Kolları Uzatma",
    description: "Ayakta dururken kollar yukarı kaldırılır. Ardından belden öne eğilerek kollar ileriye doğru uzatılır. Tekrar dik pozisyona dönülür.",
    recommendation: "5 tekrar",
    video: "video1 (7).mp4",
    preview: "previews/egzersiz-7.jpg",
    accent: "#e71972"
  }
];

const screens = [...document.querySelectorAll(".screen")];
const introVideo = document.querySelector("#intro-video");
const exerciseVideo = document.querySelector("#exercise-video");
const introPlay = document.querySelector("#intro-play");
const introToggle = document.querySelector("#intro-toggle");
const grid = document.querySelector("#exercise-grid");
const previews = new Map(exercises.map((exercise, index) => [index, exercise.preview]));
const STORAGE_KEY = "bahce-egzersizleri-tamamlananlar";
let completed = loadCompleted();
let currentExercise = 0;

function loadCompleted() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(saved.filter((value) => Number.isInteger(value) && value >= 0 && value < exercises.length));
  } catch {
    return new Set();
  }
}

function saveCompleted() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

function showScreen(id) {
  introVideo.pause();
  exerciseVideo.pause();
  screens.forEach((screen) => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  const heading = document.querySelector(`#${id} h1, #${id} h2`);
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

function renderCards() {
  grid.replaceChildren();
  exercises.forEach((exercise, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `exercise-card${completed.has(index) ? " completed" : ""}`;
    card.style.setProperty("--accent", exercise.accent);
    card.setAttribute("aria-label", `${index + 1}. hareket: ${exercise.title}${completed.has(index) ? ", tamamlandı" : ""}`);
    card.innerHTML = `
      <span class="card-number">${index + 1}</span>
      <span class="completion-badge" aria-hidden="true">✓</span>
      <img class="card-preview" alt="${exercise.title} video önizlemesi">
      <h3>${exercise.title}</h3>`;
    const img = card.querySelector("img");
    if (previews.has(index)) img.src = previews.get(index);
    card.addEventListener("click", () => openExercise(index));
    grid.append(card);
  });
}

function openExercise(index) {
  currentExercise = index;
  const exercise = exercises[index];
  document.querySelector("#progress-sign").textContent = `Egzersiz ${index + 1} / ${exercises.length}`;
  document.querySelector("#exercise-number").textContent = index + 1;
  document.querySelector("#exercise-number").style.setProperty("--accent", exercise.accent);
  document.querySelector("#exercise-title").textContent = exercise.title;
  document.querySelector("#exercise-description").textContent = exercise.description;
  document.querySelector("#exercise-recommendation").textContent = exercise.recommendation;
  document.querySelector("#video-recommendation-text").textContent = exercise.recommendation;
  const preview = document.querySelector("#exercise-preview");
  preview.alt = `${exercise.title} video önizlemesi`;
  if (previews.has(index)) preview.src = previews.get(index);
  else preview.removeAttribute("src");
  const nextButton = document.querySelector("#next-exercise");
  nextButton.innerHTML = index === exercises.length - 1 ? `Bitir <span aria-hidden="true">★</span>` : `Sonraki <span aria-hidden="true">→</span>`;
  document.querySelector("#exercise-error").hidden = true;
  exerciseVideo.src = exercise.video;
  exerciseVideo.load();
  showScreen("player-screen");
  exerciseVideo.play().catch(() => {});
}

function finishCurrentAndContinue() {
  completed.add(currentExercise);
  saveCompleted();
  renderCards();
  if (currentExercise === exercises.length - 1) showScreen("finish-screen");
  else openExercise(currentExercise + 1);
}

async function playIntro() {
  try {
    await introVideo.play();
    introPlay.hidden = true;
  } catch {
    introPlay.hidden = false;
  }
  updateIntroButton();
}

function updateIntroButton() {
  introToggle.textContent = introVideo.paused ? "▶ Oynat" : "Ⅱ Duraklat";
}

document.querySelector("#start-btn").addEventListener("click", () => {
  showScreen("intro-screen");
  playIntro();
});
introPlay.addEventListener("click", playIntro);
introToggle.addEventListener("click", () => introVideo.paused ? playIntro() : introVideo.pause());
introVideo.addEventListener("play", () => { introPlay.hidden = true; updateIntroButton(); });
introVideo.addEventListener("pause", updateIntroButton);
introVideo.addEventListener("ended", () => showScreen("selection-screen"));
document.querySelector("#skip-intro").addEventListener("click", () => showScreen("selection-screen"));
introVideo.addEventListener("error", () => {
  document.querySelector("#intro-error").hidden = false;
  introPlay.hidden = true;
  introToggle.disabled = true;
});

exerciseVideo.addEventListener("ended", () => {
  completed.add(currentExercise);
  saveCompleted();
  renderCards();
  if (currentExercise === exercises.length - 1) showScreen("finish-screen");
});
exerciseVideo.addEventListener("error", () => { document.querySelector("#exercise-error").hidden = false; });
document.querySelector("#back-to-movements").addEventListener("click", () => { renderCards(); showScreen("selection-screen"); });
document.querySelector("#replay-exercise").addEventListener("click", () => {
  exerciseVideo.currentTime = 0;
  exerciseVideo.play().catch(() => {});
});
document.querySelector("#next-exercise").addEventListener("click", finishCurrentAndContinue);
document.querySelector("#see-movements").addEventListener("click", () => { renderCards(); showScreen("selection-screen"); });
document.querySelector("#restart").addEventListener("click", () => {
  completed = new Set();
  saveCompleted();
  renderCards();
  introVideo.currentTime = 0;
  showScreen("cover-screen");
});

document.addEventListener("keydown", (event) => {
  const activeId = document.querySelector(".screen.active")?.id;
  if (event.key === "Escape" && (activeId === "player-screen" || activeId === "intro-screen")) {
    showScreen("selection-screen");
  }
  if (event.code === "Space" && activeId === "player-screen" && document.activeElement?.tagName !== "BUTTON") {
    event.preventDefault();
    exerciseVideo.paused ? exerciseVideo.play().catch(() => {}) : exerciseVideo.pause();
  }
});

renderCards();
