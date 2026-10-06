import { useState } from "react";
import loginWithEmailAndPassword from "../firebase/createAccount";

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const submitForm = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const user = await loginWithEmailAndPassword(email, password);
            if (user) onSuccess?.(user);
        } catch (err) {
            console.error("Login failed:", err.code, err.message);
            setError(mapFirebaseError(err.code));
        }
    };

    return (
        <div>
            <form className="login-form" onSubmit={submitForm}>
                <div className="login-inputs">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    {error && <p className="error">{error}</p>}
                    <button className="login-submit-btn" type="submit" >Log In</button>
                </div>
            </form>
        </div>
    );
}

function mapFirebaseError(code) {
    switch (code) {
        case "auth/wrong-password":
        case "auth/invalid-credential": return "Incorrect email or password.";
        case "auth/email-not-verified": return "Please verify your email address before logging in.";
        case "auth/too-many-requests": return "Too many attempts. Please try again later.";
        default: return "Something went wrong. Please try again.";
    }
}