import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
// import RouteCreateQuiz from './RouteCreateQuiz'
const LandingPage = () => {
    const [val,setVal]=useState(0);
    function cqhandler(){
        setVal(1);
    }
    function jqhandler(){
        setVal(2);
    }
    
    function Element(){
        if(val==0){
            return<div>
                Landing Page

                <button onClick={jqhandler}>join quiz</button>
                <button onClick={cqhandler}>create quiz</button>
            </div>
        }
        else if (val==1) {
            return <RouteCreateQuiz/>
        }
        else if (val==2) {
            return <JoinQuiz></JoinQuiz>
        }
        
    }
    const navigate=useNavigate()
  return (
    // <>

        <>
            <button onClick={() => navigate('createquiz')}>create</button>
            <br />
            <button onClick={() => navigate('joinquiz')}>join</button>
        </>
  )
}

export default LandingPage
