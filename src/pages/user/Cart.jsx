import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Trash2, ChevronLeft, ShoppingBag, CheckCircle, CreditCard, ShieldCheck } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Delivery preferences
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState("");
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Cart load error:", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (productVariantId) => {
    // 1️⃣ Optimistic UI update (NO blink)
    setCart(prev =>
      prev.filter(item => item.productVariantId !== productVariantId)
    );

    try {
      // 2️⃣ Backend call
      await api.delete(`/cart/remove/${productVariantId}`);
    } catch (err) {
      // 3️⃣ Rollback only if API fails
      alert("Failed to remove item");
      loadCart();
    }
  };

  const handleQuantityChange = async (productVariantId, newQty) => {
    if (newQty < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.productVariantId === productVariantId ? { ...item, quantity: newQty } : item
      )
    );
    try {
      await api.put("/cart/update", { productVariantId, quantity: newQty });
    } catch (err) {
      loadCart();
    }
  };

  const handleCheckout = async () => {
    setPlacingOrder(true);
    try {
      const payload = {
        items: cart.map(item => ({
          productVariantId: Number(item.productVariantId),
          quantity: Number(item.quantity)
        })),
        // Include delivery preferences
        preferredDeliveryDate: preferredDeliveryDate || null,
        preferredDeliveryTime: preferredDeliveryTime || null,
        deliveryInstructions: deliveryInstructions || null
      };
      await api.post("/orders", payload);
      await api.delete("/cart/clear");
      setCart([]);
      setOrderPlaced(true);
    } catch (err) {
      alert("Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md text-center">
          <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">Your medical supplies are being prepared for shipment.</p>
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium transition-colors">
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-800">My Shopping Bag ({cart.length})</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <ShoppingBag className="mx-auto text-slate-300 mb-4" size={64} />
            <h2 className="text-xl font-semibold text-slate-700">Your bag is empty</h2>
            <button onClick={() => navigate("/products")} className="mt-6 text-teal-600 font-bold hover:underline">
              Start Shopping &rarr;
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ITEM LIST */}
            <div className="flex-1 space-y-4">
              {cart.map(item => (
                <div key={item.productVariantId} className="bg-white rounded-2xl p-4 flex gap-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 p-2">
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{item.productName}</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                          {item.size && `Size: ${item.size}`}
                          {item.material && `${item.size ? " | " : ""}Material: ${item.material}`}
                        </p>
                      </div>
                      <button onClick={() => handleRemove(item.productVariantId)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button 
                          onClick={() => handleQuantityChange(item.productVariantId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-600 font-bold"
                        > − </button>
                        <span className="w-10 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.productVariantId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-600 font-bold"
                        > + </button>
                      </div>
                      <span className="text-lg font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CHECKOUT SIDEBAR */}
            <div className="w-full lg:w-[380px]">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl sticky top-24">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Order Details</h3>
                
                {/* Delivery Preferences */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 7a1 1 0 100-2 0v1a1 1 0 011-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1 1zM8 7a1 1 0 100-2 0v1a1 1 0 011 1 1H4a1 1 0 01-1-1V7a1 1 0 011-1 1z"/>
                    </svg>
                    Delivery Preferences (Optional)
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Delivery Date
                      </label>
                      <input
                        type="date"
                        value={preferredDeliveryDate}
                        onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Select delivery date (optional)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Delivery Time
                      </label>
                      <select
                        value={preferredDeliveryTime}
                        onChange={(e) => setPreferredDeliveryTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select time (optional)</option>
                        <option value="9:00 AM - 12:00 PM">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="12:00 PM - 6:00 PM">Afternoon (12:00 PM - 6:00 PM)</option>
                        <option value="6:00 PM - 9:00 PM">Evening (6:00 PM - 9:00 PM)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Instructions
                      </label>
                      <textarea
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Any special instructions for delivery (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-sm">Bag Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-sm">Delivery Fee</span>
                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-md tracking-tight">FREE</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mb-8 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-lg">Total Amount</span>
                  <span className="text-2xl font-black text-teal-600 tracking-tight">₹{subtotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 active:scale-[0.98] transition-all disabled:bg-slate-300 disabled:shadow-none"
                >
                  {placingOrder ? "Processing..." : "Confirm & Place Order"}
                </button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium px-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Safe & Secure Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
