import { auth } from "./firebase";
import {createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { setUser } from "./firestore";

function isLewisEmail(email) {
    return email?.trim().toLowerCase().endsWith("@lewisu.edu");
}

export async function CreateAccount(email, password) {
    if (!isLewisEmail(email)) {
        const err = new Error("Please use a Lewis email to create an account.");
        err.code = "auth/invalid-email";
        throw err;
    }
    const { user } = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
    try{
        await sendEmailVerification(user)
        await setUser(user.email, "user");
    }finally{
        await signOut(auth);
    }
    return user;
}

async function loginWithEmailAndPassword(email, password) {
    const {user} = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    if (!user.emailVerified){
        await signOut(auth);
        const err = new Error("Please verify your email before logging in.");
        err.code = "auth/email-not-verified";
        throw err;
    }
    return user;
}

export default loginWithEmailAndPassword