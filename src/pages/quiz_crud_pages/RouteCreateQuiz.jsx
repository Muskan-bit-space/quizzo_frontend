import React, {useNavigate, Router, Routes, Route} from "react";
import CreateQuiz from "./CreateQuiz" 
import CreateQ from "./CreateQ" 
export default  RouteCreateQuiz=()=>{

    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<CreateQuiz/>}> */}
                
                    <Route path="/" element={<CreateQuiz/>}/>
                    <Route path="/create-question" element={<CreateQ/>}/>
                {/* </Route> */}
                {/* <Route path="" element=""/> */}
            </Routes>
        </Router>
    )
}