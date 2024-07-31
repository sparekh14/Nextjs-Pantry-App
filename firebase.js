// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDteqf2S-QOYfAd8pm9P3WBOvRQeWkRV_8",
  authDomain: "pantry-app-bc61f.firebaseapp.com",
  projectId: "pantry-app-bc61f",
  storageBucket: "pantry-app-bc61f.appspot.com",
  messagingSenderId: "294903689374",
  appId: "1:294903689374:web:a43e47dcd3e3656ba28b8f",
  measurementId: "G-WN7NHEN96B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };