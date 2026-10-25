import { useCallback, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useResource } from "../../hooks/useResource.js";
import Quiz_Handler from "../../api/Quiz_Handler.js";
import { formatDate } from "../../lib/quiz.js";
import { EmptyState, ErrorState, Loading, Notice } from "../../components/Feedback.jsx";
import SharePanel from "../../components/SharePanel.jsx";
import Icon from "../../components/Icons.jsx";

function Results({ quizId, token }) {
  const { data, loading, error, reload } = useResource(useCallback(() => Quiz_Handler.getAttempts(quizId, token), [quizId, token]));
  const [search, setSearch] = useState(""); const [sort, setSort] = useState("recent");
  if (loading) return <Loading label="Loading participant results…" />;
  if (error) return <ErrorState title="Results couldn't be loaded" error={error} onRetry={reload} />;
  const attempts = data?.attempts || [];
  const average = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length) : null;
  const visible = attempts.filter(attempt => attempt.participantName.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === "score" ? b.percentage - a.percentage : new Date(b.completedAt) - new Date(a.completedAt));
  return <><div className="stat-grid"><div className="stat-card"><Icon name="users" /><strong>{new Set(attempts.map(attempt => attempt.userId)).size}</strong><span>participants</span></div><div className="stat-card"><Icon name="check" /><strong>{attempts.length}</strong><span>completed attempts</span></div><div className="stat-card"><Icon name="trophy" /><strong>{average == null ? "—" : `${average}%`}</strong><span>average score</span></div></div><section className="panel results-panel"><div className="section-heading"><div><span className="eyebrow">EVERY ATTEMPT TELLS A STORY</span><h2>Participants & scores</h2></div><button className="btn secondary small-btn" onClick={reload}>Refresh</button></div>
    {!attempts.length ? <EmptyState icon="users" title="Your audience is on its way." description="Share your link. Completed attempts and scores will appear here." /> : <><div className="results-toolbar"><label className="search-field"><Icon name="search" size={17} /><input aria-label="Search participants" placeholder="Find a participant…" value={search} onChange={event => setSearch(event.target.value)} /></label><label className="sort-label">Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="recent">Most recent</option><option value="score">Highest score</option></select></label></div><div className="table-scroll"><table><thead><tr><th>Participant</th><th>Score</th><th>Performance</th><th>Completed</th></tr></thead><tbody>{visible.map(attempt => <tr key={attempt.id}><td><div className="participant"><span className="avatar">{attempt.participantName.slice(0, 1).toUpperCase()}</span><strong>{attempt.participantName}</strong></div></td><td><span className="score-pill">{attempt.score}<span> / {attempt.totalQuestions}</span></span></td><td><div className="performance"><span className="mini-progress"><i style={{ width: `${attempt.percentage}%` }} /></span>{attempt.percentage}%</div></td><td className="muted">{formatDate(attempt.completedAt)}</td></tr>)}</tbody></table>{!visible.length && <p className="empty-search">No participants match that name.</p>}</div><p className="muted small table-note">Each row is a completed attempt. A participant may take the quiz more than once.</p></>}
  </section></>;
}

export default function QuizDetail() {
  const { quizId } = useParams(); const { token } = useAuth(); const location = useLocation();
  const resource = useResource(useCallback(() => Quiz_Handler.getQuiz(quizId, token), [quizId, token]));
  if (resource.loading) return <Loading label="Opening your quiz…" />;
  if (resource.error) return <div className="page"><ErrorState error={resource.error} onRetry={resource.reload}><Link to="/crud" className="btn secondary">My workspace</Link></ErrorState></div>;
  const quiz = resource.data.quiz;
  return <div className="page detail-page"><Link className="back-link" to="/crud"><Icon name="back" size={17} />My quizzes</Link>{location.state?.saved && <Notice kind="success"><Icon name="check" size={17} />Quiz saved. {quiz.shareId ? "Your link is ready to share." : "You'll find it in My quizzes."}</Notice>}<div className="page-heading"><div><span className="eyebrow">YOUR QUIZ, AT A GLANCE</span><h1>{quiz.title}</h1><p className="muted">{quiz.description || "A challenge worth sharing."}</p><div className="inline-meta"><span><Icon name="quiz" size={16} />{quiz.questionCount} questions</span><span>Created {formatDate(quiz.createdAt)}</span></div></div><span className={`tag ${quiz.shareId ? "green" : ""}`}>{quiz.shareId ? "Ready to share" : "Saved"}</span></div><SharePanel quiz={quiz} /><Results quizId={quizId} token={token} />{quiz.questions?.length > 0 && <details className="panel owner-questions"><summary>Review quiz questions <span>{quiz.questions.length} questions</span></summary><ol>{quiz.questions.map(question => <li key={question.id || question._id}><strong>{question.text}</strong><p className="muted small">Correct answer: {question.options[question.correctOption]}</p></li>)}</ol></details>}</div>;
}
