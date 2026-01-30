// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGNfuBGu_KvVeqgzFvaMR7RxyJYmav6LA",
  authDomain: "million-fff50.firebaseapp.com",
  projectId: "million-fff50",
  storageBucket: "million-fff50.firebasestorage.app",
  messagingSenderId: "153615000578",
  appId: "1:153615000578:web:b97fb8f7271fcd379eb31b"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
