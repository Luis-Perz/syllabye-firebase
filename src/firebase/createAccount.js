import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from "./firestore";

function isLewisEmail(email) {
    return email?.toLowerCase().endsWith("@lewisu.edu");
}

export async function CreateAccount(email, password) {
    if (!isLewisEmail(email)) {
        const err = new Error("Please use a Lewis email to create an account.");
        err.code = "auth/invalid-email";
        throw err;
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setUser(user, "user");
    return user;
}

export async function loginWithEmailAndPassword(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}