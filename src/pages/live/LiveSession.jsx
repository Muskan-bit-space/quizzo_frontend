import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useLiveSession } from "../../hooks/useLiveSession.js";
import { remainingSeconds } from "../../lib/live-session.js";
import { Notice, Loading } from "../../components/Feedback.jsx";
import LiveLeaderboard from "../../components/LiveLeaderboard.jsx";
import { DEMO_MODE } from "../../../config.js";
import "./live.css";

function Countdown({ deadline, offset }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const interval = setInterval(() => setNow(Date.now()), 200); return () => clearInterval(interval); }, []);
  const remaining = remainingSeconds(deadline, now + offset);
  return <span className={`live-countdown ${remaining <= 5 ? "danger" : ""}`} aria-label={`${remaining} seconds remaining`}>{remaining}<small>seconds</small></span>;
}
function ActiveQuestion({ session, connection, command, offset }) {
  const [selected, setSelected] = useState(null);
  const [accepted, setAccepted] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const interval = setInterval(() => setNow(Date.now()), 200); return () => clearInterval(interval); }, []);
  const ownAnswer = session.ownAnswer || accepted;
  const disabled = session.role === "organiser" || connection !== "connected" || busy || !!ownAnswer || remainingSeconds(session.questionEndsAt, now + offset) === 0;
  async function submit(event) {
    event.preventDefault();
    if (disabled || selected === null) return;
    setBusy(true); setError("");
    try { const { answer } = await command("answer:submit", { questionId: session.question.id, optionIndex: selected }); setAccepted(answer); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }
  return <section className="panel question-player"><div className="section-heading"><span className="question-kicker">QUESTION {session.currentQuestionIndex + 1} OF {session.totalQuestions}</span><Countdown deadline={session.questionEndsAt} offset={offset} /></div><h2>{session.question.text}</h2>
    {session.role === "organiser" ? <><ol className="live-host-options">{session.question.options.map((option, index) => <li key={index}>{option}</li>)}</ol><p className="muted">{session.answeredCount || 0} of {session.participantCount} participants have answered.</p></> : <form onSubmit={submit}><fieldset disabled={disabled} className="player-options"><legend className="sr-only">Choose one answer</legend>
      {session.question.options.map((option, index) => <label className={`player-option ${(ownAnswer?.optionIndex ?? selected) === index ? "selected" : ""}`} key={index}><input type="radio" name={`answer-${session.question.id}`} checked={(ownAnswer?.optionIndex ?? selected) === index} onChange={() => setSelected(index)} /><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span><span className="selection-circle" /></label>)}
    </fieldset>{error && <Notice kind="error">{error}</Notice>}{ownAnswer ? <Notice kind="success">Your answer is recorded. Waiting for the next question.</Notice> : <div className="player-actions"><p className="muted small">Your submitted answer is final.</p><button className="btn primary" disabled={disabled || selected === null}>{busy ? "Recording…" : "Submit answer"}</button></div>}
    {remainingSeconds(session.questionEndsAt, now + offset) === 0 && !ownAnswer && <Notice>The question has closed. Waiting for the server to advance.</Notice>}</form>}
  </section>;
}
function HostControls({ session, command, connected }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  async function send(event) {
    if (busy) return;
    setBusy(true); setError("");
    try { await command(event); setConfirmCancel(false); } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  return <div className="live-controls">{error && <Notice kind="error">{error}</Notice>}<div className="button-row">
    {session.status === "WAITING" && <button className="btn primary" disabled={busy || !connected} onClick={() => send("session:start")}>{busy ? "Starting…" : "Start quiz"}</button>}
    {confirmCancel ? <><span className="muted small">End this room and stop accepting answers?</span><button className="btn secondary danger" disabled={busy || !connected} onClick={() => send("session:cancel")}>Confirm cancellation</button><button className="btn ghost" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep room</button></> : <button className="btn ghost" disabled={busy || !connected} onClick={() => setConfirmCancel(true)}>Cancel room</button>}
  </div></div>;
}
export default function LiveSession() {
  const { sessionId } = useParams();
  return <LiveSessionView key={sessionId} sessionId={sessionId} />;
}
function LiveSessionView({ sessionId }) {
  const { token, logout } = useAuth();
  const live = useLiveSession(sessionId, token);
  const [copy, setCopy] = useState("");
  if (DEMO_MODE) return <div className="page narrow"><Notice>Live rooms require the connected backend. Start the app in normal mode to host or join.</Notice></div>;
  const session = live.session;
  if (session?.status === "COMPLETED") return <Navigate to={`/live/${sessionId}/results`} replace />;
  async function copyInvite() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/live/join?code=${session.roomCode}`); setCopy("Invite link copied."); }
    catch { setCopy("Copy the room code above to invite participants."); }
  }
  return <div className="page live-page"><Link className="back-link" to="/live/host">← Your live sessions</Link><div className="live-status" role="status"><span className={`live-dot ${live.connection === "connected" ? "" : "live-offline"}`} />{live.connection === "connected" ? "Connected" : live.connection === "unauthorized" ? "Sign in again to reconnect" : "Reconnecting…"}{live.connection !== "connected" && <button className="btn ghost small-btn" onClick={live.reconnect}>Reconnect</button>}</div>
    {live.error && <Notice kind="error">{live.error}{live.connection === "unauthorized" && <button className="btn ghost small-btn" onClick={logout}>Sign in again</button>}</Notice>}
    {!session ? live.error ? <p className="muted">Check your account or open the room from your recent sessions.</p> : <Loading label="Synchronizing the live room…" /> : <>
      <div className="page-heading"><div><span className="eyebrow">{session.role === "organiser" ? "YOUR LIVE ROOM" : "LIVE QUIZ"}</span><h1>{session.quizTitle}</h1><p className="muted">{session.participantCount} participants · {session.totalQuestions} questions</p></div><span className="tag green">{session.status.replaceAll("_", " ")}</span></div>
      {live.connection !== "connected" && <Notice>The quiz continues while you reconnect. Your recorded answers are saved.</Notice>}
      {session.status === "CANCELLED" ? <section className="panel"><h2>This room was cancelled.</h2><p className="muted">The organiser ended the session. No more answers will be accepted.</p><Link className="btn secondary" to="/live/host">Your live sessions</Link></section> : <>
        {session.status === "WAITING" ? <section className="panel live-waiting"><span className="eyebrow">ROOM CODE</span><strong className="live-room-code">{session.roomCode}</strong><div className="button-row"><button className="btn secondary" onClick={copyInvite}>Copy invite link</button><span role="status" className="muted small">{copy}</span></div>
          {session.role === "organiser" ? <><h2>Waiting room</h2>{!session.participants.length ? <p className="muted">Share the code. Participants appear here as they join.</p> : <ul className="live-roster">{session.participants.map(p => <li key={p.id}><span className="avatar">{p.displayName.slice(0, 1).toUpperCase()}</span><strong>{p.displayName}</strong><span className="muted small">{p.connected ? "connected" : "offline"}</span></li>)}</ul>}</> : <><h2>You’re in, {session.participantName}.</h2><p className="muted">Waiting for the organiser to start. Keep this page open. Each question lasts 30 seconds.</p></>}
        </section> : <ActiveQuestion key={session.question.id} session={session} connection={live.connection} command={live.command} offset={live.serverOffset} />}
        {session.role === "organiser" && <><HostControls session={session} command={live.command} connected={live.connection === "connected"} /><LiveLeaderboard rows={session.leaderboard} /></>}
      </>}
    </>}
  </div>;
}
