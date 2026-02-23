import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Printer, Package, Truck, CheckCircle2, 
  Calendar, Building2, Phone, CreditCard, User, 
  MapPin, Hash, ArrowUpRight
} from "lucide-react";
import api from "../../api/axios";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order");
    }
  };

  const doAction = async (action) => {
    setIsUpdating(true);
    try {
      await api.put(`/admin/orders/${orderId}/${action}`);
      await fetchOrder();
    } catch {
      alert("Action failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-12 overflow-y-auto">
      
      {/* HEADERBAR */}
      <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft size={20} className="text-slate-500" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">Order <span className="text-slate-400 font-medium">#{order.orderId}</span></h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
              <Printer size={14} /> Print Invoice
            </button>
            {order.status === "PendingAdminApproval" && (
              <button
                onClick={() => doAction("confirm")}
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
              >
                Approve Order
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TRACKER */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <StatusItem label="Placed" active={true} icon={<Hash size={16}/>} />
              <StatusItem label="Confirmed" active={order.status !== "PendingAdminApproval"} icon={<CheckCircle2 size={16}/>} />
              <StatusItem label="Dispatched" active={["Shipped", "Delivered"].includes(order.status)} icon={<Truck size={16}/>} />
              <StatusItem label="Delivered" active={order.status === "Delivered"} icon={<Package size={16}/>} isLast />
            </div>
          </div>

          {/* ITEM CARD */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between bg-slate-50/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Contents</span>
              <span className="text-[10px] font-bold text-slate-500 bg-white border px-2 py-0.5 rounded shadow-sm">{order.items.length} Items</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {order.items.map((item, i) => (
                <div key={i} className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-slate-50/30 transition-colors">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-800">{item.productName}</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.size && <Badge label="Size" val={item.size} color="blue" />}
                      {item.color && <Badge label="Color" val={item.color} color="slate" />}
                      {item.material && <Badge label="Mat" val={item.material} color="indigo" />}
                    </div>
                  </div>
                  <div className="sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">₹{item.unitPrice} × {item.quantity}</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">₹{(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL SECTION - Replaced the Black Footer with this */}
            <div className="p-6 bg-[#F8FAFC] border-t border-slate-200">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grand Total</p>
                  <p className="text-[10px] text-slate-400 italic">Taxes and shipping included</p>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-black text-slate-900 tracking-tight">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <User size={12} /> Customer Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                <p className="text-xs text-slate-500 mt-1">{order.companyName}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 border border-slate-100">
                <Phone size={14} className="text-slate-400" /> {order.phoneNumber}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Payment & Sales</h3>
             <div className="space-y-6">
               <SidebarItem icon={<CreditCard size={14}/>} label="Payment Method" val={order.paymentMethod || "Internal Credit"} />
               {order.salesExecutiveName && (
                 <div className="pt-4 border-t border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Executive</p>
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs uppercase">{order.salesExecutiveName[0]}</div>
                     <div>
                        <p className="text-xs font-bold text-slate-800">{order.salesExecutiveName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{order.salesExecutivePhone}</p>
                     </div>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// STYLED HELPERS
function StatusItem({ label, active, icon, isLast }) {
  return (
    <div className={`flex-1 flex flex-col items-center group relative`}>
      <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        active ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-slate-100 text-slate-400'
      }`}>
        {icon}
      </div>
      <p className={`text-[10px] font-black uppercase mt-3 tracking-tighter ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
      {!isLast && <div className={`absolute top-5 left-[60%] w-[80%] h-0.5 -z-10 hidden md:block ${active ? 'bg-emerald-100' : 'bg-slate-50'}`} />}
    </div>
  );
}

function Badge({ label, val, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };
  return (
    <div className={`flex items-center border rounded-md text-[10px] font-bold overflow-hidden ${styles[color]}`}>
      <span className="px-1.5 py-0.5 bg-black/5 uppercase tracking-tighter opacity-70">{label}</span>
      <span className="px-2 py-0.5">{val}</span>
    </div>
  );
}

function SidebarItem({ icon, label, val }) {
  return (
    <div className="flex gap-3">
      <div className="text-slate-300 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-xs font-bold text-slate-700 mt-0.5">{val}</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 animate-pulse">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}