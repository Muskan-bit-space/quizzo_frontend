import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icons.jsx";
import { EmptyState, ErrorState, Loading } from "../../components/Feedback.jsx";
import { formatDate } from "../../lib/quiz.js";
export default function MyQuizzes({ quizzes, loading, error, reload }) {
  const [search, setSearch] = useState("");
  const visible = quizzes.filter(quiz => quiz.title.toLowerCase().includes(search.toLowerCase()));
  return <section className="my-quizzes"><div className="section-heading"><div><span className="eyebrow">YOUR IDEAS, OUT IN THE WORLD</span><h2>My quizzes <span className="count-badge">{quizzes.length}</span></h2></div><label className="search-field"><Icon name="search" size={18} /><input aria-label="Search your quizzes" placeholder="Find a quiz…" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
    {loading ? <Loading label="Gathering your quizzes…" /> : error ? <ErrorState error={error} onRetry={reload} /> : !quizzes.length ? <EmptyState title="Your first quiz belongs here." description="Start with a question. We'll help you take it from there." to="/crud/createquiz" action="Create a quiz" /> : !visible.length ? <EmptyState title="No matches just yet." description="Try a different title or clear your search." /> : <div className="quiz-grid">{visible.map((quiz, index) => <Link className="quiz-card" key={quiz.id || quiz._id} to={`/crud/quizzes/${quiz.id || quiz._id}`} state={{ quiz }}><div className="quiz-card-top"><span className={`quiz-glyph shade-${index % 3}`}><Icon name="quiz" size={24} /></span><span className={`tag ${quiz.shareId ? "green" : ""}`}>{quiz.shareId ? "Ready to share" : "Saved"}</span></div><h3>{quiz.title}</h3><p>{quiz.description || "A fresh challenge, ready for curious minds."}</p><div className="quiz-card-meta"><span>{quiz.questionCount} questions</span><span>Created {formatDate(quiz.createdAt)}</span></div><div className="quiz-card-footer"><span><Icon name="users" size={16} />{quiz.attemptCount == null ? "View participants" : `${quiz.attemptCount} completed attempts`}</span><Icon name="arrow" size={18} /></div></Link>)}</div>}
  </section>;
}
