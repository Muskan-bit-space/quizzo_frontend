
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuizDraft } from "../../context/QuizDraftContext.jsx";
// import "./CreateQuiz.css";

const CreateQuiz = () => {
    const navigate = useNavigate();

    const {
        quiz,
        updateQuizDetails,
        deleteQuestion,
        resetQuiz,
    } = useQuizDraft();

    function handleFinishQuiz() {
        if (!quiz.title.trim()) {
            alert("Please enter a quiz title.");
            return;
        }

        if (quiz.questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }

        // UI-only for now. Backend integration comes next.
        console.log("Quiz draft:", quiz);

        alert(
            "Quiz draft is ready! Database submission is not connected yet."
        );
    }

    function handleStartNewQuiz() {
        resetQuiz();
    }

    return (
        <main className="quiz-page">
            <header className="quiz-header">
                <button
                    className="back-button"
                    onClick={() => navigate("/crud")}
                >
                    ← Dashboard
                </button>

                <span className="header-label">
                    QUIZ BUILDER
                </span>
            </header>

            <section className="quiz-content">
                <div className="page-heading">
                    <div>
                        <p className="eyebrow">CREATE SOMETHING NEW</p>
                        <h1>Build your quiz.</h1>
                        <p className="page-subtitle">
                            Set up your quiz and add questions
                            one at a time.
                        </p>
                    </div>

                    <div className="question-count">
                        <strong>{quiz.questions.length}</strong>
                        <span>
                            {quiz.questions.length === 1
                                ? "Question"
                                : "Questions"}
                        </span>
                    </div>
                </div>

                <section className="quiz-card">
                    <div className="section-heading">
                        <span className="step-number">01</span>
                        <div>
                            <h2>Quiz details</h2>
                            <p>Give your quiz a name and purpose.</p>
                        </div>
                    </div>

                    <div className="field-group">
                        <label htmlFor="quiz-title">
                            Quiz title <span>*</span>
                        </label>

                        <input
                            id="quiz-title"
                            type="text"
                            placeholder="e.g. JavaScript Fundamentals"
                            value={quiz.title}
                            maxLength={100}
                            onChange={(e) =>
                                updateQuizDetails(
                                    "title",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="quiz-description">
                            Description
                        </label>

                        <textarea
                            id="quiz-description"
                            placeholder="What will people learn from this quiz?"
                            rows={3}
                            maxLength={500}
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

                <section className="questions-section">
                    <div className="section-heading">
                        <span className="step-number">02</span>
                        <div>
                            <h2>Your questions</h2>
                            <p>
                                Add questions and choose the
                                correct answer for each.
                            </p>
                        </div>
                    </div>

                    {quiz.questions.length === 0 ? (
                        <div className="empty-questions">
                            <div className="empty-icon">＋</div>
                            <h3>No questions yet</h3>
                            <p>
                                Start with your first question.
                                You can add more whenever you're ready.
                            </p>
                        </div>
                    ) : (
                        <div className="question-list">
                            {quiz.questions.map((question, index) => (
                                <article
                                    className="saved-question"
                                    key={question.id}
                                >
                                    <div className="saved-question-top">
                                        <span className="question-badge">
                                            QUESTION {index + 1}
                                        </span>

                                        <button
                                            className="delete-button"
                                            type="button"
                                            onClick={() =>
                                                deleteQuestion(
                                                    question.id
                                                )
                                            }
                                            aria-label={`Delete question ${index + 1}`}
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <h3>{question.text}</h3>

                                    <div className="saved-options">
                                        {question.options.map(
                                            (option, optionIndex) => {
                                                const isCorrect =
                                                    optionIndex ===
                                                    question.correctOption;

                                                return (
                                                    <div
                                                        key={optionIndex}
                                                        className={`saved-option ${
                                                            isCorrect
                                                                ? "correct-option"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            {String.fromCharCode(
                                                                65 + optionIndex
                                                            )}
                                                        </span>

                                                        <span>
                                                            {option}
                                                        </span>

                                                        {isCorrect && (
                                                            <span className="correct-label">
                                                                Correct
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
                        className="add-question-button"
                        type="button"
                        onClick={() =>
                            navigate(
                                "/crud/createquiz/create-question"
                            )
                        }
                    >
                        <span className="plus-symbol">＋</span>
                        Add a question
                    </button>
                </section>

                <footer className="quiz-footer">
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={handleStartNewQuiz}
                    >
                        Start over
                    </button>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={handleFinishQuiz}
                    >
                        Finish quiz →
                    </button>
                </footer>
            </section>
        </main>
    );
};

export default CreateQuiz;
