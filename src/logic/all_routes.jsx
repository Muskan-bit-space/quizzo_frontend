import React from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import CursorFX from '../CursorFX.jsx';

import AuthPage from '../pages/auth pages/AuthPage.jsx'
import SignUp from '../pages/auth pages/SignUp.jsx';
import SignIn from '../pages/auth pages/SignIn.jsx';
import LandingPage from '../pages/quiz_crud_pages/LandingPage.jsx';
import CreateQuiz from '../pages/quiz_crud_pages/CreateQuiz.jsx';
import CreateQ from '../pages/quiz_crud_pages/CreateQ.jsx';
import JoinQuiz from '../pages/quiz_crud_pages/JoinQuiz.jsx';
export default function all_routes(){

    //state variables
    return(
        <Router>
                  <CursorFX />
            
            {/* this wraps the  */}
            <Routes>
                <Route path='/' element={<AuthPage/>}>
                    <Route path='signup' element={<SignUp/>}></Route>
                    <Route path='signin' element={<SignIn/>}></Route>

                    <Route path='crud' element={<LandingPage/>}>
                        <Route path='createquiz' element={<CreateQuiz/>}>
                            <Route path="create-question" element={<CreateQ/>}></Route>

                        </Route>
                    {/* now for adding the element */}
                        <Route path='joinquiz' element={<JoinQuiz/>}>
                        </Route>

                    </Route>


                </Route>

                
            
            </Routes>
        </Router>

    )
    
}