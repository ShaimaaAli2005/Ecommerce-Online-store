import axios from "axios";

const API_URL = "https://e-commerce-api-3wara.vercel.app";

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data.product;
};