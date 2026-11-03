import { useCallback, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useResource } from "../../hooks/useResource.js";
import Quiz_Handler from "../../api/Quiz_Handler.js";
import Session_Handler from "../../api/Session_Handler.js";
import { errorMessage } from "../../lib/quiz.js";
import { EmptyState, ErrorState, Loading, Notice } from "../../components/Feedback.jsx";
import { DEMO_MODE } from "../../../config.js";
import "./live.css";

export default function HostSession() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [quizId, setQuizId] = useState(() => search.get("quizId") || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const resource = useResource(useCallback(async () => {
    if (DEMO_MODE) return { quizzes: [], sessions: [] };
    const [quizzes, sessions] = await Promise.all([Quiz_Handler.getMyQuizzes(token), Session_Handler.list(token)]);
    return { ...quizzes, ...sessions };
  }, [token]));
  async function create(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try { const { session } = await Session_Handler.create(quizId, token); navigate(`/live/${session.id}`); }
    catch (cause) { setError(errorMessage(cause)); setBusy(false); }
  }
  if (DEMO_MODE) return <div className="page narrow"><Notice>Live rooms require the connected backend. Start the app in normal mode to host or join.</Notice></div>;
  if (resource.loading) return <Loading label="Loading your saved quizzes and live rooms…" />;
  if (resource.error) return <div className="page narrow"><ErrorState error={resource.error} onRetry={resource.reload} /></div>;
  const { quizzes = [], sessions = [] } = resource.data;
  return <div className="page narrow live-page"><Link className="back-link" to="/crud">← My workspace</Link>
    <span className="eyebrow">BRING EVERYONE TOGETHER</span><h1>Host a live quiz.</h1><p className="muted">Invite your participants, then start together. Everyone gets 30 seconds per question.</p>
    <section className="panel">{!quizzes.length ? <EmptyState title="Create your first quiz" description="Save a quiz before starting a live room." to="/crud/createquiz" action="Create a quiz" /> : <form className="stack-form" onSubmit={create}>
      <label htmlFor="live-quiz">Choose one of your saved quizzes</label><select id="live-quiz" value={quizId} onChange={event => setQuizId(event.target.value)} required disabled={busy}><option value="">Select a quiz…</option>{quizzes.map(quiz => <option key={quiz.id} value={quiz.id}>{quiz.title} · {quiz.questionCount} questions</option>)}</select>
      {error && <Notice kind="error">{error}</Notice>}<button className="btn primary full" disabled={busy || !quizId}>{busy ? "Creating room…" : "Create live room"}</button>
    </form>}</section>
    <p className="live-join-link"><Link className="btn secondary" to="/live/join">Join with a room code</Link></p>
    <section className="panel"><div className="section-heading"><h2>Your live sessions</h2><button className="btn secondary small-btn" onClick={resource.reload}>Refresh</button></div>
      {!sessions.length ? <p className="muted">Your rooms and results will appear here.</p> : <ul className="live-history">{sessions.map(session => <li key={session.id}><Link to={session.status === "COMPLETED" ? `/live/${session.id}/results` : `/live/${session.id}`}><strong>{session.quizTitle}</strong><span className="muted small">{session.roomCode} · {session.role} · {session.status.replaceAll("_", " ").toLowerCase()}</span></Link></li>)}</ul>}
    </section>
  </div>;
}
