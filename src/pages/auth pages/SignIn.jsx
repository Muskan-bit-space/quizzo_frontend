import React , {useRef} from 'react'
import Auth_Handler from "../../api/Auth_Handler";
import auth from "../../lib/auth";

const SignIn = () => {
  let emailref=useRef()
  let passwordref=useRef()
  async function signin(){
    //take in the inputs of the email and password
    const p=passwordref.current.value
    const e=emailref.current.value
    //now when the submit button is clicked, send the 
    //vals of input email and password into the request
    const response_of_signin_req=await Auth_Handler.signin(e,p);
    console.log(response_of_signin_req)
    //then console log the ans

    //now set this as local storage ka item
    auth.token=response_of_signin_req.data.token;
    
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">SIGN IN</h2>
      <form className="auth-form" action="#" method="get">
        <div className="form-group">
          <label htmlFor="signin-email">Email</label>
          <input id='signin-email' type="email" placeholder="Enter your email" ref={emailref}/>
        </div>

        <div className="form-group">
          <label htmlFor="signin-password">Password</label>
          <input id='signin-password' type="password" placeholder="Enter your password" ref={passwordref}/>
        </div>

        <button  className="submit-btn" onClick={signin}>SIGN IN</button>
        {/* <button type="submit" className="submit-btn" onClick={signin}>SIGN IN</button> */}
      </form>
    </div>
  )
}

export default SignIn
