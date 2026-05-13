import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore";

export function useRole() {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        return auth.onAuthStateChanged(async (user) => {
            if (user) {
                const roleRef = await getDoc(doc(db, "roles", user.email));
                if (roleRef.exists()) {
                    setRole(roleRef.data().role);
                } else {
                    setRole("user");
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });
    }, []);

    return { role, loading };
}