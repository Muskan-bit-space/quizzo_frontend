
import axios_instance from "./axios";
import { BACKEND_URL } from "../config";
const Quiz_Handler = {
  async createQuiz(quiz, token) {
    if (!token) {
      throw new Error("You must be signed in to save a quiz.");
    }

    const payload = {
      title: quiz.title.trim(),
      description: (quiz.description || "").trim(),
      questions: quiz.questions.map((question) => ({
        text: question.text.trim(),
        options: question.options.map((option) => option.trim()),
        correctOption: question.correctOption,
      })),
    };
    console.log("request is gonna be sent for quiz saving now...", payload)
    const response = await axios_instance({
        method: "post",
        url: "/api/quizzes",
        data:payload,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    console.log("response to quiz save request is : ", response.data)

    return response.data;
  },

  async getMyQuizzes(token) {
    if (!token) {
      throw new Error("You must be signed in to fetch your quizzes.");
    }

    const response = await axios_instance({
      method: "get",
      url: "/api/quizzes",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { quizzes: [...] }
  },
};

export default Quiz_Handler;
