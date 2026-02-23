import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* PUBLIC */
import Login from "./pages/public/Login";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import Landing from "./pages/public/Landing";

/* PRODUCTS */
import Products from "./pages/public/Products";
import ProductDetails from "./pages/public/ProductDetails";
import CategoryPage from "./pages/public/CategoryPage";

/* USER */
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLowStock from "./pages/admin/AdminLowStock";
import AdminReports from "./pages/admin/AdminReports";
import AdminCustomers from "./pages/admin/AdminCustomers";


/* GUARDS */
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import AdminCategories from "./pages/admin/AdminCategories";


export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ style: { zIndex: 99999 } }}
      />

      <Routes>
        {/* ================= PUBLIC ================= */}
       <Route path="/landing" element={<Landing />} />
       <Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />




        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= USER ================= */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/addresses" element={<Addresses />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
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
    </>
  );
}
