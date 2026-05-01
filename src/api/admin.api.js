import api from "./axios";

export const getAllOrders = () => api.get("/admin/orders");
export const getOrderDetails = id => api.get(`/admin/orders/${id}`);
export const confirmOrder = id => api.post(`/orders/${id}/confirm`);
export const dispatchOrder = id => api.post(`/orders/${id}/dispatch`);
export const deliverOrder = id => api.post(`/orders/${id}/deliver`);
export const getLowStock = () => api.get("/admin/products/low-stock");
