
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWIKatXREI_1IvnwZQDr11alf-ORjCGyI",
  authDomain: "do-an-ffaed.firebaseapp.com",
  projectId: "do-an-ffaed",
  storageBucket: "do-an-ffaed.appspot.com",
  messagingSenderId: "244287535276",
  appId: "1:244287535276:web:667ca101122d60554ec709",
  measurementId: "G-2X42NVBW4N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);