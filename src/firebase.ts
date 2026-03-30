// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWcCcBzmsF5q5oqO9GVp_MgG7snNPwnjk",
  authDomain: "ashyq-alem.firebaseapp.com",
  databaseURL: "https://ashyq-alem-default-rtdb.firebaseio.com",
  projectId: "ashyq-alem",
  storageBucket: "ashyq-alem.firebasestorage.app",
  messagingSenderId: "46155151336",
  appId: "1:46155151336:web:cb8e496be7f7ded2a4165d"
};

// Init
const app = initializeApp(firebaseConfig);

// Экспорт для использования
export const auth = getAuth(app);
export const db = getFirestore(app);
