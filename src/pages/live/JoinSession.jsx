import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import Session_Handler from "../../api/Session_Handler.js";
import { displayName, errorMessage } from "../../lib/quiz.js";
import { normalizeRoomCode } from "../../lib/live-session.js";
import { Notice } from "../../components/Feedback.jsx";
import { DEMO_MODE } from "../../../config.js";
import "./live.css";

export default function JoinSession() {
  const { user, token } = useAuth();
  const [search] = useSearchParams();
  const [code, setCode] = useState(() => search.get("code") || "");
  const [name, setName] = useState(() => displayName(user));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function join(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const { session } = await Session_Handler.join(normalizeRoomCode(code), name.trim(), token);
      navigate(`/live/${session.id}`);
    } catch (cause) { setError(errorMessage(cause)); setBusy(false); }
  }
  return <div className="page narrow"><Link className="back-link" to="/crud/joinquiz">← Join a quiz</Link><section className="panel join-panel">
    <span className="eyebrow">SAME QUESTIONS, SAME MOMENT</span><h1>Join a live room.</h1><p className="muted">Enter the organiser’s room code before the quiz starts. Your answers stay with your signed-in account.</p>
    {DEMO_MODE ? <Notice>Live rooms require the connected backend. Start the app in normal mode to host or join.</Notice> : <form className="stack-form" onSubmit={join}>
      <label htmlFor="room-code">8-character room code</label><input id="room-code" className="live-code-input" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={8} value={code} onChange={event => setCode(event.target.value.toUpperCase())} required disabled={busy} placeholder="ABCD2345" />
      <label htmlFor="live-name">Display name</label><input id="live-name" maxLength={80} value={name} onChange={event => setName(event.target.value)} required disabled={busy} />
      {error && <Notice kind="error">{error}</Notice>}<button className="btn primary full" disabled={busy}>{busy ? "Joining…" : "Join waiting room"}</button>
    </form>}
    <p className="muted small live-join-link">Already joined? <Link to="/live/host">Open your recent sessions</Link> to reconnect or view results.</p>
  </section></div>;
}
