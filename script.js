import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  increment,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Website View Counter
await setDoc(
  doc(db, "website", "stats"),
  {
    views: increment(1)
  },
  { merge: true }
);

// Load Games
const gamesContainer = document.getElementById("gamesContainer");
const allGames = [];
if (gamesContainer) {
  const querySnapshot = await getDocs(collection(db, "games"));
  gamesContainer.innerHTML = "";
const games = [];
  querySnapshot.forEach((gameDoc) => {
    const game = gameDoc.data();
allGames.push(game);
allGames.sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
    gamesContainer.innerHTML += `
      <div class="app-card">
      <img src="https://allyonogameearn.github.io/${game.image}" alt="${game.name}">
        <div class="app-info">
          <h3>${game.name}</h3>
          <div class="rating">⭐⭐⭐⭐⭐</div>
          <a href="${game.link}" target="_blank" class="download-btn">DOWNLOAD</a>
        </div>
      </div>
    `;
  });
  allGames.sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
showGames(allGames);
}

// Banner Slider
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

if (slides.length > 1) {
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 3000);
}
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();

    showGames(
      allGames.filter(game => {
        const name = game.name.toLowerCase();

        return (
          name.includes(value) ||
          value.includes(name) ||
          name.replace(/\s/g, "").includes(value.replace(/\s/g, ""))
        );
      })
    );
  });
}
}
function showGames(list) {
  gamesContainer.innerHTML = "";

  list.forEach(game => {
    gamesContainer.innerHTML += `
      <div class="app-card">
      <img src="https://allyonogameearn.github.io/${game.image}" alt="${game.name}">
        <div class="app-info">
          <h3>${game.name}</h3>
          <div class="rating">⭐⭐⭐⭐⭐</div>
          <a href="${game.link}" target="_blank" class="download-btn">DOWNLOAD</a>
        </div>
      </div>
    `;
  });
}
showGames(allGames);

searchInput.addEventListener("input", function () {
    const text = this.value.toLowerCase().replace(/\s/g, "");

    const result = allGames.filter(game => {
        const name = game.name.toLowerCase().replace(/\s/g, "");

        return name.includes(text) || text.includes(name);
    });

    showGames(result);
});
