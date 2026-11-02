import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
    apiKey: "AIzaSyDZW0cWkqHJS6s7y_rLcVXXvYyJbS97V2o",

    authDomain: "syllabye-4a90d.firebaseapp.com",

    projectId: "syllabye-4a90d",

    storageBucket: "syllabye-4a90d.firebasestorage.app",

    messagingSenderId: "556619147073",

    appId: "1:556619147073:web:3dd772560ccaca68f0e3c0"

};
const app = initializeApp(firebaseConfig);

if (process.env.NODE_ENV !== "production") {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.REACT_APP_APPCHECK_DEBUG_TOKEN;
}

initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(process.env.REACT_APP_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
});

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage};