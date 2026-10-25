import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";
import { ErrorState, Loading } from "../components/Feedback.jsx";
export default function ProtectedRoute() {
  const { user, loading, error, retry, logout } = useAuth();
  const location = useLocation();
  if (loading) return <Loading label="Checking your account…" />;
  if (error) return <div className="page narrow"><ErrorState error={new Error(error)} title="Let's reconnect your account" onRetry={retry}><button className="btn ghost" onClick={logout}>Sign in again</button></ErrorState></div>;
  if (!user) return <Navigate to="/auth/signin" state={{ from: location.pathname + location.search }} replace />;
  return <Outlet />;
}
