import React , {useState,useRef}from 'react'
import { BACKEND_URL } from "../config";
const SignUp = () => {
  
  const email_ref=useRef("");
  const password_ref=useRef("");
    let authfunction=async(q)=>{
      let d=BACKEND_URL+q;
      let ans= await fetch(d);
      const data = await ans.json();
      console.log("ans")
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
    const a=await authfunction(querystr);
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
    <div>
        SIGNUP
      <form action="#" method="get">

        <label htmlFor="new-email">Email</label>
        <input id='new-email' type="text" ref={email_ref} />


        <label htmlFor="password">Password</label>
        <input id='password' type="text"  ref={password_ref}/>

        <button onClick={signuphandler}>signup</button>
      </form>
    </div>
  )
}

export default SignUp
