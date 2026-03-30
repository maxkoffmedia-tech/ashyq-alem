// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

// Firebase конфигурация (ВАШИ КЛЮЧИ)
const firebaseConfig = {
  apiKey: "AIzaSyAWcCcBzmsF5q5oqO9GVp_MgG7snNPwnjk", // 
  authDomain: "ashyq-alem.firebaseapp.com",
  databaseURL: "https://ashyq-alem-default-rtdb.firebaseio.com",
  projectId: "ashyq-alem",
  storageBucket: "ashyq-alem.firebasestorage.app",
  messagingSenderId: "46155151336",
  appId: "1:46155151336:web:cb8e496be7f7ded2a4165d"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let messaging;
try {
  // Проверяем, что window доступно (для SSR)
  if (typeof window !== 'undefined') {
    messaging = getMessaging(app);
  }
} catch (e) {
  console.error("Ошибка инициализации Firebase Messaging:", e);
}

export { app, db, messaging };