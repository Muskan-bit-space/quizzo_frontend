import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import Auth_Handler from "../../api/Auth_Handler.jsx";
import { DEMO_MODE } from "../../../config.js";
import { errorMessage, safeDestination } from "../../lib/quiz.js";
import { Notice } from "../../components/Feedback.jsx";
import Icon from "../../components/Icons.jsx";
export default function SignUp() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = safeDestination(location.state?.from);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  if (user) return <Navigate to={destination} replace />;
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    if (!name.trim()) { setError("Enter the name you'd like others to see."); return; }
    setBusy(true); setError("");
    try { await Auth_Handler.signup(email.trim(), password, name.trim()); navigate("/auth/signin", { replace: true, state: { registered: true, email: email.trim(), from: destination } }); }
    catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }
  return <><span className="eyebrow">LET'S MAKE SOMETHING GOOD</span><h2>Your curiosity starts here.</h2><p className="muted">Create quizzes, take a challenge, and see how you did.</p><form className="stack-form" onSubmit={submit}><fieldset disabled={busy}><label htmlFor="signup-name">Your name</label><input id="signup-name" autoComplete="name" placeholder="What should we call you?" maxLength={80} required value={name} onChange={event => setName(event.target.value)} /><label htmlFor="signup-email">Email address</label><input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={event => setEmail(event.target.value)} />
    {!DEMO_MODE && <><label htmlFor="signup-password">Password</label><input id="signup-password" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required value={password} onChange={event => setPassword(event.target.value)} /></>}
    {error && <Notice kind="error">{error}</Notice>}<button className="btn primary full" type="submit">{busy ? "Creating your account…" : "Create account"}<Icon name="arrow" size={18} /></button></fieldset></form><p className="auth-switch">Already part of the club? <Link to="/auth/signin" state={{ from: destination }}>Sign in</Link></p></>;
}
