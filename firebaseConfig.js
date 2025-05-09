// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkX5plZX0fEQ_2BR9d-QJ8scRXmHy7bQI",
  authDomain: "expotwo-71098.firebaseapp.com",
  projectId: "expotwo-71098",
  storageBucket: "expotwo-71098.firebasestorage.app",
  messagingSenderId: "663930771804",
  appId: "1:663930771804:web:093783fedad22f5a678999",
  measurementId: "G-9W3NNP9466"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

