// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIjP-NmYgehOEc8aqqjAdQpDwsgFel9wo",
  authDomain: "ereservation-f5852.firebaseapp.com",
  projectId: "ereservation-f5852",
  storageBucket: "ereservation-f5852.appspot.com",
  messagingSenderId: "356127508814",
  appId: "1:356127508814:web:6aaa4750c58c4c86c9b61f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export {auth, db};