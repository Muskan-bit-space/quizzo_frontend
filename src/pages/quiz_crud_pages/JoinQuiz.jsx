import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseShareCode } from "../../lib/quiz.js";
import { Notice } from "../../components/Feedback.jsx";
import Icon from "../../components/Icons.jsx";
export default function JoinQuiz() {
  const [value, setValue] = useState(""); const [error, setError] = useState("");
  const navigate = useNavigate();
  function submit(event) { event.preventDefault(); try { navigate(`/q/${encodeURIComponent(parseShareCode(value))}`); } catch (cause) { setError(cause.message); } }
  return <div className="page narrow"><Link className="back-link" to="/crud"><Icon name="back" size={17} />My workspace</Link><section className="panel join-panel"><div className="large-symbol"><Icon name="link" size={34} /></div><span className="eyebrow">AN INVITATION TO BE CURIOUS</span><h1>You're one link away.</h1><p className="muted">Paste a quiz link or enter the code shared by its creator.</p><form onSubmit={submit} className="stack-form"><label htmlFor="quiz-code">Quiz link or code</label><input id="quiz-code" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="e.g. JSBASICS or https://…/q/…" value={value} onChange={event => { setValue(event.target.value); setError(""); }} required />{error && <Notice kind="error">{error}</Notice>}<button className="btn primary full" type="submit">Find my quiz <Icon name="arrow" /></button></form><div className="soft-divider" /><p className="small muted"><Icon name="clock" size={15} /> No rush. Take the quiz at your own pace.</p></section></div>;
}
