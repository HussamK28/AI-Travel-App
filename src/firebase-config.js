// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADaO7-jzF1uq60l7Wf4EpoD_0DpJVinkg",
  authDomain: "ai-travel-app-hussam-khan.firebaseapp.com",
  projectId: "ai-travel-app-hussam-khan",
  storageBucket: "ai-travel-app-hussam-khan.firebasestorage.app",
  messagingSenderId: "744527631098",
  appId: "1:744527631098:web:f7678352ecf02830186f43",
  measurementId: "G-LK0F4FM9R2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);