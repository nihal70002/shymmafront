import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Search, Package, User, ShoppingCart } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import {  useLocation } from "react-router-dom";


export default function UserLayout() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
const location = useLocation();
const isCartPage = location.pathname === "/cart";

  // ✅ GLOBAL cart state from context
  const { cartCount, setCartFromApi } = useCart();

  // ✅ Hydrate cart count from backend on refresh
  useEffect(() => {
  const token = localStorage.getItem("token");

  // 🚫 Don't call cart API if user is not logged in
  if (!token) {
    setCartFromApi(0);
    return;
  }

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/cart");

      // DISTINCT cart items (not quantity)
      setCartFromApi(res.data.length || 0);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      setCartFromApi(0);
    }
  };

  fetchCartCount();
}, [location.pathname]);

// 🔥 THIS IS THE FIX
const handleSearch = (e) => {
  if (e.key === "Enter") {
    const query = searchQuery.trim();
    if (!query) return;

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchQuery("");
  }
};



  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">

          {/* LOGO */}
          <div
            onClick={() => navigate("/products")}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src="/logo/logo.png"
              alt="Safa Store"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* SEARCH */}
          <div className="flex-1 max-w-md mx-10">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
  type="text"
  placeholder="Search for products, brands and more..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleSearch}
  className="
    w-full pl-12 pr-4 py-2.5 text-xs
    bg-slate-50 border border-slate-300 rounded-lg
    focus:outline-none focus:border-slate-500 focus:bg-white
  "
/>

            </div>
          </div>

          {/* ACTIONS */}
  {/* ACTIONS */}
<div className="flex items-center gap-6 text-gray-600">
  <button
    onClick={() => navigate("/orders")}
    className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors"
  >
    <Package size={22} />
    <span className="text-xs">Orders</span>
  </button>

  <button
    onClick={() => navigate("/profile")}
    className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors"
  >
    <User size={22} />
    <span className="text-xs">Profile</span>
  </button>

  <button
    onClick={() => navigate("/cart")}
    className="relative flex flex-col items-center gap-1 hover:text-gray-900 transition-colors"
  >
    <ShoppingCart size={22} />
    <span className="text-xs">Bag</span>

    {cartCount > 0 && !isCartPage && (
      <span className="absolute -top-1 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
        {cartCount}
      </span>
    )}
  </button>
</div>

        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-6 w-full">
        <Outlet />
      </main>
    </div>
  );
}
