import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithCustomToken, UserCredential } from "firebase/auth";

// Global variables provided by the environment
declare global {
  var __app_id: string | undefined;
  var __firebase_config: string | undefined;
  var __initial_auth_token: string | undefined;
}

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// Initialize Firebase with the provided config
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Исправленная функция: теперь она возвращает строку с UID
export const ensureAnonAuth = async (): Promise<string | null> => {
    try {
        let userCredential: UserCredential;
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            userCredential = await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            userCredential = await signInAnonymously(auth);
        }
        // Возвращаем ID, чтобы его можно было сохранить в состояние (state)
        return userCredential.user.uid;
    } catch (error) {
        console.error("Firebase Auth error:", error);
        return null;
    }
};

// Function to wait for authentication state
export const waitForAuth = () => {
  return new Promise<any>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    });
  });
};