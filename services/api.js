import axios from "axios";

export default axios.create({
  baseURL: "https://meatproserver-production-081e.up.railway.app/api",
  headers: {
    "Content-Type": "application/json"
  }
});