import axios from "axios";
import { BACKEND_URL } from "../../config.js";
const client = axios.create({ baseURL: BACKEND_URL, timeout: 15000, headers: { "Content-Type": "application/json" } });
export default client;
