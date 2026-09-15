import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ResetUser() {
    const [email, setEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [error, setError] = useState(null);

    const auth = getAuth();
    const submitForm = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email.toLowerCase());
            setEmail("")
            setResetMessage("Check your email to reset your password");

        } catch (err) {
            console.log(err);
            setError(checkResetError(err.code));
        }
    };

    return (
        <div>
            <div className="login-inputs">
                <form onSubmit={submitForm}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    {error && <p className="error">{error}</p>}
                    <button className="submit-reset" type="submit">Reset Password</button>
                    {resetMessage && <p>{resetMessage}</p>}
                </form>
            </div>
        </div>
    );
}

function checkResetError(code) {
    switch (code) {
        case "auth/invalid-email": return "Please use a Lewis email to create an account.";
        case "auth/user-not-found": return "No account found with this email.";
        default: return "Something went wrong. Please try again.";
    }
}

