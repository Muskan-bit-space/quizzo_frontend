import { useState } from "react";
import { Link } from "react-router-dom";
import { DEMO_MODE } from "../../config.js";
import { shareUrl } from "../lib/quiz.js";
import Icon from "./Icons.jsx";

export default function SharePanel({ quiz }) {
  const [message, setMessage] = useState("");
  const url = shareUrl(quiz.shareId);
  async function copy() {
    try { await navigator.clipboard.writeText(url); setMessage("Link copied. Ready to share!"); }
    catch { setMessage("Select the link below and copy it manually."); }
  }
  return <section className="panel share-panel"><div className="section-heading"><div><span className="eyebrow">INVITE SOME CURIOUS MINDS</span><h2>One link. Everyone's invited.</h2></div><Icon name="link" size={26} /></div>
    <p>Participants sign in, answer at their own pace, and see their score. Their results appear here.</p>
    {url ? <><div className="copy-field"><input aria-label="Shareable quiz link" readOnly value={url} onFocus={event => event.target.select()} /><button className="btn primary" onClick={copy}><Icon name="copy" size={17} />Copy link</button></div><div className="share-meta"><span>Quiz code <strong>{quiz.shareId}</strong></span><Link to={`/q/${encodeURIComponent(quiz.shareId)}`}>Open quiz <Icon name="arrow" size={15} /></Link></div><p className="copy-status" role="status">{message}</p>{DEMO_MODE && <p className="muted small">Preview links work only in this browser. Use normal mode with the backend to share quizzes across devices.</p>}</> : <div className="notice">The share link couldn't be loaded. Refresh this page to try again.</div>}
  </section>;
}
