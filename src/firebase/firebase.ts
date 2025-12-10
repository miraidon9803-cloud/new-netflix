import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVvQTlEyQrD3fngxIY42fdirx2EmaSW8U",
  authDomain: "netflix-b8ed8.firebaseapp.com",
  projectId: "netflix-b8ed8",
  storageBucket: "netflix-b8ed8.firebasestorage.app",
  messagingSenderId: "783842693572",
  appId: "1:783842693572:web:9c2a8168c273df80e0d491",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
