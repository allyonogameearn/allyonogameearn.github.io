import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0pw1tf3WUk9yEYFmaH5k-7AM2_6MJTa8",
  authDomain: "allyonogamesearn.firebaseapp.com",
  projectId: "allyonogamesearn",
  storageBucket: "allyonogamesearn.firebasestorage.app",
  messagingSenderId: "15752292091",
  appId: "1:15752292091:web:f1cb02a901057c2f95725e",
  measurementId: "G-2EZ77J25W9"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
