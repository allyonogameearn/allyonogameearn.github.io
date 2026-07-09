import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
getDoc,
deleteDoc,
updateDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const totalGames = document.getElementById("totalGames");
const totalViews = document.getElementById("totalViews");
const totalDownloads = document.getElementById("totalDownloads");

const gameName = document.getElementById("gameName");
const gameImage = document.getElementById("gameImage");
const gameLink = document.getElementById("gameLink");
const gameRating = document.getElementById("gameRating");
const gameBonus = document.getElementById("gameBonus");
const gameBonusColorPicker = document.getElementById("gameBonusColorPicker");
const gameBonusColor = document.getElementById("gameBonusColor");
const gameOrder = document.getElementById("gameOrder");
const addGame = document.getElementById("addGame");
const gamesList = document.getElementById("gamesList");

let currentEditId = "";
async function loadGames() {

  const snapshot = await getDocs(collection(db, "games"));
let games = [];

snapshot.forEach((docSnap) => {
    games.push({
        id: docSnap.id,
        ...docSnap.data()
    });
});

games.sort((a, b) => (a.order || 999) - (b.order || 999));

gamesList.innerHTML = "";
  gamesList.innerHTML = "";

  let views = 0;
  let downloads = 0;

  snapshot.forEach((docSnap) => {

    const game = docSnap.data();

    views += Number(game.views || 0);
    downloads += Number(game.downloads || 0);

    gamesList.innerHTML += `
      <div class="game-card">
      <img src="${game.image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p>⭐ ${game.rating || 5}</p>
${game.bonus ? `
<p style="color:${game.bonusColor || '#ff0000'};font-weight:bold;">
${game.bonus}
</p>
` : ""}
<button class="edit-btn" onclick="window.editGame('${docSnap.id}')">
        Edit
        </button>

<button class="delete-btn"
    onclick="window.deleteGame('${docSnap.id}')">
    Delete
</button>
      </div>
    `;
  });

  totalGames.textContent = snapshot.size;
  totalViews.textContent = views;
  totalDownloads.textContent = downloads;
}

loadGames();
addGame.addEventListener("click", async () => {

  const name = gameName.value.trim();
  const image = gameImage.value.trim();
  const link = gameLink.value.trim();
  const rating = Number(gameRating.value) || 5;
const order = Number(gameOrder.value) || 999;
const bonus = gameBonus.value.trim();
const bonusColor = gameBonusColorPicker.value;
  if (!name || !image || !link) {
    alert("Please fill all fields");
    return;
  }

  if (currentEditId) {

    await updateDoc(doc(db, "games", currentEditId), {
      name,
      image,
      link,rating,
      bonus,
bonusColor,
order
    });

    alert("Game Updated Successfully");

    currentEditId = "";
addGame.textContent = "Add Game";
  } else {

    await addDoc(collection(db, "games"), {
      name,
      image,
      link,
      rating,
      order,
      bonus,
bonusColor,
      views: 0,
      downloads: 0,
      createdAt: serverTimestamp()
    });

    alert("Game Added Successfully");
  }

  gameName.value = "";
  gameImage.value = "";
  gameLink.value = "";
  gameRating.value = "";
gameBonus.value = "";
gameBonusColorPicker.value = "#ff0000";
  await loadGames();

});
window.editGame = async (id) => {

const gameDoc = await getDoc(doc(db, "games", id));

  addGame.textContent = "Update Game";

if (!gameDoc.exists()) return;

const game = gameDoc.data();

gameName.value = game.name || "";
gameImage.value = game.image || "";
gameLink.value = game.link || "";
gameRating.value = game.rating || 5;
gameOrder.value = game.order || 999;
gameBonus.value = game.bonus || "";
gameBonusColorPicker.value = game.bonusColor || "#ff0000";
currentEditId = id;
document.querySelector(".form-box").scrollIntoView({
    behavior: "smooth",
    block: "start"
});
};
window.deleteGame = async (id) => {

  if (!confirm("Delete this game?")) return;

  await deleteDoc(doc(db, "games", id));

alert("Game Deleted Successfully");

await loadGames();

};
