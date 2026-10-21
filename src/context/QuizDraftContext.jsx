
import { createContext, useContext, useState } from "react";

const QuizDraftContext = createContext(null);

export function QuizDraftProvider({ children }) {
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        questions: [],
    });

    function updateQuizDetails(field, value) {
        setQuiz((prev) => ({
            ...prev,
            [field]: value,
        }));
        console.log("from the updateQuizDetails function : ", field,": ",value)
    }

    function addQuestion(question) {
        setQuiz((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    ...question,
                    id: crypto.randomUUID(),
                },
            ],
        }));
    }

    function deleteQuestion(questionId) {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.filter(
                (question) => question.id !== questionId
            ),
        }));
    }

    function resetQuiz() {
        setQuiz({
            title: "",
            description: "",
            questions: [],
        });
    }

    return (
        <QuizDraftContext.Provider
            value={{
                quiz,
                updateQuizDetails,
                addQuestion,
                deleteQuestion,
                resetQuiz,
            }}
        >
            {children}
        </QuizDraftContext.Provider>
    );
}

export function useQuizDraft() {
    const context = useContext(QuizDraftContext);

    if (!context) {
        throw new Error(
            "useQuizDraft must be used inside QuizDraftProvider"
        );
    }

    return context;
}
