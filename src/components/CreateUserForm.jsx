import { useState } from "react";
import { CreateAccount } from "../firebase/createAccount";

export default function CreateUserForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Creates the new account
    const submitForm = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return;
        }
        try {
            const user = await CreateAccount(email, password);
            if (user) {
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setMessage("Account created successfully. Check your Lewis email and click on link to verify your email.");
            }
        }
        catch (err) {
            setError(checkError(err.code));
        }
    };

    // HTML for creating a new account
    return (
        <div>
            <form className="create-login-form" onSubmit={submitForm}>
                <div className="login-inputs">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        required 
                    />
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                        />
                        <button
                            className="password-visibility-button"
                            type="button"
                            onClick={() => setShowPassword((visible) => !visible)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="password-field">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                        />
                        <button
                            className="password-visibility-button"
                            type="button"
                            onClick={() => setShowConfirmPassword((visible) => !visible)}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            aria-pressed={showConfirmPassword}
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <button className="login-submit-btn" type="submit">Create Account</button>
                    {message && <p className="error">{message}</p>}
                    {error && <p className="error">{error}</p>}
                </div>
            </form>
        </div>
    );
}

// Catches any invalid emails, weak pawwords, or if the email is already being used
function checkError(code) {
    switch (code) {
        case "auth/email-already-in-use": return "An account with this email already exists.";
        case "auth/invalid-email": return "Please use a Lewis email to create an account.";
        case "auth/weak-password": return "Password should be at least 8 characters.";
        default: return "Something went wrong. Please try again.";
    }
}