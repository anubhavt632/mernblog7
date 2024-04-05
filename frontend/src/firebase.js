// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-c4850.firebaseapp.com",
  projectId: "mern-blog-c4850",
  storageBucket: "mern-blog-c4850.appspot.com",
  messagingSenderId: "446578222977",
  appId: "1:446578222977:web:04550bc8ba6228ceb2ea80",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);