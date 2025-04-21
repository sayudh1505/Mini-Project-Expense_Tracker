import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ3ysXWi_ByLGdqYiDZ_L_Uz0c-m7mD7A",
  authDomain: "expensetracker-d6f7b.firebaseapp.com",
  projectId: "expensetracker-d6f7b",
  storageBucket: "expensetracker-d6f7b.firebasestorage.app",
  messagingSenderId: "575526889040",
  appId: "1:575526889040:web:00692b4234e80ed62d5355"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 