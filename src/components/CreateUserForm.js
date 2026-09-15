import { useState } from "react";
import { CreateAccount } from "../firebase/createAccount";

export default function CreateUserForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const submitForm = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const user = await CreateAccount(email, password);
            if (user) {
                setEmail("");
                setPassword("");
                setMessage("Account created successfully.");
                onSuccess?.(user);
            }
        } catch (err) {
            setError(checkError(err.code));
        }
    };

    return (
        <div>
            <form className="create-login-form" onSubmit={submitForm}>
                <div className="login-inputs">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={8} />
                    <button className="login-submit-btn" type="submit">Create Account</button>
                    {message && <p className="error">{message}</p>}
                    {error && <p className="error">{error}</p>}
                </div>
            </form>
        </div>
    );
}

function checkError(code) {
    switch (code) {
        case "auth/email-already-in-use": return "An account with this email already exists.";
        case "auth/invalid-email": return "Please use a Lewis email to create an account.";
        case "auth/weak-password": return "Password should be at least 6 characters.";
        default: return "Something went wrong. Please try again.";
    }
}