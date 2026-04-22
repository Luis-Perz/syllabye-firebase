import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZW0cWkqHJS6s7y_rLcVXXvYyJbS97V2o",
    authDomain: "syllabye-4a90d.firebaseapp.com",
    projectId: "syllabye-4a90d",
    storageBucket: "syllabye-4a90d.firebasestorage.app",
    messagingSenderId: "556619147073",
    appId: "1:556619147073:web:3dd772560ccaca68f0e3c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };