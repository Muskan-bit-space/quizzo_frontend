import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import Auth_Handler from "../../api/Auth_Handler.jsx";
import { DEMO_MODE } from "../../../config.js";
import { errorMessage, safeDestination } from "../../lib/quiz.js";
import { Notice } from "../../components/Feedback.jsx";
import Icon from "../../components/Icons.jsx";
export default function SignIn() {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = safeDestination(location.state?.from);
  const [email, setEmail] = useState(location.state?.email || (DEMO_MODE ? "maya@example.com" : ""));
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (user) return <Navigate to={destination} replace />;
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    try { const result = await Auth_Handler.signin(email.trim(), password); await login(result.token); navigate(destination, { replace: true }); }
    catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }
  return <><span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>Welcome back.</h2><p className="muted">{destination.startsWith("/q/") ? "Sign in to take this quiz. We'll bring you right back." : "Your next great question is waiting."}</p>
    {location.state?.registered && <Notice>Account created. Sign in to get started.</Notice>}
    {DEMO_MODE && <Notice>Preview account: maya@example.com. No password is needed in preview mode.</Notice>}
    <form onSubmit={submit} className="stack-form"><fieldset disabled={busy}><label htmlFor="signin-email">Email address</label><input id="signin-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={event => setEmail(event.target.value)} />
    {!DEMO_MODE && <><label htmlFor="signin-password">Password</label><input id="signin-password" type="password" autoComplete="current-password" placeholder="Your password" required value={password} onChange={event => setPassword(event.target.value)} /></>}
    {error && <Notice kind="error">{error}</Notice>}<button className="btn primary full" type="submit">{busy ? "Signing in…" : "Sign in"}<Icon name="arrow" size={18} /></button></fieldset></form>
    <p className="auth-switch">New around here? <Link to="/auth/signup" state={{ from: destination }}>Create an account</Link></p></>;
}
