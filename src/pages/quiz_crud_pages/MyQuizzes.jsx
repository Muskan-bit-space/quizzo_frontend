import React, { useEffect, useState } from "react";
import "./MyQuizzes.css";
import { useAuth } from "../../context/AuthContext";
import Quiz_Handler from "../../api/Quiz_Handler";

export default function MyQuizzes() {
  const { token } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch when a token is present
    if (!token) {
      setQuizzes([]);
      return;
    }

    let cancelled = false;

    async function fetchQuizzes() {
      setLoading(true);
      setError(null);

      try {
        const data = await Quiz_Handler.getMyQuizzes(token);
        if (!cancelled) {
          setQuizzes(data.quizzes ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load quizzes:", err);
          setError("Failed to load your quizzes. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchQuizzes();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <section className="my-quizzes">
      <h2 className="my-quizzes-heading">MY QUIZZES</h2>

      {loading && (
        <div className="my-quizzes-empty">
          <p>{">"} LOADING_QUIZZES...</p>
          <span>Fetching your quizzes from the database.</span>
        </div>
      )}

      {!loading && error && (
        <div className="my-quizzes-empty">
          <p style={{ color: "var(--danger)" }}>{">"} ERROR</p>
          <span style={{ color: "var(--danger)" }}>{error}</span>
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className="my-quizzes-empty">
          <p>{">"} NO_QUIZZES_FOUND</p>
          <span>Create your first quiz to see it here.</span>
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <div className="my-quizzes-list">
          {quizzes.map((quiz, index) => (
            <article className="my-quiz-card" key={String(quiz.id)}>
              <span className="my-quiz-index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="my-quiz-name">{quiz.title}</h3>

              <div className="my-quiz-card-footer">
                <span className="my-quiz-status">
                  {"// "}{quiz.questionCount} Q
                </span>

                <span className="my-quiz-arrow" aria-hidden="true">
                  &gt;_
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}