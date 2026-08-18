import React , {useState,useRef}from 'react'
import Auth_Handler  from '../../api/Auth_Handler';
const SignUp = () => {
  
  const email_ref=useRef("");
  const password_ref=useRef("");
  // const 
  async function signuphandler() {
    const querystr=`/auth/signup?mail=${email_ref.current.value}&pwd=${password_ref.current.value}`;
    //now we have submitted the email and password 
    // now we want to add it in the db and re direct to sigin

    //1. we have submitted the email and password 
    console.log(querystr);
    const a=await Auth_Handler.signup(email_ref.current.value,password_ref.current.value);
    console.log(a);
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">SIGN UP</h2>
      <form className="auth-form" action="#" method="get">
        <div className="form-group">
          <label htmlFor="new-email">Email</label>
          <input id='new-email' type="email" ref={email_ref} placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id='password' type="password" ref={password_ref} placeholder="Enter your password" />
        </div>

        <button type="button" onClick={signuphandler} className="submit-btn">SIGN UP</button>
      </form>
    </div>
  )
}

export default SignUp
