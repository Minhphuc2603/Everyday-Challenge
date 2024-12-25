import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database"; 

const firebaseConfig = {
    apiKey: "AIzaSyBrMMNjpnsg0j0GFLoqz6FWmrw1v8OSzxY",
    authDomain: "sdn301-64d69.firebaseapp.com",
    projectId: "sdn301-64d69",
    storageBucket: "sdn301-64d69.appspot.com",
    messagingSenderId: "506560597452",
    appId: "1:506560597452:web:33c45d04bf176c198aa169",
    measurementId: "G-TJXWRBDG5Y"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { getDatabase , ref, push, onValue }; 
