import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useResource } from "../../hooks/useResource.js";
import Quiz_Handler from "../../api/Quiz_Handler.js";
import { DEMO_MODE } from "../../../config.js";
import { readStorage, writeStorage } from "../../lib/storage.js";
import { errorMessage } from "../../lib/quiz.js";
import { ErrorState, Loading, Notice } from "../../components/Feedback.jsx";
import Icon from "../../components/Icons.jsx";

function Attempt({ attempt, token, userId }) {
  const navigate = useNavigate();
  const key = `quizly:${DEMO_MODE ? "demo" : "live"}:answers:${userId}:${attempt.id}`;
  const [answers, setAnswers] = useState(() => readStorage(key, Object.fromEntries((attempt.answers || []).map(answer => [answer.questionId, answer.optionIndex]))));
  const [index, setIndex] = useState(0); const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [storageFailed, setStorageFailed] = useState(false); const lock = useRef(false);
  const questions = attempt.questions;
  const answered = questions.filter(question => Number.isInteger(answers[question.id]) && answers[question.id] >= 0 && answers[question.id] < question.options.length).length;
  useEffect(() => {
    const saved = writeStorage(key, answers);
    queueMicrotask(() => setStorageFailed(!saved));
  }, [answers, key]);
  useEffect(() => {
    const warn = event => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  async function submit() {
    if (lock.current || answered !== questions.length) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const result = await Quiz_Handler.submitAttempt(attempt.id, questions.map(question => ({ questionId: question.id, optionIndex: answers[question.id] })), token);
      if (result.attempt?.status !== "submitted" || !result.attempt.result) throw new Error("Your submission wasn't confirmed. Your answers are still here; please retry.");
      try { localStorage.removeItem(key); } catch { /* The server result is authoritative. */ }
      navigate(`/attempts/${attempt.id}/result`, { replace: true });
    } catch (cause) { setError(errorMessage(cause)); } finally { lock.current = false; setBusy(false); }
  }
  const question = questions[index];
  return <div className="page player-page"><div className="player-heading"><div><span className="eyebrow">{review ? "ONE LAST LOOK" : "A LITTLE FOCUS. A LITTLE CURIOSITY."}</span><h1>{attempt.quizTitle}</h1></div><span className="tag"><Icon name="clock" size={14} />Self-paced</span></div><div className="quiz-progress"><div><span>{review ? "Review your answers" : `Question ${index + 1} of ${questions.length}`}</span><strong>{answered} / {questions.length} answered</strong></div><progress max={questions.length} value={answered} aria-label="Questions answered" /></div>
    {storageFailed && <Notice kind="error">Your answers can't be saved in this browser. Keep this tab open until you submit.</Notice>}
    {review ? <section className="panel review-panel"><span className="eyebrow">LOOKING GOOD?</span><h2>A moment to double-check.</h2><p className="muted">You can change any answer before submitting. After that, your score is final.</p><ol className="review-list">{questions.map((item, i) => <li key={item.id}><span className="review-index">{String(i + 1).padStart(2, "0")}</span><div><strong>{item.text}</strong><p className={answers[item.id] == null ? "unanswered" : "muted"}>{item.options[answers[item.id]] || "Not answered yet"}</p></div><button disabled={busy} className="btn ghost small-btn" onClick={() => { setIndex(i); setReview(false); }}>Change<span className="visually-hidden"> answer {i + 1}</span></button></li>)}</ol>{answered < questions.length && <Notice>Answer all {questions.length} questions to submit your quiz.</Notice>}<div className="player-actions"><button disabled={busy} className="btn secondary" onClick={() => setReview(false)}><Icon name="back" size={17} />Back to questions</button><button disabled={busy || answered !== questions.length} className="btn primary" onClick={submit}>{busy ? "Submitting answers…" : "Submit & see my score"}<Icon name="arrow" size={17} /></button></div></section> : <section className="panel question-player"><span className="question-kicker">QUESTION {String(index + 1).padStart(2, "0")}</span><h2>{question.text}</h2><fieldset className="player-options"><legend className="visually-hidden">Choose one answer</legend>{question.options.map((option, i) => <label key={i} className={`player-option ${answers[question.id] === i ? "selected" : ""}`}><input type="radio" name={question.id} value={i} checked={answers[question.id] === i} onChange={() => setAnswers(previous => ({ ...previous, [question.id]: i }))} /><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span><span className="selection-circle">{answers[question.id] === i && <Icon name="check" size={14} />}</span></label>)}</fieldset><div className="player-actions"><button className="btn secondary" disabled={index === 0} onClick={() => setIndex(value => value - 1)}><Icon name="back" size={17} />Previous</button><button className="btn primary" onClick={() => index === questions.length - 1 ? setReview(true) : setIndex(value => value + 1)}>{index === questions.length - 1 ? "Review answers" : "Next question"}<Icon name="arrow" size={17} /></button></div></section>}
    {error && <Notice kind="error">{error}</Notice>}
    <nav className="question-dots" aria-label="Jump to question">{questions.map((item, i) => <button key={item.id} disabled={busy} className={`${answers[item.id] != null ? "answered" : ""} ${index === i && !review ? "current" : ""}`} aria-label={`Question ${i + 1}${answers[item.id] != null ? ", answered" : ", unanswered"}`} aria-current={index === i && !review ? "step" : undefined} onClick={() => { setIndex(i); setReview(false); }}>{i + 1}</button>)}</nav><p className="small muted player-note">Your answers stay with this attempt. Go back and change them any time before submitting.</p></div>;
}

export default function QuizPlayer() {
  const { attemptId } = useParams(); const { token, user } = useAuth();
  const resource = useResource(useCallback(() => Quiz_Handler.getAttempt(attemptId, token), [attemptId, token]));
  if (resource.loading) return <Loading label="Getting your questions ready…" />;
  if (resource.error) return <div className="page narrow"><ErrorState error={resource.error} onRetry={resource.reload}><Link className="btn secondary" to="/crud">My workspace</Link></ErrorState></div>;
  const attempt = resource.data?.attempt;
  if (attempt?.status === "submitted") return <Navigate to={`/attempts/${attemptId}/result`} replace />;
  if (!attempt?.questions?.length) return <div className="page narrow"><ErrorState error={new Error("This attempt has no questions. Contact the quiz creator.")} /></div>;
  return <Attempt key={attemptId} attempt={attempt} token={token} userId={user.id} />;
}
