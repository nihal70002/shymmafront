import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* PUBLIC */
import Login from "./pages/public/Login";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import Landing from "./pages/public/Landing";
import Downloads from "./pages/public/Downloads";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

/* PRODUCTS (PUBLIC) */
import Products from "./pages/public/Products";
import CategoryPage from "./pages/public/CategoryPage";

/* USER (PROTECTED) */
import Cart from "./pages/user/Cart";
import MyOrders from "./pages/user/MyOrders";
import OrderDetails from "./pages/user/OrderDetails";
import Profile from "./pages/user/Profile";
import Addresses from "./pages/user/Addresses";
import ChangePassword from "./pages/user/ChangePassword";

/* LAYOUTS */
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";

/* ADMIN */
const ProductDetails = React.lazy(() => import("./pages/public/ProductDetails"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = React.lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetails = React.lazy(() => import("./pages/admin/AdminOrderDetails"));
const AdminProducts = React.lazy(() => import("./pages/admin/AdminProducts"));
const AdminLowStock = React.lazy(() => import("./pages/admin/AdminLowStock"));
const AdminReports = React.lazy(() => import("./pages/admin/AdminReports"));
const AdminCustomers = React.lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCategories = React.lazy(() => import("./pages/admin/AdminCategories"));

/* GUARDS */
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { zIndex: 99999 } }} />

      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">Loading...</div>}>
        <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* PUBLIC PRODUCT ROUTES (NO LOGIN) */}
        <Route element={<UserLayout />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Route>

        {/* ================= USER (PROTECTED) ================= */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/addresses" element={<Addresses />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:orderId" element={<AdminOrderDetails />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="low-stock" element={<AdminLowStock />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>
    </Suspense>
    </>
  );
}