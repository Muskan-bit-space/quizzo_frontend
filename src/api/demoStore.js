// Local UI preview only. Real grading and authorization belong to the backend.
const STORE_KEY = "quizly:preview:v1";
const owner = { id: "demo-maya", name: "Maya Kapoor", email: "maya@example.com" };
function failure(message, status = 400) {
  const error = new Error(message);
  error.response = { status, data: { error: message } };
  return error;
}
function seed() {
  const createdAt = new Date().toISOString();
  const quizzes = [{
    id: "demo-javascript", shareId: "JSBASICS", owner: owner.id, ownerName: owner.name,
    title: "JavaScript essentials", description: "A quick check on the building blocks of JavaScript. Take your time, trust what you know, and give it a go.", createdAt,
    questions: [
      { id: "js-1", text: "Which keyword declares a variable that cannot be reassigned?", options: ["let", "const", "var", "static"], correctOption: 1 },
      { id: "js-2", text: "What does Array.map() return?", options: ["The original array", "A single number", "A new array", "Nothing"], correctOption: 2 },
      { id: "js-3", text: "Which operator checks both value and type?", options: ["=", "==", "!=", "==="], correctOption: 3 },
      { id: "js-4", text: "Which method converts JSON text into a JavaScript value?", options: ["JSON.parse()", "JSON.stringify()", "JSON.read()", "JSON.object()"], correctOption: 0 },
    ],
  }, {
    id: "demo-web", shareId: "WEBSTART", owner: owner.id, ownerName: owner.name,
    title: "The web, in a nutshell", description: "Two small questions about the big world of the web.", createdAt,
    questions: [
      { id: "web-1", text: "What is the main purpose of CSS?", options: ["Store data", "Style web pages", "Send email", "Manage passwords"], correctOption: 1 },
      { id: "web-2", text: "Which HTTP method usually retrieves data?", options: ["POST", "DELETE", "GET", "PATCH"], correctOption: 2 },
    ],
  }];
  const participants = [{ id: "demo-arjun", name: "Arjun Mehta", score: 4 }, { id: "demo-sara", name: "Sara Wilson", score: 3 }, { id: "demo-noah", name: "Noah Lee", score: 2 }];
  const attempts = participants.map((person, index) => ({
    id: `sample-${index}`, quizId: quizzes[0].id, userId: person.id, participantName: person.name,
    status: "submitted", startedAt: createdAt, completedAt: createdAt, answers: [],
    result: { score: person.score, totalQuestions: 4, percentage: person.score * 25 },
  }));
  return { users: [owner], quizzes, attempts };
}

export function createDemoApi(storage, uuid = () => crypto.randomUUID()) {
  function read() {
    let data;
    try { data = JSON.parse(storage.getItem(STORE_KEY)); } catch { /* Initialize preview data if missing/corrupt. */ }
    if (data?.users && data?.quizzes && data?.attempts) return data;
    data = seed();
    write(data);
    return data;
  }
  function write(data) {
    try { storage.setItem(STORE_KEY, JSON.stringify(data)); }
    catch { throw failure("Preview storage is unavailable or full. Allow browser storage to use the preview."); }
  }
  function userFor(db, token) {
    const user = db.users.find(item => token === `preview:${item.id}`);
    if (!user) throw failure("Please sign in to the preview.", 401);
    return user;
  }
  function ownedQuiz(db, id, user) {
    const quiz = db.quizzes.find(item => item.id === id);
    if (!quiz) throw failure("This quiz could not be found.", 404);
    if (quiz.owner !== user.id) throw failure("Only the quiz owner can see these results.", 403);
    return quiz;
  }
  function summary(db, quiz) {
    const attempts = db.attempts.filter(item => item.quizId === quiz.id && item.status === "submitted");
    return { id: quiz.id, title: quiz.title, description: quiz.description, shareId: quiz.shareId, ownerName: quiz.ownerName, questionCount: quiz.questions.length, createdAt: quiz.createdAt, attemptCount: attempts.length, averageScore: attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.result.percentage, 0) / attempts.length) : null };
  }
  function attemptFor(db, id, user) {
    const attempt = db.attempts.find(item => item.id === id);
    if (!attempt) throw failure("This attempt could not be found.", 404);
    if (attempt.userId !== user.id) throw failure("This attempt belongs to another account.", 403);
    return attempt;
  }
  function participantAttempt(db, attempt) {
    const quiz = db.quizzes.find(item => item.id === attempt.quizId);
    return { ...attempt, quizTitle: quiz.title, shareId: quiz.shareId, totalQuestions: quiz.questions.length, questions: quiz.questions.map(({ id, text, options }) => ({ id, text, options })) };
  }
  return {
    async signup(email, name) {
      const db = read();
      if (db.users.some(user => user.email.toLowerCase() === email.toLowerCase())) throw failure("An account with this email already exists.");
      const user = { id: uuid(), email: email.trim().toLowerCase(), name: name.trim() };
      db.users.push(user); write(db); return { user };
    },
    async signin(email) {
      const db = read();
      const user = db.users.find(item => item.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) throw failure("Create a preview account first, or use maya@example.com.");
      return { token: `preview:${user.id}` };
    },
    async me(token) { return { user: userFor(read(), token) }; },
    async createQuiz(payload, token) {
      const db = read(); const user = userFor(db, token);
      const quiz = { ...payload, id: uuid(), shareId: uuid().replaceAll("-", "").slice(0, 12), owner: user.id, ownerName: user.name, createdAt: new Date().toISOString(), questions: payload.questions.map(question => ({ ...question, id: uuid() })) };
      db.quizzes.unshift(quiz); write(db);
      return { message: "Quiz saved. Your link is ready.", quiz: summary(db, quiz) };
    },
    async getMyQuizzes(token) {
      const db = read(); const user = userFor(db, token);
      return { quizzes: db.quizzes.filter(quiz => quiz.owner === user.id).map(quiz => summary(db, quiz)) };
    },
    async getQuiz(id, token) {
      const db = read(); const quiz = ownedQuiz(db, id, userFor(db, token));
      return { quiz: { ...summary(db, quiz), questions: quiz.questions } };
    },
    async getAttempts(id, token) {
      const db = read(); ownedQuiz(db, id, userFor(db, token));
      return { attempts: db.attempts.filter(item => item.quizId === id && item.status === "submitted").sort((a, b) => b.completedAt.localeCompare(a.completedAt)).map(item => ({ id: item.id, participantName: item.participantName, userId: item.userId, completedAt: item.completedAt, ...item.result })) };
    },
    async getSharedQuiz(code, token) {
      const db = read(); userFor(db, token);
      const quiz = db.quizzes.find(item => item.shareId === code);
      if (!quiz) throw failure("This quiz link is unavailable. Check the code with its creator.", 404);
      return { quiz: summary(db, quiz) };
    },
    async startAttempt(code, token, requestId) {
      const db = read(); const user = userFor(db, token);
      const quiz = db.quizzes.find(item => item.shareId === code);
      if (!quiz) throw failure("This quiz is unavailable.", 404);
      let attempt = db.attempts.find(item => item.quizId === quiz.id && item.userId === user.id && item.requestId === requestId);
      if (!attempt) {
        attempt = { id: uuid(), quizId: quiz.id, userId: user.id, participantName: user.name, requestId, status: "in_progress", startedAt: new Date().toISOString(), answers: [] };
        db.attempts.push(attempt); write(db);
      }
      return { attempt: participantAttempt(db, attempt) };
    },
    async getAttempt(id, token) {
      const db = read(); return { attempt: participantAttempt(db, attemptFor(db, id, userFor(db, token))) };
    },
    async submitAttempt(id, answers, token) {
      const db = read(); const attempt = attemptFor(db, id, userFor(db, token));
      if (attempt.status === "submitted") return { attempt: participantAttempt(db, attempt) };
      const quiz = db.quizzes.find(item => item.id === attempt.quizId);
      const selections = new Map(answers.map(answer => [answer.questionId, answer.optionIndex]));
      if (answers.length !== quiz.questions.length || selections.size !== quiz.questions.length || quiz.questions.some(question => !Number.isInteger(selections.get(question.id)) || selections.get(question.id) < 0 || selections.get(question.id) >= question.options.length)) throw failure("Answer every question before submitting.");
      const score = quiz.questions.filter(question => selections.get(question.id) === question.correctOption).length;
      Object.assign(attempt, { answers, status: "submitted", completedAt: new Date().toISOString(), result: { score, totalQuestions: quiz.questions.length, percentage: Math.round(score / quiz.questions.length * 100) } });
      write(db); return { attempt: participantAttempt(db, attempt) };
    },
  };
}
