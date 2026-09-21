// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCwu_bBo8cqiuyi1X9BL0FCcmVjAuI0GQ",
  authDomain: "vpro-photo-gallery.firebaseapp.com",
  projectId: "vpro-photo-gallery",
  storageBucket: "vpro-photo-gallery.firebasestorage.app",
  messagingSenderId: "79782559303",
  appId: "1:79782559303:web:79c42523f00fd751e13b62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;