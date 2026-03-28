import api from "./axios";

export const getProducts = (page = 1, pageSize = 12) =>
  api.get(`/products?page=${page}&pageSize=${pageSize}`);

export const getProductById = (id) =>
  api.get(`/products/${id}`);