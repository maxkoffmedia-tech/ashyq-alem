import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyAWcCcBzmsF5q5oqO9GVp_MgG7snNPwnjk",
  authDomain: "ashyq-alem.firebaseapp.com",
  databaseURL: "https://ashyq-alem-default-rtdb.firebaseio.com",
  projectId: "ashyq-alem",
  storageBucket: "ashyq-alem.firebasestorage.app",
  messagingSenderId: "46155151336",
  appId: "1:46155151336:web:cb8e496be7f7ded2a4165d"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getDatabase(app)