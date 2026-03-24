import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const predictCrop = (data) => {
  return API.post("/predict", data);
};