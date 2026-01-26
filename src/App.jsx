// import env from '../../backend/env'
import { useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
import AuthPage from './auth pages/AuthPage'
import SignUp from './auth pages/SignUp';
import SignIn from './auth pages/SignIn';
import LandingPage from './quiz_crud_pages/LandingPage';
import CreateQuiz from './quiz_crud_pages/CreateQuiz';
import JoinQuiz from './quiz_crud_pages/JoinQuiz';
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { BACKEND_URL } from "../config";

import {io} from "socket.io-client"
import { useEffect } from 'react';
import CursorFX from './CursorFX.jsx';
//req  bhejo to backend for hte socket connection


// import SignIn
function App() {
  const [socket,setSocket]=useState(null);
  const [auth_option,setAuth_option]=useState(null)
    useEffect(()=>{
    const s=io(BACKEND_URL);
    setSocket(s);
    return ()=>s.disconnect()  //cleanup function
  },[])

  useEffect(()=>{
    if(!socket)return;
    socket.emit('join-quiz','i wanna join the quiz');
  },[socket])


  function signuphandler() {
    return <SignUp/>
  }
  return (
    <Router>
      <CursorFX />
      <Routes>
        <Route path='/' element={<AuthPage/>}>
          <Route path='signup' element={<SignUp/>}></Route>
          <Route path='signin' element={<SignIn/>}></Route>
        </Route>

        <Route path='/crud' element={<LandingPage/>}>
          <Route path='createquiz' element={<CreateQuiz/>}></Route>
          <Route path='joinquiz' element={<JoinQuiz/>}></Route>
        </Route>

        
      </Routes>
       {/* <AuthPage/> */}
    </Router>
  )
}
  
export default App
