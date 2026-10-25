import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { useQuizDraft } from "../../context/quiz-draft-context.js";
import { useResource } from "../../hooks/useResource.js";
import Quiz_Handler from "../../api/Quiz_Handler.js";
import { displayName } from "../../lib/quiz.js";
import MyQuizzes from "./MyQuizzes.jsx";
import Icon from "../../components/Icons.jsx";
export default function LandingPage() {
  const { token, user } = useAuth();
  const { quiz } = useQuizDraft();
  const resource = useResource(useCallback(() => Quiz_Handler.getMyQuizzes(token), [token]));
  const quizzes = resource.data?.quizzes || [];
  const hasDraft = quiz.title || quiz.questions.length;
  const completed = quizzes.every(item => typeof item.attemptCount === "number") ? quizzes.reduce((sum, item) => sum + item.attemptCount, 0) : "—";
  return <div className="page dashboard"><div className="page-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>Hey {displayName(user).split(" ")[0]},<br className="mobile-only" /> what will you ask today?</h1><p className="muted">A fresh idea, a friendly challenge. It all starts here.</p></div><span className="workspace-badge"><i className="live-dot" /> Stay curious</span></div>
    <div className="action-grid"><Link className="action-card create-action" to="/crud/createquiz"><div className="icon-box"><Icon name="plus" size={24} /></div><div><span className="eyebrow">{hasDraft ? "KEEP THE IDEAS COMING" : "MAKE SOMETHING YOURS"}</span><h2>{hasDraft ? "Continue your draft" : "Create a quiz"}</h2><p>{hasDraft ? quiz.title || "Your unfinished quiz is waiting." : "Turn what you know into a challenge worth sharing."}</p></div><Icon name="arrow" /></Link><Link className="action-card join-action" to="/crud/joinquiz"><div className="icon-box"><Icon name="link" size={24} /></div><div><span className="eyebrow">PUT YOUR KNOWLEDGE TO WORK</span><h2>Join a quiz</h2><p>Have an invite? Drop in the link and give it a go.</p></div><Icon name="arrow" /></Link></div>
    {!resource.loading && !resource.error && <div className="workspace-stats"><span><strong>{quizzes.length}</strong> quizzes created</span><span><strong>{completed}</strong> completed attempts</span><span><Icon name="clock" size={16} /> Always at your own pace</span></div>}
    <MyQuizzes {...resource} quizzes={quizzes} />
  </div>;
}
