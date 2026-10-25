import { Outlet } from "react-router-dom";
import Icon from "../../components/Icons.jsx";
export default function AuthPage() {
  return <div className="auth-page page"><aside className="auth-story"><span className="eyebrow">WELCOME TO YOUR NEXT AHA.</span><h1>A curious mind<br />looks good on you.</h1><p>Make something worth asking.<br />Discover something worth knowing.</p><div className="auth-quote"><Icon name="quiz" size={32} /><p>One account for creating quizzes, joining challenges, and keeping track of every result.</p></div><div className="auth-decoration" aria-hidden="true">?</div></aside><section className="auth-card panel"><Outlet /></section></div>;
}
