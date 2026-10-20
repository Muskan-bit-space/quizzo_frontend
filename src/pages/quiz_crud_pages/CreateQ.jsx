
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizDraft } from "../../context/QuizDraftContext.jsx";
import "./CreateQuiz.css";

export default function CreateQ() {
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
            setError("QUESTION TEXT IS REQUIRED.");
            return;
        }

        if (options.some((option) => !option.trim())) {
            setError("ALL FOUR ANSWER OPTIONS ARE REQUIRED.");
            return;
        }

        const cleanedOptions = options.map((option) => option.trim());

        const uniqueOptions = new Set(
            cleanedOptions.map((option) => option.toLowerCase())
        );

        if (uniqueOptions.size !== cleanedOptions.length) {
            setError("DUPLICATE OPTIONS DETECTED. USE UNIQUE ANSWERS.");
            return;
        }

        addQuestion({
            text: questionText.trim(),
            options: cleanedOptions,
            correctOption,
        });

        navigate("/crud/createquiz");
    }

    return (
        <main className="qb-page">
            <header className="qb-header">
                <button
                    type="button"
                    className="qb-back-btn"
                    onClick={() => navigate("/crud/createquiz")}
                >
                    &lt; BACK TO QUIZ
                </button>

                <span className="qb-system-label">
                    QUIZLY // QUESTION EDITOR
                </span>

                <span className="qb-status">
                    <span className="qb-status-dot" />
                    EDIT MODE
                </span>
            </header>

            <div className="qb-container qb-editor-container">
                <div className="qb-page-title">
                    <p className="qb-terminal-line">
                        {">"} NEW_QUESTION --CREATE
                    </p>

                    <h1 className="glitch" data-text="QUESTION EDITOR">
                        QUESTION EDITOR
                    </h1>

                    <p className="qb-muted">
                        Enter your question, configure the answer options,
                        and identify the correct response.
                    </p>
                </div>

                <form className="qb-panel" onSubmit={handleDone}>
                    <div className="qb-panel-heading">
                        <span className="qb-step">Q</span>

                        <div>
                            <h2>QUESTION INPUT</h2>
                            <p className="qb-muted">
                                All fields marked with * are required.
                            </p>
                        </div>
                    </div>

                    <div className="qb-field">
                        <label htmlFor="question-text">
                            QUESTION_TEXT <span>*</span>
                        </label>

                        <textarea
                            id="question-text"
                            rows={4}
                            maxLength={1000}
                            placeholder="Enter your question here..."
                            value={questionText}
                            onChange={(e) =>
                                setQuestionText(e.target.value)
                            }
                            autoFocus
                        />
                    </div>

                    <div className="qb-answer-heading">
                        <div>
                            <h2>ANSWER_OPTIONS</h2>
                            <p className="qb-muted">
                                Select one option as the correct answer.
                            </p>
                        </div>

                        <span className="qb-required-label">
                            4 OPTIONS
                        </span>
                    </div>

                    <div className="qb-editor-options">
                        {options.map((option, index) => {
                            const letter = String.fromCharCode(65 + index);
                            const selected = correctOption === index;

                            return (
                                <div
                                    className={`qb-editor-option ${
                                        selected ? "qb-editor-option-selected" : ""
                                    }`}
                                    key={index}
                                >
                                    <span className="qb-option-letter">
                                        {letter}
                                    </span>

                                    <input
                                        id={`option-${index}`}
                                        type="text"
                                        maxLength={300}
                                        placeholder={`OPTION_${letter}`}
                                        value={option}
                                        onChange={(e) =>
                                            updateOption(index, e.target.value)
                                        }
                                        aria-label={`Option ${letter}`}
                                    />

                                    <label
                                        htmlFor={`correct-${index}`}
                                        className="qb-correct-selector"
                                    >
                                        <input
                                            id={`correct-${index}`}
                                            type="radio"
                                            name="correct-option"
                                            checked={selected}
                                            onChange={() =>
                                                setCorrectOption(index)
                                            }
                                        />

                                        <span>
                                            {selected
                                                ? "CORRECT"
                                                : "SELECT"}
                                        </span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>

                    <div className="qb-answer-hint">
                        <span className="qb-status-dot" />
                        SELECTED ANSWER: OPTION{" "}
                        {String.fromCharCode(65 + correctOption)}
                    </div>

                    {error && (
                        <p className="qb-error" role="alert">
                            [ ERROR ] {error}
                        </p>
                    )}

                    <div className="qb-editor-footer">
                        <button
                            type="button"
                            className="qb-reset-btn"
                            onClick={() =>
                                navigate("/crud/createquiz")
                            }
                        >
                            CANCEL
                        </button>

                        <button
                            type="submit"
                            className="qb-finish-btn"
                        >
                            DONE — SAVE QUESTION &gt;&gt;
                        </button>
                    </div>
                </form>

                <p className="qb-footer-note">
                    QUIZLY TERMINAL // QUESTION DATA IS NOT YET PERSISTED
                </p>
            </div>
        </main>
    );
}
