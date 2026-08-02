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

const totalGames=document.getElementById("totalGames");
const totalViews=document.getElementById("totalViews");
const totalDownloads=document.getElementById("totalDownloads");

const gameName=document.getElementById("gameName");
const gameImage=document.getElementById("gameImage");
const gameLink=document.getElementById("gameLink");
const gameBonus=document.getElementById("gameBonus");

const gameWithdraw=document.getElementById("gameWithdraw");
const gameRating=document.getElementById("gameRating");
const gameOrder=document.getElementById("gameOrder");
const gameNewColor=document.getElementById("gameNewColor");
const gameBadge=document.getElementById("gameBadge");
const gameBadgeColor=document.getElementById("gameBadgeColor");
const gameBonusColorPicker=document.getElementById("gameBonusColorPicker");
const addGame=document.getElementById("addGame");
const gamesList=document.getElementById("gamesList");

let currentEditId="";

async function loadGames(){

const snapshot=await getDocs(collection(db,"games"));

gamesList.innerHTML="";

let views=0;
let downloads=0;
  const statsDoc = await getDoc(doc(db, "website", "stats"));

if (statsDoc.exists()) {
  const stats = statsDoc.data();
  totalViews.textContent = stats.views || 0;
  totalDownloads.textContent = stats.downloads || 0;
}
snapshot.forEach((docSnap)=>{

const game={
id:docSnap.id,
...docSnap.data()
};

views+=Number(game.views||0);
downloads+=Number(game.downloads||0);

gamesList.innerHTML+=`

<div class="game-card">

<img src="${game.image}" alt="${game.name}">

<h3>${game.name}</h3>

<p>⭐ ${game.rating||5}</p>

<p style="color:${game.bonusColor||'#ff0000'};font-weight:bold;">
🎁 ${game.bonus||"No Bonus"}
</p>

<p>
🏦 ${game.withdraw||"₹100"}
</p>

<button class="edit-btn"
onclick="window.editGame('${game.id}')">

Edit

</button>

<button class="delete-btn"
onclick="window.deleteGame('${game.id}')">

Delete

</button>

</div>

`;

});

totalGames.textContent=snapshot.size;
}

loadGames();
addGame.addEventListener("click", async ()=>{

const name=gameName.value.trim();
const image=gameImage.value.trim();
const link=gameLink.value.trim();
const bonus=gameBonus.value.trim();
const withdraw=gameWithdraw.value.trim();
const rating=Number(gameRating.value)||5;
const order=Number(gameOrder.value)||999;

if(!name||!image||!link){
alert("Please fill all required fields");
return;
}

const data={
name,
image,
link,
bonus,
withdraw,
rating,
order,
bonusColor: gameBonusColorPicker.value,
bonusColor: gameBonusColorPicker.value,
newColor: gameNewColor.value,
badge: gameBadge.value,
badgeColor: gameBadgeColor.value,
views:0,
downloads:0
};

if(currentEditId){

await updateDoc(doc(db,"games",currentEditId),{
name,
image,
link,
bonus,
withdraw,
rating,
order,
bonusColor: gameBonusColorPicker.value,
newColor: gameNewColor.value,
badge: gameBadge.value,
badgeColor: gameBadgeColor.value,
});

alert("Game Updated Successfully");

currentEditId="";
addGame.textContent="Add Game";

}else{

data.createdAt=serverTimestamp();

await addDoc(collection(db,"games"),data);

alert("Game Added Successfully");

}

gameName.value="";
gameImage.value="";
gameLink.value="";
gameBonus.value="";
gameWithdraw.value="";
gameRating.value="";
gameOrder.value="";
gameNewColor.value="#ff1744";
gameBadge.value="";
gameBadgeColor.value="#ff1744";
loadGames();

});
window.editGame = async (id)=>{

const gameDoc = await getDoc(doc(db,"games",id));

if(!gameDoc.exists()) return;

const game = gameDoc.data();

gameName.value = game.name || "";
gameImage.value = game.image || "";
gameLink.value = game.link || "";
gameBonus.value = game.bonus || "";
gameWithdraw.value = game.withdraw || "";
gameRating.value = game.rating || 5;
gameOrder.value = game.order || 999;
gameNewColor.value = game.newColor || "#ff1744";

currentEditId = id;

addGame.textContent = "Update Game";

document.querySelector(".form-box").scrollIntoView({
behavior:"smooth"
});

};

window.deleteGame = async (id)=>{

if(!confirm("Delete this game?")) return;

await deleteDoc(doc(db,"games",id));

alert("Game Deleted Successfully");

loadGames();

};
