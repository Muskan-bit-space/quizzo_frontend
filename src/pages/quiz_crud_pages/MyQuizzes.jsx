import React from "react";
import "./MyQuizzes.css";

const sampleQuizzes = [
  { id: "1", title: "JavaScript Basics" },
  { id: "2", title: "Data Structures" },
  { id: "3", title: "Web Development" },
];

export default function MyQuizzes() {
  const quizzes = sampleQuizzes;

  return (
    <section className="my-quizzes">
      <h2 className="my-quizzes-heading">MY QUIZZES</h2>

      {quizzes.length > 0 ? (
        <div className="my-quizzes-list">
          {quizzes.map((quiz) => (
            <article className="my-quiz-card" key={quiz.id}>
              <span className="my-quiz-index">
                {String(Number(quiz.id)).padStart(2, "0")}
              </span>

              <h3 className="my-quiz-name">{quiz.title}</h3>

              <div className="my-quiz-card-footer">
                <span className="my-quiz-status">
                  {"// QUIZ"}
                </span>

                <span className="my-quiz-arrow" aria-hidden="true">
                  &gt;_
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="my-quizzes-empty">
          <p>{">"} NO_QUIZZES_FOUND</p>
          <span>Create your first quiz to see it here.</span>
        </div>
      )}
    </section>
  );
}