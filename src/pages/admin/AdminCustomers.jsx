import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  Users, ShoppingBag, IndianRupee, Mail, Search,
  ChevronRight, UserCircle, Loader2, Package, TrendingUp, BarChart3,
  Plus, X, Lock, Building, Phone, ArrowLeft, Eye, Calendar, MapPin
} from "lucide-react";

/* ================= MODERN STATUS BADGE (MEDIUM) ================= */
const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const styles = {
    confirmed: "bg-indigo-50 text-indigo-600 border-indigo-100",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    dispatched: "bg-blue-50 text-blue-600 border-blue-100",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold border ${styles[s] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [salesExecutives, setSalesExecutives] = useState([]);
const [showPassword, setShowPassword] = useState(false);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
  name: "",
  companyName: "",
  email: "",
  phoneNumber: "",
  password: "",
  salesExecutiveId: ""
});


  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.get("/admin/users");
      setCustomers(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleUserSelect = async (userId) => {
    setDetailLoading(true);
    setShowDetailView(true);
    try {
      const userRes = await api.get(`/admin/users/${userId}/details`);
      setSelectedUser(userRes.data);
    } catch {
      alert("Failed to load customer data");
      setShowDetailView(false);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (showAddModal) loadSalesExecutives();
  }, [showAddModal]);

  const loadSalesExecutives = async () => {
    try {
      const res = await api.get("/admin/sales-executives");
      setSalesExecutives(res.data);
    } catch (err) { console.error("Failed to load sales executives"); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/admin/users", {
        ...formData,
        salesExecutiveId: Number(formData.salesExecutiveId)
      });
      alert("Customer Created Successfully!");
      setShowAddModal(false);
      setFormData({ name: "", companyName: "", email: "", phoneNumber: "", password: "", salesExecutiveId: "" });
      loadCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { derivedStats, groupedProducts } = useMemo(() => {
    if (!selectedUser?.orderHistory) return { derivedStats: { total: 0, count: 0, avg: 0 }, groupedProducts: [] };
    const total = selectedUser.orderHistory.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const count = selectedUser.orderHistory.length;
    const avg = count > 0 ? total / count : 0;
    const productMap = {};
    selectedUser.orderHistory.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const name = item.productName || item.name;
          if (!productMap[name]) productMap[name] = { productName: name, quantityBought: 0, revenue: 0 };
          productMap[name].quantityBought += Number(item.quantity);
          productMap[name].revenue += (Number(item.price) * Number(item.quantity));
        });
      }
    });
    return { derivedStats: { total, count, avg }, groupedProducts: Object.values(productMap).sort((a, b) => b.revenue - a.revenue) };
  }, [selectedUser]);

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans antialiased text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER (SCALED DOWN) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Customer Directory</h1>
            <p className="text-sm text-slate-500 font-medium">Manage accounts and monitoring behavior.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 text-sm"
          >
            <Plus size={18} strokeWidth={3} />
            Add Client
          </button>
        </div>

        {/* SEARCH BAR (SCALED DOWN) */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Search clients..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* MAIN TABLE (REFINED DENSITY) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Identity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
  Sales Executive
</th>

                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((c) => (
                <tr key={c.userId} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100">
                        {c.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{c.name}</p>
                        <p className="text-xs text-slate-400 font-medium truncate">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{c.companyName || "—"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{c.phoneNumber || "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
  {c.salesExecutiveName || "Unassigned"}
</td>

                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleUserSelect(c.userId)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-[10px] hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                    >
                      <Eye size={14} /> PROFILE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL OVERLAY (MEDIUM SIZE) */}
      {showDetailView && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="max-w-5xl mx-auto p-6 sm:p-10 space-y-8">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setShowDetailView(false)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200"><ArrowLeft size={16} /></div>
                Go Back
              </button>
              <div className="flex gap-2">
                <StatusBadge status="Verified" />
                <StatusBadge status="Active" />
              </div>
            </div>

            {detailLoading ? (
               <div className="h-64 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="animate-spin text-indigo-600" size={32} />
                 <p className="text-sm font-bold text-slate-400">Loading history...</p>
               </div>
            ) : selectedUser && (
              <div className="space-y-6">
                {/* Profile Profile Card (Refined) */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <UserCircle size={44} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedUser.name}</h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Mail size={14}/> {selectedUser.email}</span>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Building size={14}/> {selectedUser.companyName}</span>
                        {selectedUser.salesExecutiveName && (
  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
    <UserCircle size={14} />
    {selectedUser.salesExecutiveName}
  </span>
)}

                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 px-8 py-6 rounded-2xl text-white min-w-[200px] text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Value</p>
                    <p className="text-3xl font-black">₹{derivedStats.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Stats Grid (Refined) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><ShoppingBag size={24}/></div>
                    <div>
                      <p className="text-xl font-black text-slate-800">{derivedStats.count}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><IndianRupee size={24}/></div>
                    <div>
                      <p className="text-xl font-black text-slate-800">₹{derivedStats.avg.toFixed(0)}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Ticket</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Package size={24}/></div>
                    <div>
                      <p className="text-xl font-black text-slate-800">{groupedProducts.length}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown (Refined) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 size={18} className="text-indigo-600"/>
                            <h3 className="font-bold text-sm text-slate-800">Top Products</h3>
                        </div>
                        <div className="space-y-2">
                          {groupedProducts.slice(0, 5).map((p, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-sm">
                                <p className="font-bold text-slate-700 truncate mr-2">{p.productName}</p>
                                <p className="font-black text-slate-900 whitespace-nowrap">₹{p.revenue.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                          <h3 className="font-bold text-sm text-slate-800">Recent Orders</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <table className="w-full text-xs">
                            <tbody className="divide-y divide-slate-100">
                              {selectedUser.orderHistory?.map(o => (
                                <tr key={o.orderId} className="hover:bg-slate-50">
                                  <td className="p-3 font-bold">#ORD-{o.orderId}</td>
                                  <td className="p-3"><StatusBadge status={o.status} /></td>
                                  <td className="p-3 text-right font-black">₹{Number(o.totalAmount).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE MODAL (MEDIUM SIZE) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-black">New Customer</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-indigo-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Company</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div className="space-y-1">
  <label className="text-[10px] font-black uppercase text-slate-400">
    Email
  </label>
  <input
    type="email"
    required
    className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-indigo-600"
    value={formData.email}
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
  />
</div>
<div className="space-y-1">
  <label className="text-[10px] font-black uppercase text-slate-400">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      required
      className="w-full px-4 py-2.5 pr-11 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-indigo-600"
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
    >
      {showPassword ? <Eye size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>



                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Phone</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
              </div>
             
              <button disabled={isSubmitting} className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-black hover:bg-indigo-600 transition-all mt-2">
                {isSubmitting ? "PROCESSING..." : "SAVE PROFILE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}