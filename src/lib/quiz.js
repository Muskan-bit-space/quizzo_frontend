export function displayName(user) {
  return user?.name || user?.displayName || user?.email?.split("@")[0] || "Quiz creator";
}

export function normalizeUser(user) {
  if (!user || !(user.id || user._id) || !user.email) throw new Error("The server did not return a valid account.");
  return { id: String(user.id || user._id), email: user.email, name: displayName(user) };
}

export function safeDestination(value) {
  return typeof value === "string" && /^\/(?![\\/])/.test(value) && !Array.from(value).some(char => char.charCodeAt(0) < 32) ? value : "/crud";
}

export function parseShareCode(value) {
  const input = value.trim();
  if (!input) throw new Error("Enter a quiz link or code.");
  let code = input;
  if (/^https?:\/\//i.test(input) || input.startsWith("/")) {
    let url;
    try { url = new URL(input, "https://quizly.invalid"); } catch { throw new Error("That quiz link is not valid."); }
    const match = url.pathname.match(/^\/q\/([^/]+)\/?$/);
    if (!match) throw new Error("Use a Quizly link ending in /q/your-code.");
    try { code = decodeURIComponent(match[1]); } catch { throw new Error("That quiz code is not valid."); }
  }
  if (!/^[a-zA-Z0-9_-]{4,128}$/.test(code)) throw new Error("Use a valid quiz code with letters, numbers, hyphens, or underscores.");
  return code;
}

export function shareUrl(shareId, origin = window.location.origin) {
  return shareId ? `${origin}/q/${encodeURIComponent(shareId)}` : "";
}

export function validateQuestion(question) {
  if (!question.text?.trim()) return "Enter your question.";
  if (question.text.trim().length > 2000) return "Keep the question within 2,000 characters.";
  if (!Array.isArray(question.options) || question.options.length < 2 || question.options.length > 10) return "Add between 2 and 10 answer options.";
  const options = question.options.map(option => option.trim());
  if (options.some(option => !option || option.length > 500)) return "Fill every option and keep each within 500 characters.";
  if (new Set(options.map(option => option.toLowerCase())).size !== options.length) return "Each answer option must be different.";
  if (!Number.isInteger(question.correctOption) || question.correctOption < 0 || question.correctOption >= options.length) return "Select the correct answer.";
  return "";
}

export function quizPayload(quiz) {
  if (!quiz.title?.trim() || quiz.title.trim().length > 150) throw new Error("Enter a title of up to 150 characters.");
  if ((quiz.description || "").length > 2000) throw new Error("Keep the description within 2,000 characters.");
  if (!quiz.questions?.length || quiz.questions.length > 200) throw new Error("Add between 1 and 200 questions.");
  const questions = quiz.questions.map((question, index) => {
    const error = validateQuestion(question);
    if (error) throw new Error(`Question ${index + 1}: ${error}`);
    return { text: question.text.trim(), options: question.options.map(option => option.trim()), correctOption: question.correctOption };
  });
  return { title: quiz.title.trim(), description: (quiz.description || "").trim(), questions };
}

export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") return "The request timed out. Please check your connection and try again.";
  const message = error?.response?.data?.error || error?.response?.data?.message;
  if (typeof message === "string" && message) return message;
  if (error?.response?.status === 401) return "Your session is no longer valid. Please sign out and sign in again.";
  if (error?.response?.status === 403) return "You do not have access to this quiz or attempt.";
  return error?.message || fallback;
}

export function formatDate(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Just created";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
