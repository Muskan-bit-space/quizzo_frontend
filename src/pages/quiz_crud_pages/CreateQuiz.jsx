import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuizDraft } from "../../context/quiz-draft-context.js";
import { useAuth } from "../../context/auth-context.js";
import Quiz_Handler from "../../api/Quiz_Handler.js";
import { quizPayload, errorMessage } from "../../lib/quiz.js";
import { EmptyState, Notice } from "../../components/Feedback.jsx";
import Icon from "../../components/Icons.jsx";

export default function CreateQuiz() {
  const { token } = useAuth();
  const { quiz, updateQuizDetails, deleteQuestion, resetQuiz, storageError } = useQuizDraft();
  const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const lock = useRef(false); const navigate = useNavigate();
  async function save(event) {
    event.preventDefault(); if (lock.current) return;
    setError("");
    try { quizPayload(quiz); } catch (cause) { setError(cause.message); return; }
    lock.current = true; setSaving(true);
    try {
      const result = await Quiz_Handler.createQuiz(quiz, token);
      const id = result?.quiz?.id || result?.quiz?._id;
      if (!id) throw new Error("The server did not confirm a saved quiz. Your draft is still here.");
      resetQuiz();
      navigate(`/crud/quizzes/${id}`, { replace: true, state: { quiz: result.quiz, saved: true } });
    } catch (cause) {
      setError(["ECONNABORTED", "ETIMEDOUT"].includes(cause.code) ? "The save timed out. Check My quizzes before retrying; your quiz may already have been saved." : errorMessage(cause));
    } finally { lock.current = false; setSaving(false); }
  }
  return <div className="page builder-page"><button className="back-link" disabled={saving} onClick={() => navigate("/crud")}><Icon name="back" size={17} />My workspace</button><div className="page-heading"><div><span className="eyebrow">A GREAT QUIZ STARTS WITH YOU</span><h1>Make a little challenge.</h1><p className="muted">Add your questions. Pick the right answers. Share the curiosity.</p></div><span className="tag"><i className="live-dot" />Draft</span></div>
    {storageError && <Notice kind="error">Browser storage is unavailable. Keep this tab open so you don't lose your draft.</Notice>}
    <form onSubmit={save} noValidate><fieldset disabled={saving}><div className="builder-layout"><div className="builder-content"><section className="panel"><div className="numbered-heading"><span>01</span><div><h2>Set the scene</h2><p className="muted small">Give your quiz a name and a little context.</p></div></div><div className="stack-form"><label htmlFor="quiz-title">Quiz title <span className="required">*</span></label><input id="quiz-title" placeholder="e.g. JavaScript essentials" maxLength={150} value={quiz.title} onChange={event => updateQuizDetails("title", event.target.value)} /><span className="field-hint">{quiz.title.length}/150</span><label htmlFor="quiz-description">Description <span className="muted small">optional</span></label><textarea id="quiz-description" rows={3} maxLength={2000} placeholder="What will people discover in this quiz?" value={quiz.description} onChange={event => updateQuizDetails("description", event.target.value)} /></div></section>
    <section className="question-section"><div className="section-heading"><div className="numbered-heading"><span>02</span><div><h2>The good questions <span className="count-badge">{quiz.questions.length}</span></h2><p className="muted small">One correct answer. Plenty of possibilities.</p></div></div></div>
    {!quiz.questions.length ? <EmptyState title="A blank canvas for curious minds." description="Add your first question to get this quiz going." /> : <div className="draft-questions">{quiz.questions.map((question, index) => <article className="panel draft-question" key={question.id}><div className="section-heading"><span className="eyebrow">QUESTION {String(index + 1).padStart(2, "0")}</span><div className="button-row"><button type="button" className="icon-button" aria-label={`Edit question ${index + 1}`} onClick={() => navigate(`/crud/createquiz/questions/${question.id}`)}><Icon name="edit" size={17} /></button><button type="button" className="icon-button danger" aria-label={`Delete question ${index + 1}`} onClick={() => deleteQuestion(question.id)}><Icon name="trash" size={17} /></button></div></div><h3>{question.text}</h3><div className="answer-preview">{question.options.map((option, i) => <div key={i} className={i === question.correctOption ? "correct" : ""}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{i === question.correctOption && <Icon name="check" size={16} />}</div>)}</div></article>)}</div>}
    <button type="button" className="add-question" disabled={saving || quiz.questions.length >= 200} onClick={() => navigate("/crud/createquiz/create-question")}><Icon name="plus" />Add a question</button></section></div>
    <aside className="panel builder-sidebar"><span className="eyebrow">THE BIG PICTURE</span><h2>Ready when you are.</h2><div className="summary-line"><span>Questions</span><strong>{quiz.questions.length}</strong></div><div className="summary-line"><span>Scoring</span><strong>1 point each</strong></div><div className="summary-line"><span>Format</span><strong>Self-paced</strong></div><div className="soft-divider" /><p className="muted small">Participants sign in to take your quiz. Each gets their own attempt and final score.</p><p className="muted small">Your draft is saved in this browser, just for your account. You can keep editing until you save the quiz.</p><button className="btn primary full" type="submit">{saving ? "Saving your quiz…" : "Save quiz & get link"}<Icon name="arrow" size={17} /></button><button className="btn ghost full" type="button" onClick={() => { if (window.confirm("Clear this draft and all its questions?")) { resetQuiz(); setError(""); } }}>Reset draft</button></aside></div></fieldset>{error && <Notice kind="error">{error}</Notice>}</form><Link to="/crud" className={saving ? "visually-hidden" : "muted small"}>Your saved quizzes live in your workspace.</Link></div>;
}
