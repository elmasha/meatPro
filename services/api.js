import axios from "axios";

export default axios.create({
  baseURL: "https://meatproserver-production-6328.up.railway.app/api",
  headers: {
    "Content-Type": "application/json"
  }
});