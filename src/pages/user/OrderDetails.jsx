import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetails, cancelMyOrder } from "../../api/orders.api";
import { ArrowLeft, X, AlertTriangle } from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getOrderDetails(id)
      .then(res => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    try {
      setCancelling(true);
      await cancelMyOrder(id, cancelReason);
      // Refresh order details
      const res = await getOrderDetails(id);
      setOrder(res.data);
      setShowCancelDialog(false);
      setCancelReason("");
      alert("Order cancelled successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = order && (order.status === "Placed" || order.status.includes("Pending"));

  /* -------------------- STATES -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Order not found</p>
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={18} />
          Back to orders
        </button>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Order #{order.orderId}
            </h1>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold
                ${
                  order.status.includes("Pending") || order.status === "Placed"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status.includes("Delivered")
                    ? "bg-green-100 text-green-700"
                    : order.status.includes("Cancelled")
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
              
              {canCancelOrder && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-md flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-semibold">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Delivered Date</p>
              <p className="font-semibold">
                {order.deliveredDate
                  ? new Date(order.deliveredDate).toLocaleDateString()
                  : "Not delivered yet"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-bold text-lg text-teal-600">
                ₹{order.totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Ordered Items</h2>

          <div className="divide-y">
            {order.items.map(item => (
              <div
                key={item.productId}
                className="flex items-center gap-4 py-4"
              >
                {/* Product Image */}
               <img
  src={item.productImage || item.imageUrl || "/placeholder.png"}
  alt={item.productName}
  className="w-20 h-20 object-cover rounded-xl border flex-shrink-0"
  onError={(e) => {
    e.currentTarget.src = "/placeholder.png";
  }}
/>


                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                    {[
                      item.size && `Size: ${item.size}`,
                      item.style && `Style: ${item.style}`,
                      item.material && `Material: ${item.material}`,
                      item.color && `Color: ${item.color}`
                    ].filter(Boolean).join(" | ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₹{item.unitPrice}
                  </p>
                </div>

                {/* Price */}
                <p className="font-bold text-gray-800">
                  ₹{item.subtotal}
                </p>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <p className="text-lg font-semibold">Grand Total</p>
            <p className="text-2xl font-bold text-teal-600">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>

        {/* Cancellation Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Cancel Order</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel order #{order.orderId}? This action cannot be undone.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="3"
                  placeholder="Please provide a reason for cancellation..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelDialog(false);
                    setCancelReason("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
