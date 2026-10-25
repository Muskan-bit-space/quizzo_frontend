import { Link } from "react-router-dom";
import { errorMessage } from "../lib/quiz.js";
import Icon from "./Icons.jsx";

export function Loading({ label = "Loading your workspace…" }) {
  return <div className="loading-state" role="status"><span className="spinner" />{label}</div>;
}
export function ErrorState({ error, title = "We couldn't load this", onRetry, children }) {
  return <div className="empty-state error-state" role="alert"><span className="eyebrow">LET'S TRY THAT AGAIN</span><h2>{title}</h2><p>{errorMessage(error)}</p><div className="button-row">{onRetry && <button className="btn secondary" onClick={onRetry}>Try again</button>}{children}</div></div>;
}
export function EmptyState({ title, description, to, action, icon = "quiz" }) {
  return <div className="empty-state"><div className="icon-box"><Icon name={icon} size={28} /></div><h3>{title}</h3><p>{description}</p>{to && <Link className="btn primary" to={to}>{action}<Icon name="arrow" size={16} /></Link>}</div>;
}
export function Notice({ children, kind = "info" }) {
  return <div className={`notice ${kind}`} role={kind === "error" ? "alert" : "status"}>{children}</div>;
}
