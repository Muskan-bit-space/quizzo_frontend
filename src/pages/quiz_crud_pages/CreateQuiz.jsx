import React , { Router, Routes, Route, useNavigate} from 'react'

const CreateQuiz = () => {

  //////event listener for the create q page rendering

  // const function leadtoqcreatepage() {
  //   r et ur n <
  // }
  const navigate=useNavigate();
  return (

    // <Router>
    //   <Routes>
    //     <Route path="/" elememt="">
    //       path1 
    //     </Route>
    //     <Route path="" elememt="">
    //       path1 
    //     </Route>
    //     {/* <Route path="" elememt="">
    //       path1 
    //     </Route> */}
    //   </Routes>

    // </Router>
    <div>
      create quiz page
      <br />
      <button onClick={navigate("/create-question")}>
        add a question

      </button>
    </div>
  )
}

export default CreateQuiz

/*
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
const Home = () => {
 const navigate = useNavigate();
 return (
   <div>
     <h1>Home Page</h1>
     <button onClick={() => navigate("/about")}>Go to About</button>
   </div>
 );
};
const About = () => {
 const navigate = useNavigate();
 return (
   <div>
     <h1>About Page</h1>
     <button onClick={() => navigate(-1)}>Go Back</button>
   </div>
 );
};
export default function App() {
 return (
   <Router>
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
     </Routes>
   </Router>
 );
}
*/