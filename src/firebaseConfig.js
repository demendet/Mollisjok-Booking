import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD7eDSCMbd4Ujm8CBgGnsen8kDBE1Z-AtQ",
  authDomain: "mollisjok-lodge.firebaseapp.com",
  projectId: "mollisjok-lodge",
  storageBucket: "mollisjok-lodge.appspot.com",
  messagingSenderId: "760434389145",
  appId: "1:760434389145:web:a35cc651b1e0ccf2f58808",
  measurementId: "G-S4SNQMW56M"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };