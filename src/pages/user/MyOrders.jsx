import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, cancelMyOrder } from "../../api/orders.api";
import StatusBadge from "../../components/common/StatusBadge";
import { Package, ChevronLeft, ShoppingBag, Calendar, DollarSign, Eye, X } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCancel = async (orderId, orderStatus) => {
    if (orderStatus !== "Placed" && !orderStatus.includes("Pending")) {
      alert("Only placed orders can be cancelled");
      return;
    }

    const reason = prompt("Please provide a reason for cancellation:");
    if (!reason || !reason.trim()) {
      return;
    }

    try {
      await cancelMyOrder(orderId, reason);
      alert("Order cancelled successfully");
      loadOrders(); // Refresh the orders list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const canCancelOrder = (status) => {
    return status === "Placed" || status.includes("Pending");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-all hover:gap-3 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          </div>

          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-3xl shadow-lg border border-gray-200">
            <div className="bg-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping and your orders will appear here!</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all hover:scale-105 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-500">Total Orders</span>
                  <Package className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">{orders.length}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-500">Total Spent</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">
                  ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-500">Latest Order</span>
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {orders.length > 0 ? new Date(orders[0].orderDate).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>

            {/* Orders List - Desktop Table */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order, idx) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-teal-600" />
                          </div>
                          <span className="font-bold text-gray-900">#{order.orderId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-teal-600">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                            className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all hover:scale-105 shadow-md"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          
                          {canCancelOrder(order.status) && (
                            <button
                              onClick={() => handleQuickCancel(order.orderId, order.status)}
                              className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-md"
                            >
                              <X size={16} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Orders List - Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">#{order.orderId}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-teal-600">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                        className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      
                      {canCancelOrder(order.status) && (
                        <button
                          onClick={() => handleQuickCancel(order.orderId, order.status)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-all"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}