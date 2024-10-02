// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "blog-40371.firebaseapp.com",
    projectId: "blog-40371",
    storageBucket: "blog-40371.appspot.com",
    messagingSenderId: "636508880780",
    appId: "1:636508880780:web:4258f3cc957938d951e0a9",
    measurementId: "G-FN1VHCCRLL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
