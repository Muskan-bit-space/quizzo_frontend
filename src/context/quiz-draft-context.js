import { createContext, useContext } from "react";
export const QuizDraftContext = createContext(null);
export function useQuizDraft() {
  const value = useContext(QuizDraftContext);
  if (!value) throw new Error("useQuizDraft requires QuizDraftProvider");
  return value;
}
