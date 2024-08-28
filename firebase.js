// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirebase} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQTrbjEY_8PCBOZpjKsB1GLw13gOd4lAc",
  authDomain: "flashcard-934b7.firebaseapp.com",
  projectId: "flashcard-934b7",
  storageBucket: "flashcard-934b7.appspot.com",
  messagingSenderId: "241266180981",
  appId: "1:241266180981:web:faa7fde7e3645ad57c493c",
  measurementId: "G-13KXEGF5MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirebase(app)