import React , {useState,useRef}from 'react'
import { BACKEND_URL } from "../config";
const SignUp = () => {
  
  const email_ref=useRef("");
  const password_ref=useRef("");
    let authfunction=async(email,password)=>{
      let d=BACKEND_URL+`/signup`;
      let ans= await fetch(d,{
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await ans.json();
      console.log("ans",data)
      // console.log(ans)
      return ans;
    }
    
  // const 
  async function signuphandler() {
    const querystr=`/signup?mail=${email_ref.current.value}&pwd=${password_ref.current.value}`
    //now we have submitted the email and password 
    // now we want to add it in the db and re direct to sigin

    //1. we have submitted the email and password 
    console.log(querystr)
    const a=await authfunction(email_ref.current.value,password_ref.current.value);
    // fetch('http://localhost:',BACKEND_URL,querystr,{
    //   method:"POST",
    //   headers:{
    //     Accept:"application/json",
    //     Authorization:"Bearer YOUR_TOKEN",
    //   }
    // })
    
    // fetch('http://localhost:',BACKEND_URL,querystr)
      // .then( ( res ) => console.log( res.text() ) )
      // .catch( (e) =>{
      //   console.log(e)
      // })
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
