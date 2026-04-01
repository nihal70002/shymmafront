import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Warehouse,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#F1F5FF] border-r border-blue-100
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex-shrink-0
        `}
      >
        {/* MOBILE CLOSE BUTTON */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-800">
            <X size={20} />
          </button>
        </div>

        {/* LOGO SECTION */}
        <div className="px-6 py-8 border-b border-blue-100/50">
          <img
            src="/logo/logo.png"
            alt="Logo"
            className="h-22 w-auto object-contain"
          />
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname === "/admin/dashboard"}
            onClick={() => { navigate("/admin/dashboard"); setOpen(false); }}
          />

          <SidebarItem
            icon={<ShoppingCart size={18} />}
            label="Orders"
            active={location.pathname.startsWith("/admin/orders")}
            onClick={() => { navigate("/admin/orders"); setOpen(false); }}
          />

          <SidebarItem
            icon={<Package size={18} />}
            label="Products"
            active={location.pathname.startsWith("/admin/products")}
            onClick={() => { navigate("/admin/products"); setOpen(false); }}
          />

          

          <SidebarItem
            icon={<Users size={18} />}
            label="Customers"
            active={location.pathname.startsWith("/admin/customers")}
            onClick={() => { navigate("/admin/customers"); setOpen(false); }}
          />


           <SidebarItem
            icon={<BarChart3 size={18} />}
            label="Categories"
            active={location.pathname.startsWith("/admin/categories")}
            onClick={() => { navigate("/admin/categories"); setOpen(false); }}
          />
        



          

          <SidebarItem
            icon={<BarChart3 size={18} />}
            label="Reports"
            active={location.pathname.startsWith("/admin/reports")}
            onClick={() => { navigate("/admin/reports"); setOpen(false); }}
          />
        </nav>

        {/* LOGOUT SECTION */}
        <div className="p-4 border-t border-blue-100 bg-[#F1F5FF]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        
        {/* MOBILE TOP NAVIGATION (Only visible on mobile) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-white">
          <button 
            onClick={() => setOpen(true)} 
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* SCROLLABLE PAGE AREA */}
       {/* SCROLLABLE PAGE AREA */}
<div className="flex-1 overflow-y-auto">
  {/* Content wrapper with no padding so it hits the edges */}
  <div className="w-full min-h-full flex flex-col">
    <Outlet />
  </div>
</div>
      </main>
    </div>
  );
}

/* SIDEBAR ITEM COMPONENT */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] transition-all duration-200 cursor-pointer outline-none
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "text-slate-600 hover:bg-blue-100/50 hover:text-blue-700"
        }
      `}
    >
      <span className={active ? "text-white" : "text-slate-400"}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}