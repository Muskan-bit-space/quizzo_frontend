import React from 'react'
import { Outlet, Link } from 'react-router-dom';

import SignUp from './SignUp'
import SignIn from './SignIn'
const AuthPage = () => {

  return (
    <div className="auth-container">
      <div className="auth-title">
        <h1 className="glitch" data-text="QUIZZO">QUIZLY</h1>
      </div>
      <nav className="auth-nav">
        <button className="auth-btn pulse">
          <Link to="signup">SIGN UP</Link>
        </button>
        <span className="nav-separator">|</span>
        <button className="auth-btn pulse">
          <Link to="signin">SIGN IN</Link>
        </button>
      </nav>
      <div className="auth-outlet">
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthPage
