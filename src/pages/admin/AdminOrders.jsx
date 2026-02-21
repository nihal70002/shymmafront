import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { Search, Eye, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const PAGE_SIZE = 8;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
const [confirmModal, setConfirmModal] = useState(null);
// { orderId, action }

  const currentStatus = searchParams.get("status") || "All";



const formatSAR = (amount) =>
  new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount);





  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page, pageSize: PAGE_SIZE };
      if (currentStatus !== "All") {
  params.status = currentStatus;
}

      const res = await api.get("/admin/orders", { params });
      setOrders(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [currentStatus]);

  useEffect(() => {
    fetchOrders();
  }, [page, currentStatus]);

  const doAction = async (orderId, action, isConfirmed = false) => {
  try {
    setUpdatingId(orderId);

    await api.post(
  `/orders/${orderId}/${action}`
);


    fetchOrders();
  } catch (err) {
    if (err.response?.data?.message === "CONFIRMATION_REQUIRED") {
      setConfirmModal({ orderId, action });
    } else {
      alert("Action failed");
    }
  } finally {
    setUpdatingId(null);
  }
};




  // NEW: Action for Warehouse Approval




  const filteredOrders = orders.filter(o =>
    o.orderId.toString().includes(searchTerm) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const statusOptions = ["All", "Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">

      {/* WATER EFFECT TOP BAR */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40">
        {/* Glowing Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setSearchParams(s === "All" ? {} : { status: s }, { replace: true })}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                currentStatus === s
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Small Glowing Search Bar on Right */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-40 md:w-52 pl-9 pr-3 py-2 bg-white/80 backdrop-blur-sm text-xs text-slate-700 rounded-lg border border-white/50 shadow-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* MODERN TABLE CONTAINER */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Client Details</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Process</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.orderId} className="border-b border-slate-100 hover:bg-blue-50/40 transition-all">
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-indigo-600">#{o.orderId}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-slate-800">{o.customerName}</div>
                  <div className="text-xs text-slate-500">{o.companyName}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs text-slate-600">{new Date(o.orderDate).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-emerald-600">
  {formatSAR(o.totalAmount)}
</span>

                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2 items-center flex-wrap">
                   
                   {o.status === "Pending" && (
  <ActionBtn
    label="Confirm"
    variant="success"
    onClick={() => doAction(o.orderId, "confirm")}
    disabled={updatingId === o.orderId}
  />
)}


                    {/* WAREHOUSE APPROVAL BUTTONS */}
                    {o.status === "Confirmed" && (
  <ActionBtn
    label="Dispatch"
    variant="info"
    onClick={() => doAction(o.orderId, "dispatch")}
    disabled={updatingId === o.orderId}
  />
)}

                    {confirmModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Confirm Action
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        This order is already dispatched or delivered.
        Are you sure you want to revert?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setConfirmModal(null)}
          className="px-4 py-2 text-sm rounded-lg bg-slate-100"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            doAction(
              confirmModal.orderId,
              confirmModal.action,
              true
            );
            setConfirmModal(null);
          }}
          className="px-4 py-2 text-sm rounded-lg bg-rose-500 text-white"
        >
          Yes, Revert
        </button>
      </div>
    </div>
  </div>
)}


                    {/* DELIVERY BUTTON */}
                    {o.status === "Dispatched" && (
                      <ActionBtn
                        label="Deliver"
                        variant="primary"
                        onClick={() => doAction(o.orderId, "deliver")}
                        disabled={updatingId === o.orderId}
                      />
                    )}
                    {/* REVERT BUTTON FOR CANCELLED ORDERS */}
{o.status === "Cancelled" && (
  <ActionBtn
    label="Revert"
    variant="danger"
    onClick={() => doAction(o.orderId, "revert")}
    disabled={updatingId === o.orderId}
  />
)}


                    <Link to={`/admin/orders/${o.orderId}`}>
                      <button className="p-2 hover:bg-indigo-100 rounded-lg transition-all">
                        <Eye className="w-4 h-4 text-indigo-600" />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <RefreshCw className="w-3.5 h-3.5" />
          Live Order Stream
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-semibold text-slate-700">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const ActionBtn = ({ label, variant, onClick, disabled }) => {
  const variants = {
    success: "bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.2)] hover:bg-emerald-600",
    danger: "bg-rose-500 text-white shadow-[0_4px_10px_rgba(244,63,94,0.2)] hover:bg-rose-600",
    info: "bg-sky-500 text-white shadow-[0_4px_10px_rgba(14,165,233,0.2)] hover:bg-sky-600",
    primary: "bg-indigo-500 text-white shadow-[0_4px_10px_rgba(99,102,241,0.2)] hover:bg-indigo-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${variants[variant]}`}
    >
      {label}
    </button>
  );
};

function StatusBadge({ status }) {
 const config = {
  Pending: { label: "Pending", class: "bg-amber-100 text-amber-600 border-amber-200" },
  Confirmed: { label: "Confirmed", class: "bg-emerald-100 text-emerald-600 border-emerald-200" },
  Dispatched: { label: "In Transit", class: "bg-blue-100 text-blue-600 border-blue-200" },
  Delivered: { label: "Delivered", class: "bg-slate-100 text-slate-500 border-slate-200" },
  Cancelled: { label: "Cancelled", class: "bg-rose-100 text-rose-600 border-rose-200" },
};


  const s = config[status];

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${s?.class || "bg-gray-100 text-gray-600"}`}>
      {s?.label || status}
    </span>
  );
}