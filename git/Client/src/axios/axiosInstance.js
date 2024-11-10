import { api_base_url } from "@/CONSTANTS";
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: api_base_url,
  timeout: 30 * 1000,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export default AxiosInstance;
