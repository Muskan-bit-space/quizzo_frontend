import { useCallback, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useResource } from "../../hooks/useResource.js";
import Quiz_Handler from "../../api/Quiz_Handler.js";
import { displayName, errorMessage } from "../../lib/quiz.js";
import { ErrorState, Loading, Notice } from "../../components/Feedback.jsx";
import Icon from "../../components/Icons.jsx";
import { createId } from "../../lib/ids.js";

export default function QuizIntro() {
  const { shareId } = useParams(); const { token, user } = useAuth(); const navigate = useNavigate();
  const resource = useResource(useCallback(() => Quiz_Handler.getSharedQuiz(shareId, token), [shareId, token]));
  const [starting, setStarting] = useState(false); const [error, setError] = useState(""); const requestId = useRef(null); const lock = useRef(false);
  async function start() {
    if (lock.current) return; lock.current = true; setStarting(true); setError("");
    try {
      requestId.current ||= createId();
      const { attempt } = await Quiz_Handler.startAttempt(shareId, token, requestId.current);
      if (!attempt?.id) throw new Error("We couldn't start an attempt. Please try again.");
      navigate(`/attempts/${attempt.id}`);
    } catch (cause) { setError(errorMessage(cause)); } finally { lock.current = false; setStarting(false); }
  }
  if (resource.loading) return <Loading label="Finding your quiz…" />;
  if (resource.error) return <div className="page narrow"><ErrorState title="This quiz isn't available" error={resource.error} onRetry={resource.reload}><Link className="btn secondary" to="/crud/joinquiz">Try another link</Link></ErrorState></div>;
  const quiz = resource.data.quiz;
  return <div className="page narrow"><Link className="back-link" to="/crud/joinquiz"><Icon name="back" size={17} />Join a quiz</Link><section className="panel quiz-intro"><span className="large-symbol"><Icon name="quiz" size={34} /></span><span className="eyebrow">A CHALLENGE WITH YOUR NAME ON IT</span><h1>{quiz.title}</h1><p className="muted">{quiz.description || "A little curiosity is all you need. Ready to give it a go?"}</p><p className="creator-byline">Created by <strong>{quiz.ownerName || "your quiz host"}</strong></p><div className="intro-facts"><span><Icon name="quiz" />{quiz.questionCount} questions</span><span><Icon name="clock" />At your own pace</span><span><Icon name="trophy" />1 point per correct answer</span></div><div className="attempt-identity"><span className="avatar">{displayName(user).slice(0, 1).toUpperCase()}</span><div><span className="muted small">Taking this quiz as</span><strong>{displayName(user)}</strong></div><Icon name="check" size={18} /></div><p className="small muted">Your name and final score will be visible to the quiz creator. You can review your answers before submitting.</p>{error && <Notice kind="error">{error}</Notice>}<button className="btn primary full large" onClick={start} disabled={starting}>{starting ? "Getting your quiz ready…" : "Let's give it a go"}<Icon name="arrow" /></button></section></div>;
}
