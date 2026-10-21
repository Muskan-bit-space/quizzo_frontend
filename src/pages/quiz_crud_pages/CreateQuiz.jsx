
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useQuizDraft } from "../../context/QuizDraftContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Quiz_Handler from "../../api/Quiz_Handler";

import "./CreateQuiz.css";

export default function CreateQuiz() {
    const navigate = useNavigate();

    const { token } = useAuth();

    const {
        quiz,
        updateQuizDetails,
        deleteQuestion,
        resetQuiz,
    } = useQuizDraft();

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    async function handleFinishQuiz(e) {
        // Prevent the browser's default form submission and page reload.
        e.preventDefault();

        // Prevent duplicate submissions while this request is running.
        if (saving) return;

        setSaveError("");

        // 1. Validate the quiz.
        if (!quiz.title?.trim()) {
            setSaveError("Please enter a title for your quiz.");
            return;
        }

        if (
            !Array.isArray(quiz.questions) ||
            quiz.questions.length === 0
        ) {
            setSaveError(
                "Add at least one question before finishing."
            );
            return;
        }

        if (!token) {
            setSaveError(
                "Your session is missing. Please sign in again."
            );
            return;
        }

        // 2. Prepare only the fields required by the backend.
        const payload = {
            title: quiz.title.trim(),
            description: quiz.description?.trim() || "",
            questions: quiz.questions.map((question) => ({
                text: question.text,
                options: [...question.options],
                correctOption: question.correctOption,
            })),
        };

        try {
            setSaving(true);

            // 3. POST the quiz to the backend.
            // Quiz_Handler sends the request to /api/quizzes.
            const result = await Quiz_Handler.createQuiz(
                payload,
                token
            );

            // Support either an API response using "id"
            // or one exposing MongoDB's "_id".
            const savedQuizId =
                result?.quiz?.id ?? result?.quiz?._id;

            if (!savedQuizId) {
                throw new Error(
                    "The server response did not contain the saved quiz ID."
                );
            }

            // 4. Clear the local draft only after confirmed success.
            resetQuiz();

            // 5. Navigate after the backend confirms the save.
            navigate("/crud", {
                state: {
                    message:
                        result.message || "Quiz saved successfully.",
                    quizId: savedQuizId,
                },
            });
        } catch (error) {
            console.error("Error saving quiz:", error);

            const status = error.response?.status;

            if (status === 401) {
                setSaveError(
                    "Your session expired. Please sign in again."
                );
            } else if (status === 400) {
                setSaveError(
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Some quiz details are invalid. Please check them."
                );
            } else if (
                error.code === "ECONNABORTED" ||
                error.code === "ETIMEDOUT"
            ) {
                setSaveError(
                    "The request timed out. The quiz might already have " +
                    "been saved. Check your saved quizzes before retrying."
                );
            } else {
                setSaveError(
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    "Could not save the quiz. Your draft is still available."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        if (saving) return;

        if (
            window.confirm(
                "Clear the quiz title, description, and all questions?"
            )
        ) {
            resetQuiz();
            setSaveError("");
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

            {/* The form owns the submission event. */}
            <form
                className="qb-container"
                onSubmit={handleFinishQuiz}
                noValidate
            >
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
                                updateQuizDetails(
                                    "title",
                                    e.target.value
                                )
                            }
                        />

                        <span className="qb-field-hint">
                            MAX 150 CHARACTERS
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
                            [
                            {String(
                                quiz.questions.length
                            ).padStart(2, "0")}
                            ]
                        </span>
                    </div>

                    {quiz.questions.length === 0 ? (
                        <div className="qb-empty">
                            <span className="qb-empty-symbol">
                                [ + ]
                            </span>

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
                                    key={question.id ?? index}
                                >
                                    <div className="qb-question-top">
                                        <span className="qb-question-number">
                                            QUESTION_
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <button
                                            type="button"
                                            className="qb-delete-btn"
                                            disabled={saving}
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
                        disabled={saving}
                        onClick={() =>
                            navigate(
                                "/crud/createquiz/create-question"
                            )
                        }
                    >
                        + ADD QUESTION
                    </button>
                </section>

                {saveError && (
                    <p
                        role="alert"
                        className="quiz-save-error"
                    >
                        {saveError}
                    </p>
                )}

                <footer className="qb-footer">
                    <button
                        type="button"
                        className="qb-reset-btn"
                        disabled={saving}
                        onClick={handleReset}
                    >
                        RESET DRAFT
                    </button>

                    <button
                        type="submit"
                        className="qb-finish-btn pulse"
                        disabled={saving}
                    >
                        {saving ? "SAVING..." : "FINISH QUIZ >>"}
                    </button>
                </footer>

                <p className="qb-footer-note">
                    QUIZLY TERMINAL // LOCAL DRAFT MODE
                </p>
            </form>
        </main>
    );
}
