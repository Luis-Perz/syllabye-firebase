import {createContext, useContext, useEffect, useState} from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const AuthContext = createContext({role: null, loading: true});

// This code creates a React Authentication Context that makes a user's role available throughout the application
export function AuthProvider({ children }) {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        return auth.onAuthStateChanged(async (user) => {
            setLoading(true);
            if (user && user.emailVerified){
                try{
                    const snap = await getDoc(doc(db,"roles", user.email.toLowerCase()));
                    setRole(snap.exists() ? snap.data().role : "user");
                }
                catch(err){
                    console.log(err);
                    setRole("user");
                }
            }
            else{
                setRole(null);
            }
            setLoading(false);
        });
    }, []);
    return (
        <AuthContext.Provider value={{role, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useRole = () => useContext(AuthContext);