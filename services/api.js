import axios from "axios";

export default axios.create({
  baseURL: "https://meatproserver-production-66ff.up.railway.app/api",
  headers: {
    "Content-Type": "application/json"
  }
});