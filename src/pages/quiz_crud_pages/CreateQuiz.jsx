
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuizDraft } from "../../context/QuizDraftContext.jsx";
import "./CreateQuiz.css";

export default function CreateQuiz() {
    const navigate = useNavigate();

    const {
        quiz,
        updateQuizDetails,
        deleteQuestion,
        resetQuiz,
    } = useQuizDraft();

    function handleFinishQuiz() {
        if (!quiz.title.trim()) {
            alert("Enter a title for your quiz.");
            return;
        }

        if (quiz.questions.length === 0) {
            alert("Add at least one question before finishing.");
            return;
        }

        // Backend submission will be implemented next.
        console.log("Quiz ready for submission:", quiz);
        alert("Quiz validated. Backend submission is not connected yet.");
    }

    function handleReset() {
        if (
            window.confirm(
                "Clear the quiz title, description, and all questions?"
            )
        ) {
            resetQuiz();
        }
    }

    return (
        <main className="qb-page">
            <header className="qb-header">
                <button
                    type="button"
                    className="qb-back-btn"
                    onClick={() => navigate("/crud")}
                >
                    &lt; DASHBOARD
                </button>

                <span className="qb-system-label">
                    QUIZLY // QUIZ BUILDER
                </span>

                <span className="qb-status">
                    <span className="qb-status-dot" />
                    DRAFT
                </span>
            </header>

            <div className="qb-container">
                <div className="qb-page-title">
                    <p className="qb-terminal-line">
                        {">"} INITIALIZE_NEW_QUIZ
                    </p>

                    <h1 className="glitch" data-text="CREATE QUIZ">
                        CREATE QUIZ
                    </h1>

                    <p className="qb-muted">
                        Configure your quiz, construct your questions,
                        and prepare it for deployment.
                    </p>
                </div>

                <section className="qb-panel">
                    <div className="qb-panel-heading">
                        <span className="qb-step">01</span>

                        <div>
                            <h2>QUIZ CONFIGURATION</h2>
                            <p className="qb-muted">
                                Define the basic information.
                            </p>
                        </div>
                    </div>

                    <div className="qb-field">
                        <label htmlFor="quiz-title">
                            QUIZ_TITLE <span>*</span>
                        </label>

                        <input
                            id="quiz-title"
                            type="text"
                            maxLength={100}
                            placeholder="e.g. JAVASCRIPT_FUNDAMENTALS"
                            value={quiz.title}
                            onChange={(e) =>
                                updateQuizDetails("title", e.target.value)
                            }
                        />

                        <span className="qb-field-hint">
                            MAX 100 CHARACTERS
                        </span>
                    </div>

                    <div className="qb-field">
                        <label htmlFor="quiz-description">
                            QUIZ_DESCRIPTION
                        </label>

                        <textarea
                            id="quiz-description"
                            rows={3}
                            maxLength={500}
                            placeholder="Describe the purpose of this quiz..."
                            value={quiz.description}
                            onChange={(e) =>
                                updateQuizDetails(
                                    "description",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </section>

                <section className="qb-questions-section">
                    <div className="qb-section-title">
                        <div>
                            <p className="qb-terminal-line">
                                {">"} QUESTION_DATABASE
                            </p>

                            <h2>YOUR QUESTIONS</h2>
                        </div>

                        <span className="qb-counter">
                            [{String(quiz.questions.length).padStart(2, "0")}]
                        </span>
                    </div>

                    {quiz.questions.length === 0 ? (
                        <div className="qb-empty">
                            <span className="qb-empty-symbol">[ + ]</span>

                            <h3>NO QUESTIONS FOUND</h3>

                            <p className="qb-muted">
                                Your question database is empty.
                                Initialize your first question to continue.
                            </p>
                        </div>
                    ) : (
                        <div className="qb-question-list">
                            {quiz.questions.map((question, index) => (
                                <article
                                    className="qb-question-card"
                                    key={question.id}
                                >
                                    <div className="qb-question-top">
                                        <span className="qb-question-number">
                                            QUESTION_{String(index + 1).padStart(2, "0")}
                                        </span>

                                        <button
                                            type="button"
                                            className="qb-delete-btn"
                                            onClick={() =>
                                                deleteQuestion(question.id)
                                            }
                                        >
                                            [ DELETE ]
                                        </button>
                                    </div>

                                    <h3 className="qb-question-text">
                                        {question.text}
                                    </h3>

                                    <div className="qb-options-grid">
                                        {question.options.map(
                                            (option, optionIndex) => {
                                                const correct =
                                                    optionIndex ===
                                                    question.correctOption;

                                                return (
                                                    <div
                                                        key={optionIndex}
                                                        className={`qb-option ${
                                                            correct
                                                                ? "qb-option-correct"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span className="qb-option-letter">
                                                            {String.fromCharCode(
                                                                65 + optionIndex
                                                            )}
                                                        </span>

                                                        <span className="qb-option-text">
                                                            {option}
                                                        </span>

                                                        {correct && (
                                                            <span className="qb-correct-tag">
                                                                [ CORRECT ]
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        className="qb-add-btn"
                        onClick={() =>
                            navigate(
                                "/crud/createquiz/create-question"
                            )
                        }
                    >
                        + ADD QUESTION
                    </button>
                </section>

                <footer className="qb-footer">
                    <button
                        type="button"
                        className="qb-reset-btn"
                        onClick={handleReset}
                    >
                        RESET DRAFT
                    </button>

                    <button
                        type="button"
                        className="qb-finish-btn pulse"
                        onClick={handleFinishQuiz}
                    >
                        FINISH QUIZ &gt;&gt;
                    </button>
                </footer>

                <p className="qb-footer-note">
                    QUIZLY TERMINAL // LOCAL DRAFT MODE
                </p>
            </div>
        </main>
    );
}
