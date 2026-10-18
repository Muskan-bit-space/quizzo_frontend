
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizDraft } from "../../context/QuizDraftContext.jsx";
// import "./CreateQuiz.css";

const CreateQ = () => {
    const navigate = useNavigate();
    const { addQuestion } = useQuizDraft();

    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctOption, setCorrectOption] = useState(0);
    const [error, setError] = useState("");

    function updateOption(index, value) {
        setOptions((previous) =>
            previous.map((option, i) =>
                i === index ? value : option
            )
        );
    }

    function handleDone(e) {
        e.preventDefault();
        setError("");

        if (!questionText.trim()) {
            setError("Please enter the question.");
            return;
        }

        if (options.some((option) => !option.trim())) {
            setError("Please fill in all four options.");
            return;
        }

        const normalizedOptions = options.map((option) =>
            option.trim()
        );

        if (
            new Set(
                normalizedOptions.map((option) =>
                    option.toLowerCase()
                )
            ).size !== normalizedOptions.length
        ) {
            setError("Each option must be different.");
            return;
        }

        addQuestion({
            text: questionText.trim(),
            options: normalizedOptions,
            correctOption,
        });

        navigate("/crud/createquiz");
    }

    return (
        <main className="quiz-page">
            <header className="quiz-header">
                <button
                    className="back-button"
                    type="button"
                    onClick={() => navigate("/crud/createquiz")}
                >
                    ← Back to quiz
                </button>

                <span className="header-label">
                    QUESTION EDITOR
                </span>
            </header>

            <section className="question-editor-content">
                <div className="page-heading">
                    <div>
                        <p className="eyebrow">ADD TO YOUR QUIZ</p>
                        <h1>Write a question.</h1>
                        <p className="page-subtitle">
                            Make it clear, add the options,
                            and select the correct answer.
                        </p>
                    </div>
                </div>

                <form
                    className="quiz-card question-form"
                    onSubmit={handleDone}
                >
                    <div className="section-heading">
                        <span className="step-number">Q</span>
                        <div>
                            <h2>Question details</h2>
                            <p>Your question and its answer choices.</p>
                        </div>
                    </div>

                    <div className="field-group">
                        <label htmlFor="question-text">
                            Your question <span>*</span>
                        </label>

                        <textarea
                            id="question-text"
                            rows={4}
                            placeholder="e.g. Which keyword declares a constant in JavaScript?"
                            value={questionText}
                            onChange={(e) =>
                                setQuestionText(e.target.value)
                            }
                            autoFocus
                        />
                    </div>

                    <div className="options-heading">
                        <div>
                            <h3>Answer options</h3>
                            <p>
                                Select the radio button beside
                                the correct answer.
                            </p>
                        </div>
                        <span className="required-note">Required</span>
                    </div>

                    <div className="option-editor-list">
                        {options.map((option, index) => (
                            <div
                                className="option-editor"
                                key={index}
                            >
                                <span className="option-letter">
                                    {String.fromCharCode(65 + index)}
                                </span>

                                <input
                                    id={`option-${index}`}
                                    type="text"
                                    placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                                    value={option}
                                    onChange={(e) =>
                                        updateOption(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    aria-label={`Option ${String.fromCharCode(65 + index)}`}
                                />

                                <label
                                    className={`correct-selector ${
                                        correctOption === index
                                            ? "selected"
                                            : ""
                                    }`}
                                    htmlFor={`correct-${index}`}
                                    title="Mark as correct answer"
                                >
                                    <input
                                        id={`correct-${index}`}
                                        type="radio"
                                        name="correct-option"
                                        checked={
                                            correctOption === index
                                        }
                                        onChange={() =>
                                            setCorrectOption(index)
                                        }
                                    />

                                    <span>
                                        {correctOption === index
                                            ? "Correct"
                                            : "Choose"}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className="form-error" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="editor-footer">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/crud/createquiz")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Done — Save question →
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default CreateQ;
