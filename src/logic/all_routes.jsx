import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import Welcome from "../pages/Welcome.jsx";
import AuthPage from "../pages/auth pages/AuthPage.jsx";
import SignIn from "../pages/auth pages/SignIn.jsx";
import SignUp from "../pages/auth pages/SignUp.jsx";
import LandingPage from "../pages/quiz_crud_pages/LandingPage.jsx";
import CreateQuiz from "../pages/quiz_crud_pages/CreateQuiz.jsx";
import CreateQ from "../pages/quiz_crud_pages/CreateQ.jsx";
import JoinQuiz from "../pages/quiz_crud_pages/JoinQuiz.jsx";
import QuizDetail from "../pages/quiz_crud_pages/QuizDetail.jsx";
import QuizIntro from "../pages/participation/QuizIntro.jsx";
import QuizPlayer from "../pages/participation/QuizPlayer.jsx";
import QuizResult from "../pages/participation/QuizResult.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { EmptyState } from "../components/Feedback.jsx";
export default function AllRoutes() {
  return <BrowserRouter><a className="skip-link" href="#main-content">Skip to content</a><Routes><Route element={<AppLayout />}>
    <Route path="/" element={<Welcome />} />
    <Route path="/auth" element={<AuthPage />}><Route index element={<Navigate to="signin" replace />} /><Route path="signin" element={<SignIn />} /><Route path="signup" element={<SignUp />} /></Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/crud" element={<LandingPage />} />
      <Route path="/crud/createquiz" element={<CreateQuiz />} />
      <Route path="/crud/createquiz/create-question" element={<CreateQ />} />
      <Route path="/crud/createquiz/questions/:questionId" element={<CreateQ />} />
      <Route path="/crud/joinquiz" element={<JoinQuiz />} />
      <Route path="/crud/quizzes/:quizId" element={<QuizDetail />} />
      <Route path="/q/:shareId" element={<QuizIntro />} />
      <Route path="/attempts/:attemptId" element={<QuizPlayer />} />
      <Route path="/attempts/:attemptId/result" element={<QuizResult />} />
    </Route>
    <Route path="*" element={<div className="page"><EmptyState title="This page took a wrong turn." description="Let's get you back to something good." to="/" action="Back to home" /></div>} />
  </Route></Routes></BrowserRouter>;
}
