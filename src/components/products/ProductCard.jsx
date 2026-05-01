import React from "react";
import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/products/${product.productId}`);
  };

  return (
    <div className="group flex h-[310px] sm:h-[340px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      
      {/* IMAGE (UNCHANGED) */}
      <div
  onClick={handleView}
  className="relative h-[220px] sm:h-60 w-full flex-shrink-0 cursor-pointer rounded-t-2xl 
             bg-white flex items-center justify-center overflow-hidden
             transition"
>

        <img
  src={product.primaryImageUrl}
  alt={product.name}
  className="h-full w-full object-contain 
             p-2 scale-110 
             transition-transform duration-300 
             group-hover:scale-125"
  onError={(e) => {
    e.currentTarget.src = "/no-image.png";
  }}
/>

      </div>

      {/* CONTENT */}
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-3">

        {/* BRAND */}
        {product.brandName && (
          <p className="h-4 truncate text-[10px] font-bold text-slate-600 tracking-wide uppercase">
            {product.brandName}
          </p>
        )}

        {/* PRODUCT NAME */}
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900 leading-snug">
          {product.name}
        </h3>

      </div>
    </div>
  );
}
