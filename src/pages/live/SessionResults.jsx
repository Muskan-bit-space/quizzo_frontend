import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useResource } from "../../hooks/useResource.js";
import Session_Handler from "../../api/Session_Handler.js";
import { ErrorState, Loading } from "../../components/Feedback.jsx";
import LiveLeaderboard from "../../components/LiveLeaderboard.jsx";
import "./live.css";

export default function SessionResults() {
  const { sessionId } = useParams(); const { token } = useAuth();
  const resource = useResource(useCallback(() => Session_Handler.results(sessionId, token), [sessionId, token]));
  if (resource.loading) return <Loading label="Loading saved final results…" />;
  if (resource.error) return <div className="page narrow"><ErrorState error={resource.error} onRetry={resource.reload}><Link className="btn secondary" to={`/live/${sessionId}`}>Return to session</Link></ErrorState></div>;
  const { session } = resource.data;
  return <div className="page live-page"><Link className="back-link" to="/live/host">← Your live sessions</Link><span className="eyebrow">THE FINAL SCORES ARE IN</span><h1>{session.quizTitle}</h1><p className="muted">Room {session.roomCode} · {session.participantCount} participants · {session.totalQuestions} questions</p>
    {session.ownResult && <section className="panel live-result"><h2>Your result</h2><strong>{session.ownResult.score} / {session.totalQuestions}</strong><p className="muted">Rank {session.ownResult.rank} · {session.ownResult.correctAnswers} correct answers</p></section>}
    <LiveLeaderboard rows={session.leaderboard} ownId={session.ownResult?.participantId} /><div className="button-row"><Link className="btn primary" to="/live/host">Host another quiz</Link><Link className="btn secondary" to="/live/join">Join another room</Link></div>
  </div>;
}
