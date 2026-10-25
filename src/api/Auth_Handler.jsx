import client from "./axios.jsx";
import { DEMO_MODE } from "../../config.js";
import { demoApi } from "./demoApi.js";

const Auth_Handler = {
  async signup(email, password, name) {
    if (DEMO_MODE) return demoApi.signup(email, name);
    const { data } = await client.post("/api/auth/signup", { email, password, name });
    if (!data || typeof data !== "object" || !(data._id || data.id || data.user)) throw new Error("The account could not be created. Please try again.");
    return data;
  },
  async signin(email, password) {
    if (DEMO_MODE) return demoApi.signin(email);
    const { data } = await client.post("/api/auth/signin", { email, password });
    if (!data?.token || typeof data.token !== "string") throw new Error("Check your email and password and try again.");
    return data;
  },
  async me(token) {
    if (DEMO_MODE) return demoApi.me(token);
    const { data } = await client.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    return data;
  },
};
export default Auth_Handler;
