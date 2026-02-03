import axios from "axios";

const api = axios.create({
  baseURL: "https://moneymanager-0z7k.onrender.com/api", 
});

export default api;
