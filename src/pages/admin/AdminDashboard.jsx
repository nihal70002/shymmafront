import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Users, Clock, AlertTriangle, 
  Wallet, ChevronRight, MoreHorizontal, TrendingUp 
} from "lucide-react";
import api from "../../api/axios";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState([]);
 const [stats, setStats] = useState({
  total: 0,
  pending: 0,
  confirmed: 0,
  dispatched: 0,
  delivered: 0,
  lowStock: 0,
  todayOrders: 0,
  totalRevenue: 0
});

       const formatSAR = (amount) =>
  new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

useEffect(() => {
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const year = new Date().getFullYear();

      const [summaryRes, topProdRes, topCustRes, monthlyRes] =
        await Promise.all([
          api.get("/admin/dashboard/summary"),
          api.get("/admin/reports/top-products"),
          api.get("/admin/reports/top-customers"),
          api.get(`/admin/reports/monthly?year=${year}`)
        ]);

      const summary = summaryRes.data;

      setStats({
        total: summary.totalOrders || 0,
        pending: summary.placedOrders || 0,   // Placed = Pending
        confirmed: summary.confirmedOrders || 0,
        dispatched: summary.dispatchedOrders || 0,
        delivered: summary.deliveredOrders || 0,
        todayOrders: summary.todayOrders || 0,
        lowStock: summary.outOfStockVariants || 0,
        totalRevenue: summary.totalRevenue || 0
      });

      setMonthlyData(monthlyRes.data || []);
      setTopProducts(topProdRes.data || []);
      setTopCustomers(topCustRes.data || []);

    } catch (error) {
      console.error("Dashboard Sync Error", error);
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);


  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased overflow-hidden flex flex-col">
      {/* TIGHTER HEADER */}
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
  <div className="flex items-center gap-4">
    {/* Company Name Container - Styled to match Medico Aid Branding */}
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center">
        <h1 className="text-[18px] font-bold tracking-tight leading-none">
          <span className="text-[#0097D7]">Shymma Surgicals</span>{" "}
          
        </h1>
        
       
      </div>
    </div>
  </div>

  <div className="flex items-center gap-3">
    {/* User Profile */}
    <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer shadow-sm">
      <span className="text-[11px] font-bold">SA</span>
    </div>
  </div>
</header>

      {/* COMPACT MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F8FAFC]">
        <div className="max-w-[1300px] mx-auto space-y-4">
          
          {/* STATS SECTION - Smaller Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard 
              title="Revenue" 
              value={formatSAR(stats.totalRevenue)}

              icon={<Wallet size={16} />} 
              theme="indigo" 
              onClick={() => navigate("/admin/reports")} 
            />
            <MiniStat 
  label="Today's Orders" 
  value={stats.todayOrders} 
  theme="amber" 
/>

            <MiniStat 
  label="Pending Orders" 
  value={stats.pending} 
  theme="amber" 
  onClick={() => navigate("/admin/orders?status=Placed")} 
/>

          </section>

          {/* MIDDLE SECTION - Chart and Products */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"> 
  
  {/* CHART COLUMN - Now matches the height of the product card */}
  <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Growth Analytics</h3>
      <div className="flex gap-3 text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> Orders</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Revenue</span>
      </div>
    </div>
    
    {/* REMOVED fixed height h-[180px], ADDED flex-1 */}
    <div className="w-full flex-1"> 
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
          <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }} />
          <Line type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* TOP PRODUCTS - UNCHANGED */}
  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Top Products</h3>
      <MoreHorizontal size={14} className="text-slate-300" />
    </div>
    <div className="space-y-3">
      {topProducts.slice(0, 3).map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
              {item.imageUrl && <img src={item.imageUrl} className="object-cover h-full w-full" />}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-700 truncate w-24 leading-none">{item.productName}</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{formatSAR(item.revenue)}
</p>
            </div>
          </div>
          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.quantitySold} Qty</span>
        </div>
      ))}
    </div>
  </div>
</div>

          {/* BOTTOM SECTION - Table and Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
                <button onClick={() => navigate("/admin/orders")} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase">View All</button>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.slice(0, 4).map(o => (
                    <tr key={o.orderId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-700">#ORD-{o.orderId}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-2.5 text-xs font-black text-slate-900 text-right">{formatSAR(o.totalAmount)}
</td>
                      <td className="px-4 py-2.5 text-right">
                        <button onClick={() => navigate(`/admin/orders/${o.orderId}`)} className="text-slate-300 hover:text-indigo-600">
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Top Customers</h3>
              <div className="space-y-4">
                {topCustomers.slice(0, 3).map((cust, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                        {cust.customerName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-700 leading-none">{cust.customerName}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{cust.ordersCount} Orders</p>
                      </div>
                    </div>
                    <p className="text-[11px] font-black text-slate-800">{formatSAR(cust.totalSpent)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// COMPACT COMPONENTS

function StatCard({ title, value, icon, theme, onClick }) {
  const themes = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
  };
  return (
    <div onClick={onClick} className={`${themes[theme]} rounded-xl p-3 border shadow-sm flex justify-between items-center cursor-pointer hover:-translate-y-0.5 transition-all`}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">{title}</p>
        <h4 className="text-lg font-black leading-tight">{value}</h4>
      </div>
      <div className="bg-white/50 p-1.5 rounded-lg shrink-0">{icon}</div>
    </div>
  );
}

function MiniStat({ label, value, theme, onClick }) {
  const themes = {
    amber: "bg-amber-50 border-amber-100 text-amber-700",
  }
  return (
    <div onClick={onClick} className={`${themes[theme]} rounded-xl p-3 border shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all`}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">{label}</p>
      <div className="text-lg font-black leading-tight">{value}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Dispatched: "bg-blue-50 text-blue-600 border-blue-200",
    Confirmed: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${styles[status] || "bg-slate-50 border-slate-100"}`}>
      {status}
    </span>
  );
}