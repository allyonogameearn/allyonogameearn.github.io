import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
setDoc,
increment,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const gamesContainer=document.getElementById("gamesContainer");
const topThree=document.getElementById("topThreeGames");
const searchInput=document.getElementById("searchInput");

let allGames=[];

async function loadGames(){

const snapshot=await getDocs(collection(db,"games"));

allGames=[];

snapshot.forEach((docItem)=>{

allGames.push({
  id: docItem.id,
  ...docItem.data()
});

});

allGames.sort((a,b)=>(a.order||999)-(b.order||999));

showTopGames();

showGames(allGames);

}
function showTopGames(){

if(!topThree) return;

topThree.innerHTML="";

allGames.slice(0,3).forEach(game=>{

topThree.innerHTML+=`

<div class="top-card">

<img src="images/${game.image}" alt="${game.name}">

${game.badge ? `<div class="hot-badge" style="background:${game.badgeColor || '#ff1744'}">${game.badge}</div>` : ''}

<h3>${game.name}</h3>
${game.badge ? `<div class="hot-badge" style="background:${game.badgeColor || '#ff1744'}">${game.badge}</div>` : ''}

<p style="color:${game.bonusColor};font-weight:bold;">
🎁 ${game.bonus || "Bonus Not Available"}
</p>

<p>🏦 ${game.withdraw || "Min ₹100"}</p>

<a href="${game.link}" target="_blank" class="top3-btn">

Download

</a>

</div>

`;

});

}

function showGames(list){

if(!gamesContainer) return;

gamesContainer.innerHTML="";

list.forEach(game=>{

gamesContainer.innerHTML+=`

<div class="game-card">

<img src="images/${game.image}" alt="${game.name}">

<div class="game-info">

<div style="display:flex;justify-content:space-between;align-items:center;">
<h3>${game.name}</h3>
${game.badge ? `<span class="hot-badge" style="position:static;background:${game.badgeColor || '#ff1744'}">${game.badge}</span>` : ''}
</div>

<p style="color:#f59e0b;font-weight:bold;">
${"⭐".repeat(game.rating || 5)}
</p>

<p style="color:${game.bonusColor};font-weight:bold;">
🎁 Welcome Bonus: ${game.bonus || "₹51"}
</p>

<p style="color:#B8860B;font-weight:bold;">
🏦 Withdrawal: ${game.withdraw || "₹100"}
</p>

</div>

<a href="${game.link}" target="_blank" class="download-btn top-download-btn" onclick="updateDownload('${game.id}')">
Download

</a>

</div>

`;

});

}
if(searchInput){

searchInput.addEventListener("input",()=>{

const value=searchInput.value.toLowerCase().trim();

const result=allGames.filter(game=>{

return game.name.toLowerCase().includes(value);

});

showGames(result);

});

}

loadGames();
const tabs = document.querySelectorAll(".tabs button");

function setActiveTab(index){
  tabs.forEach(btn => btn.classList.remove("active"));
  tabs[index].classList.add("active");
}
tabs[0].onclick = () => {
  showGames(allGames);
};
tabs[0].onclick = () => {
  setActiveTab(0);
  showGames(allGames);
};

tabs[1].onclick = () => {
  setActiveTab(1);
  showGames(allGames.filter(game => game.badge === "NEW"));
};

tabs[2].onclick = () => {
  setActiveTab(2);
  showGames(allGames.filter(game => game.badge === "UPCOMING"));
};

setActiveTab(0);
const slides=document.querySelectorAll(".slide");

let currentSlide=0;

if(slides.length){

setInterval(()=>{

slides[currentSlide].classList.remove("active");

currentSlide=(currentSlide+1)%slides.length;

slides[currentSlide].classList.add("active");

},3000);

}
function showFireworks(){
    alert("🎉 Congratulations!");
}
document.querySelector(".header-strip").addEventListener("click", () => {
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.4 }
    });
});
async function updateDownload(gameId) {
  try {
    await updateDoc(doc(db, "games", gameId), {
      downloads: increment(1)
    });
    await setDoc(
  doc(db, "website", "stats"),
  {
    downloads: increment(1)
  },
  {
    merge: true
  }
);
  } catch (e) {
  alert(e.message);
  }
}
window.updateDownload = updateDownload;
