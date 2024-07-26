import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1/orders"
});

export default api
