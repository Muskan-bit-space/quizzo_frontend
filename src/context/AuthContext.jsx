import { useCallback, useEffect, useRef, useState } from "react";
import Auth_Handler from "../api/Auth_Handler.jsx";
import { DEMO_MODE } from "../../config.js";
import { normalizeUser, errorMessage } from "../lib/quiz.js";
import { AuthContext } from "./auth-context.js";

const TOKEN_KEY = DEMO_MODE ? "quizly:demo:token" : "token";
function storedToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => ({ token: storedToken(), user: null, loading: !!storedToken(), error: "" }));
  const revision = useRef(0);
  const initialToken = useRef(session.token);

  const restore = useCallback(async (token) => {
    const request = ++revision.current;
    setSession(current => ({ ...current, loading: true, error: "" }));
    try {
      const response = await Auth_Handler.me(token);
      const user = normalizeUser(response.user);
      if (request === revision.current) setSession({ token, user, loading: false, error: "" });
    } catch (error) {
      if (request !== revision.current) return;
      const invalid = [401, 403].includes(error.response?.status);
      if (invalid) { try { localStorage.removeItem(TOKEN_KEY); } catch { /* Storage can be unavailable. */ } }
      setSession({ token: invalid ? null : token, user: null, loading: false, error: invalid ? "" : errorMessage(error, "Could not restore your account.") });
    }
  }, []);

  useEffect(() => {
    if (initialToken.current) void restore(initialToken.current);
    return () => { revision.current += 1; };
  }, [restore]);

  async function login(token) {
    if (typeof token !== "string" || !token) throw new Error("Sign-in failed. Check your email and password.");
    const response = await Auth_Handler.me(token);
    const user = normalizeUser(response.user);
    revision.current += 1;
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* The current tab can still be signed in. */ }
    setSession({ token, user, loading: false, error: "" });
    return user;
  }

  function logout() {
    revision.current += 1;
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* Clear memory even if storage is blocked. */ }
    setSession({ token: null, user: null, loading: false, error: "" });
  }

  return <AuthContext.Provider value={{ ...session, login, logout, retry: () => restore(session.token) }}>{children}</AuthContext.Provider>;
}
