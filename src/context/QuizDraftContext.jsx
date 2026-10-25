import { useEffect, useState } from "react";
import { QuizDraftContext } from "./quiz-draft-context.js";
import { readStorage, writeStorage } from "../lib/storage.js";
import { createId } from "../lib/ids.js";

const emptyDraft = () => ({ title: "", description: "", questions: [] });
export function QuizDraftProvider({ children, storageKey }) {
  const [quiz, setQuiz] = useState(() => {
    const saved = readStorage(storageKey, null);
    return saved && typeof saved.title === "string" && typeof saved.description === "string" && Array.isArray(saved.questions) ? saved : emptyDraft();
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const saved = writeStorage(storageKey, quiz);
    // Storage happens after render; only report failures asynchronously.
    queueMicrotask(() => setStorageError(!saved));
  }, [quiz, storageKey]);
  const updateQuizDetails = (field, value) => setQuiz(previous => ({ ...previous, [field]: value }));
  const addQuestion = question => setQuiz(previous => ({ ...previous, questions: [...previous.questions, { ...question, id: createId() }] }));
  const updateQuestion = (id, question) => setQuiz(previous => ({ ...previous, questions: previous.questions.map(item => item.id === id ? { ...question, id } : item) }));
  const deleteQuestion = id => setQuiz(previous => ({ ...previous, questions: previous.questions.filter(question => question.id !== id) }));
  const resetQuiz = () => setQuiz(emptyDraft());
  return <QuizDraftContext.Provider value={{ quiz, storageError, updateQuizDetails, addQuestion, updateQuestion, deleteQuestion, resetQuiz }}>{children}</QuizDraftContext.Provider>;
}
