import { useCallback } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useResource } from "../../hooks/useResource.js";
import Quiz_Handler from "../../api/Quiz_Handler.js";
import { ErrorState, Loading } from "../../components/Feedback.jsx";
import { formatDate } from "../../lib/quiz.js";
import Icon from "../../components/Icons.jsx";

export default function QuizResult() {
  const { attemptId } = useParams(); const { token } = useAuth();
  const resource = useResource(useCallback(() => Quiz_Handler.getAttempt(attemptId, token), [attemptId, token]));
  if (resource.loading) return <Loading label="Finding your final score…" />;
  if (resource.error) return <div className="page narrow"><ErrorState error={resource.error} onRetry={resource.reload} /></div>;
  const attempt = resource.data?.attempt;
  if (attempt?.status !== "submitted") return <Navigate to={`/attempts/${attemptId}`} replace />;
  if (!attempt.result) return <div className="page narrow"><ErrorState title="Your result isn't ready yet" error={new Error("Please try loading your score again.")} onRetry={resource.reload} /></div>;
  const { score, totalQuestions, percentage } = attempt.result;
  return <div className="page narrow"><section className="panel result-panel"><div className="result-spark" aria-hidden="true">✳</div><span className="eyebrow">CURIOSITY LOOKS GOOD ON YOU</span><h1>{percentage === 100 ? "You nailed it." : percentage >= 50 ? "Nicely done." : "Every question is a new start."}</h1><p className="muted">You completed <strong>{attempt.quizTitle}</strong>.</p><div className="score-ring" style={{ "--score": `${percentage}%` }}><div><strong>{score}<span>/{totalQuestions}</span></strong><span>correct answers</span></div></div><span className="result-percentage">{percentage}% score</span><p className="result-encouragement">{percentage === 100 ? "A perfect round. That's something to feel good about." : "Keep asking questions. That's where the good stuff starts."}</p><div className="result-receipt"><Icon name="check" size={19} /><div><strong>Your result has been recorded.</strong><p>{attempt.participantName} · {formatDate(attempt.completedAt)}</p><span className="small muted">The quiz creator can see your name and score.</span></div></div><div className="button-row"><Link className="btn primary" to="/crud">My workspace<Icon name="arrow" size={17} /></Link><Link className="btn secondary" to={`/q/${encodeURIComponent(attempt.shareId)}`}>Take it again</Link></div></section></div>;
}
