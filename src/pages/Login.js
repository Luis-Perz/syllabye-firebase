import { useState } from 'react';
import {auth, provider } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import {signInWithPopup} from 'firebase/auth';

function Login(){
    const nav = useNavigate()
    const [error, setError] = useState(null);

    async function handleSignIn() {
        try {
            const result = await signInWithPopup(auth, provider)
            if (!result.user.email.endsWith('@lewisu.edu')) {
                console.log("Access denied. Please sign in with your Lewis email.");
                await auth.signOut();
                setError("Access denied. Please sign in with your Lewis email.");
                return;
            }
            console.log("success")
            nav("/home")
        } catch (error) {
            console.log("error")
            setError(error.message)
        }
    }
    return (
        <>
            <div className="App">
                <h1 className="form-title">Welcome!</h1>
                <p className="form-sub">Please sign in to upload a syllabus.</p>
                <button className="submit-btn" onClick={handleSignIn}>
                    Sign in with Lewis Email
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}

            </div>
        </>
    )
}

export default Login;