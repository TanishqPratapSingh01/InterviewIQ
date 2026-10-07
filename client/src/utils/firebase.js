
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "interviewiq-a71b8.firebaseapp.com",
  projectId: "interviewiq-a71b8",
  storageBucket: "interviewiq-a71b8.firebasestorage.app",
  messagingSenderId: "202814683192",
  appId: "1:202814683192:web:b31384878cd4235d828ecd"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}