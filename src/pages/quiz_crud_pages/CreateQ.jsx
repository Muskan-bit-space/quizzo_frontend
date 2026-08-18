import React from "react";
import { useNavigate } from "react-router-dom";

const CreateQ = () => {
    const navigate=useNavigate();
    return (
        <div>
            <h1>
                question page

            </h1>
            <br />
            <label htmlFor="question">type your q</label>
            <br />

            <input type="text" placeholder="enter your question" />

            <br />

            <label htmlFor="answer">answer</label>
            <br />

            <input type="text" placeholder="enter your answer" />

            <br />

            <button onClick={()=>navigate('/crud/createquiz')}>Done</button>
        </div>
    )
}

export default CreateQ