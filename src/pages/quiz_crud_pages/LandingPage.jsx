import React from "react";
import { useNavigate } from "react-router-dom";
import MyQuizzes from "./MyQuizzes";
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Landing Page</h1>
      <div className="landing-actions">
        <button onClick={() => navigate("/crud/createquiz")}>
          Create Quiz
        </button>

        <button onClick={() => navigate("/crud/joinquiz")}>
          Join Quiz
        </button>
      </div>
      

      <MyQuizzes/>
    </div>
  );
};

export default LandingPage;
