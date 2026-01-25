import React from 'react'

const SignIn = () => {
  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">SIGN IN</h2>
      <form className="auth-form" action="#" method="get">
        <div className="form-group">
          <label htmlFor="signin-email">Email</label>
          <input id='signin-email' type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label htmlFor="signin-password">Password</label>
          <input id='signin-password' type="password" placeholder="Enter your password" />
        </div>

        <button type="submit" className="submit-btn">SIGN IN</button>
      </form>
    </div>
  )
}

export default SignIn
