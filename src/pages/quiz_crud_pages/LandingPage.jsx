import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Landing Page</h1>

      <button onClick={() => navigate("/crud/createquiz")}>
        Create Quiz
      </button>

      <button onClick={() => navigate("/crud/joinquiz")}>
        Join Quiz
      </button>
    </div>
  );
};

export default LandingPage;
