import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

/*
const firebaseConfig = {
    apiKey: "AIzaSyCCF4HW6BqQdYmlpRe8dFS-G_qvROFwaHc",
    authDomain: "property-project-7463c.firebaseapp.com",
    projectId: "property-project-7463c",
    storageBucket: "property-project-7463c.appspot.com",
    messagingSenderId: "585783374570",
    appId: "1:585783374570:web:bd05a6ac2b13603b439d93",
    measurementId: "G-ECXVNJ8PD2"
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyARDiSQW2DrRGtX3E82e872pXyESzbF7sw",
  authDomain: "recommendersystem-d2daa.firebaseapp.com",
  projectId: "recommendersystem-d2daa",
  storageBucket: "recommendersystem-d2daa.appspot.com",
  messagingSenderId: "463010826568",
  appId: "1:463010826568:web:b7ef54230d0c4907a7cb7d",
  measurementId: "G-2GKJBKR3HQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const Storage = getStorage(app);
export { auth, db, Storage };
