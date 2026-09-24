import axios from "axios";

export default axios.create({
  baseURL: "https://meatproserver-production-67bf.up.railway.app/api",
  headers: {
    "Content-Type": "application/json"
  }
});