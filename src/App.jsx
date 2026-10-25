import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./context/auth-context.js";
import { QuizDraftProvider } from "./context/QuizDraftContext.jsx";
import { DEMO_MODE } from "../config.js";
import AllRoutes from "./logic/all_routes.jsx";

function Workspace() {
  const { user } = useAuth();
  const key = `quizly:${DEMO_MODE ? "demo" : "live"}:draft:${user?.id || "signed-out"}`;
  return <QuizDraftProvider key={key} storageKey={key}><AllRoutes /></QuizDraftProvider>;
}
export default function App() {
  return <AuthProvider><Workspace /></AuthProvider>;
}
