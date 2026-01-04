import React ,{useState} from 'react'
import CreateQuiz from './CreateQuiz'
import JoinQuiz from './JoinQuiz'
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
            return <CreateQuiz></CreateQuiz>
        }
        else if (val==2) {
            return <JoinQuiz></JoinQuiz>
        }
        
    }
  return (
    <>
        <Element/>
    </>
  )
}

export default LandingPage
