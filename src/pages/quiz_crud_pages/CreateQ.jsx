import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuizDraft } from "../../context/quiz-draft-context.js";
import { validateQuestion } from "../../lib/quiz.js";
import { EmptyState, Notice } from "../../components/Feedback.jsx";
import Icon from "../../components/Icons.jsx";
export default function CreateQ() {
  const { questionId } = useParams(); const navigate = useNavigate();
  const { quiz, addQuestion, updateQuestion } = useQuizDraft();
  const original = quiz.questions.find(item => item.id === questionId);
  const [text, setText] = useState(original?.text || "");
  const [options, setOptions] = useState(original?.options || ["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(original?.correctOption ?? -1);
  const [error, setError] = useState("");
  if (questionId && !original) return <div className="page"><EmptyState title="That draft question isn't here." description="Return to the builder to add or choose a question." to="/crud/createquiz" action="Back to draft" /></div>;
  function submit(event) {
    event.preventDefault();
    const question = { text, options, correctOption }; const message = validateQuestion(question);
    if (message) { setError(message); return; }
    if (!questionId && quiz.questions.length >= 200) { setError("This quiz already has 200 questions."); return; }
    const clean = { text: text.trim(), options: options.map(option => option.trim()), correctOption };
    if (questionId) updateQuestion(questionId, clean); else addQuestion(clean);
    navigate("/crud/createquiz");
  }
  function removeOption(index) {
    setOptions(items => items.filter((_, i) => i !== index));
    setCorrectOption(current => current === index ? -1 : current > index ? current - 1 : current);
  }
  return <div className="page editor-page"><Link className="back-link" to="/crud/createquiz"><Icon name="back" size={17} />Back to draft</Link><div className="page-heading"><div><span className="eyebrow">{questionId ? "MAKE IT EVEN BETTER" : `QUESTION ${String(quiz.questions.length + 1).padStart(2, "0")}`}</span><h1>{questionId ? "Refine your question." : "What's the question?"}</h1><p className="muted">Keep it clear, make it interesting, and choose one correct answer.</p></div></div><form onSubmit={submit} className="panel question-editor"><div className="stack-form"><label htmlFor="question-text">Your question <span className="required">*</span></label><textarea id="question-text" rows={3} autoFocus maxLength={2000} value={text} onChange={event => setText(event.target.value)} placeholder="e.g. Which keyword declares a constant?" /></div><div className="section-heading options-heading"><div><h2>Answer options</h2><p className="muted small">Use the circle to select the correct answer.</p></div><span className="tag">{options.length} options</span></div><div className="editor-options">{options.map((option, index) => <div className={`editor-option ${correctOption === index ? "selected" : ""}`} key={index}><label className="correct-radio" title={`Mark option ${String.fromCharCode(65 + index)} correct`}><input type="radio" name="correct-option" aria-label={`Mark option ${String.fromCharCode(65 + index)} correct`} checked={correctOption === index} onChange={() => setCorrectOption(index)} /><span>{String.fromCharCode(65 + index)}</span></label><input aria-label={`Option ${String.fromCharCode(65 + index)}`} maxLength={500} value={option} placeholder={`Answer option ${String.fromCharCode(65 + index)}`} onChange={event => setOptions(previous => previous.map((value, i) => i === index ? event.target.value : value))} />{correctOption === index && <span className="correct-label">Correct</span>}<button className="icon-button" type="button" aria-label={`Remove option ${String.fromCharCode(65 + index)}`} disabled={options.length <= 2} onClick={() => removeOption(index)}><Icon name="trash" size={16} /></button></div>)}</div><button className="btn ghost" type="button" disabled={options.length >= 10} onClick={() => setOptions(previous => [...previous, ""])}><Icon name="plus" size={16} />Add an option</button>{error && <Notice kind="error">{error}</Notice>}<div className="editor-footer"><Link className="btn secondary" to="/crud/createquiz">Cancel</Link><button className="btn primary" type="submit">{questionId ? "Update question" : "Add to quiz"}<Icon name="check" size={18} /></button></div><p className="small muted">This saves the question to your draft. Save the whole quiz when you're ready to share.</p></form></div>;
}
