import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBTcmZJCku7K-Xbv5mUdd3yOyxCpfctIAg",
  authDomain: "evfx-f1e38.firebaseapp.com",
  projectId: "evfx-f1e38",
  storageBucket: "evfx-f1e38.firebasestorage.app",
  messagingSenderId: "875126116751",
  appId: "1:875126116751:web:26c440cf7377bcbcedbbfa",
  measurementId: "G-3MCFE5WHDZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);