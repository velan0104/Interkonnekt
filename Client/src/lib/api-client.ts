import axios from "axios";
import { HOST } from "./constant";

const apiClient = axios.create({
  baseURL: HOST,
});

export default apiClient;
