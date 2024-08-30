// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDugPM3BpakijCEYJNj87tkjHDYCPzfcPM",
  authDomain: "recipe-gen-951e3.firebaseapp.com",
  projectId: "recipe-gen-951e3",
  storageBucket: "recipe-gen-951e3.appspot.com",
  messagingSenderId: "1080110500175",
  appId: "1:1080110500175:web:986d42a4f463b6b39f9d3a",
  measurementId: "G-E549HBGGKQ",
  databaseURL: 'https://recipe-gen-951e3-default-rtdb.firebaseio.com' 
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);