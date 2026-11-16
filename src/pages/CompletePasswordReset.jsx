import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../css/login.css";

export default function CompletePasswordReset() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState("ready");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const mode = searchParams.get("mode");
    const actionCode = searchParams.get("oobCode");

    async function submitNewPassword(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (mode !== "resetPassword" || !actionCode) {
            setError("This password reset link is missing information. Request a new reset email.");
            return;
        }
        if (password.length < 8) {
            setError("Password should be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await verifyPasswordResetCode(auth, actionCode);
            await confirmPasswordReset(auth, actionCode, password);
            setStatus("complete");
            setMessage("Your password has been reset. You can now log in with your new password.");
        } catch (err) {
            console.error("Password reset failed:", err);
            if (err.code === "auth/expired-action-code" || err.code === "auth/invalid-action-code") {
                setError("This password reset link is invalid or has expired. Please request a new one.");
            } else if (err.code === "auth/weak-password") {
                setError("Please choose a stronger password with at least 8 characters.");
            } else {
                setError("We couldn't reset your password. Please request a new reset email and try again.");
            }
        }
    }

    return (
        <main className="password-reset-page">
            <section className="password-reset-card">
                <h1>Choose a New Password</h1>
                {status === "complete" ? (
                    <>
                        <p role="status">{message}</p>
                        <button className="login-submit-btn" type="button" onClick={() => navigate("/")}>Return to Login</button>
                    </>
                ) : (
                    <form className="login-inputs" onSubmit={submitNewPassword}>
                        <p>Enter your new password below.</p>
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="New Password"
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                            <button className="password-visibility-button" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="password-field">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="Confirm New Password"
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                            <button className="password-visibility-button" type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} aria-pressed={showConfirmPassword}>
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {error && <p className="error" role="alert">{error}</p>}
                        <button className="login-submit-btn" type="submit">Save New Password</button>
                    </form>
                )}
            </section>
        </main>
    );
}
