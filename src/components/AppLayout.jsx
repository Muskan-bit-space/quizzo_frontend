import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";
import { DEMO_MODE } from "../../config.js";
import { displayName } from "../lib/quiz.js";
import Icon from "./Icons.jsx";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return <>
    {DEMO_MODE && <div className="preview-banner">UI preview · Sample accounts and results stay in this browser. Authentication is simulated.</div>}
    <header className="site-header"><div className="header-inner"><Link className="brand" to="/" aria-label="Quizly home"><span className="brand-mark">Q<span>↗</span></span>quizly<span className="brand-dot">.</span></Link>
      <nav aria-label="Main navigation">{user ? <><NavLink to="/crud" end>My workspace</NavLink><NavLink to="/crud/joinquiz">Join a quiz</NavLink><div className="account"><span className="avatar">{displayName(user).slice(0, 1).toUpperCase()}</span><span className="account-name">{displayName(user)}</span><button className="icon-button" aria-label="Sign out" title="Sign out" onClick={() => { logout(); navigate("/"); }}><Icon name="logout" size={17} /></button></div></> : <><NavLink to="/auth/signin">Sign in</NavLink><Link className="btn primary small-btn" to="/auth/signup">Create account <Icon name="arrow" size={15} /></Link></>}</nav>
    </div></header>
    <main id="main-content"><Outlet /></main>
    <footer className="site-footer"><span>quizly. <span className="muted">A little curiosity goes a long way.</span></span><span className="footer-status"><i /> Made for curious minds</span></footer>
  </>;
}
