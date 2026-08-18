import React ,{useState} from 'react'
import CreateQuiz from './CreateQuiz'
import JoinQuiz from './JoinQuiz'
import RouteCreateQuiz from './RouteCreateQuiz'
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
  return (
    // <>
    //     <Element/>
    // </>

    <Router>
            <Routes>
                {/* <Route path="/" element={<CreateQuiz/>}> */}
                
                    <Route path="/create-quiz" element={<RouteCreateQuiz/>}/>
                    <Route path="/join-question" element={<JoinQuiz/>}/>
                {/* </Route> */}
                {/* <Route path="" element=""/> */}
            </Routes>
        </Router>
  )
}

export default LandingPage
