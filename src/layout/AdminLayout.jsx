import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Warehouse,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-56 hidden lg:flex flex-col bg-[#F1F5FF] border-r border-blue-100 shrink-0">
        
        {/* LOGO */}
        <div className="p-5 border-b border-blue-100 flex justify-center">
  <img
    src="/logo/logo.png"
    alt="Logo"
    className="h-20 w-auto object-contain"
  />
</div>


        {/* NAV */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          <SidebarItem
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
            active={location.pathname === "/admin/dashboard"}
            onClick={() => navigate("/admin/dashboard")}
          />

          <SidebarItem
            icon={<ShoppingCart size={16} />}
            label="Orders"
            active={location.pathname.startsWith("/admin/orders")}
            onClick={() => navigate("/admin/orders")}
          />

          <SidebarItem
            icon={<Package size={16} />}
            label="Products"
            active={location.pathname.startsWith("/admin/products")}
            onClick={() => navigate("/admin/products")}
          />

         

          <SidebarItem
            icon={<Users size={16} />}
            label="Customers"
            active={location.pathname.startsWith("/admin/customers")}
            onClick={() => navigate("/admin/customers")}
          />

         

          <SidebarItem
            icon={<BarChart3 size={16} />}
            label="Reports"
            active={location.pathname.startsWith("/admin/reports")}
            onClick={() => navigate("/admin/reports")}
          />
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-blue-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-[12px] text-red-600 hover:bg-red-100/50 transition"
          >
            <LogOut size={16} />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

/* SIDEBAR ITEM */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-[12px] transition cursor-pointer outline-none
        ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-700 hover:bg-blue-100 hover:text-slate-900"
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
