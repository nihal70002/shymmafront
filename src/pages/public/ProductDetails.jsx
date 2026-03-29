import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products.api";
import { addToCartApi } from "../../api/cart.api";
import {
  ChevronLeft, ShoppingCart, Star, ChevronRight, Plus, Minus
} from "lucide-react";

import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCartFromApi } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(id);
        const images = res.data.imageUrls?.length
          ? res.data.imageUrls
          : res.data.primaryImageUrl
            ? [res.data.primaryImageUrl]
            : [];

        const mappedProduct = {
          id: res.data.productId,
          name: res.data.name,
          category: res.data.categoryName,
          description: res.data.description,
          images,
          variants: (res.data.sizes || []).map(v => ({
            id: v.variantId,
            class: v.class,
            size: v.size,
            price: v.price,
            stock: v.availableStock
          }))
        };

        setProduct(mappedProduct);
        setSelectedImage(0);
        if (mappedProduct.variants.length > 0) {
          const first = mappedProduct.variants[0];
          setSelectedClass(first.class || null);
          setSelectedVariant(first);
        }
      } catch (err) {
        console.error("Failed to load product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const classOptions = [...new Set(product?.variants?.map(v => v.class).filter(Boolean))];

  const filteredVariants = product?.variants?.filter(v => 
    !selectedClass || v.class === selectedClass
  ) || [];

  useEffect(() => {
    if (filteredVariants.length > 0) {
      setSelectedVariant(filteredVariants[0]);
    }
  }, [selectedClass, product]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      setAddingToCart(true);
      await addToCartApi(selectedVariant.id, quantity);
      const res = await api.get("/cart");
      setCartFromApi(res.data.length || 0);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-3 border-teal-600 border-t-transparent mx-auto"></div>
    </div>
  );

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-10">
      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-24 right-6 z-[9999] bg-teal-600 text-white px-6 py-3 rounded-md shadow-2xl font-bold animate-bounce">
          ✓ {quantity} item(s) added to bag
        </div>
      )}

      {/* BREADCRUMB */}
      <div className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 text-xs flex items-center gap-2 text-gray-500">
          <span className="cursor-pointer hover:text-teal-600" onClick={() => navigate("/")}>Home</span>
          <ChevronRight size={12} />
          <span>{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto lg:mt-4">
        {/* TOP SECTION: IMAGE & BUYING CONTROLS */}
        <div className="flex flex-col lg:flex-row bg-white shadow-sm border-b lg:border-b-0">
          
          {/* LEFT: IMAGES */}
          <div className="w-full lg:w-[60%] p-4 lg:p-8 border-r border-gray-100">
            <div className="relative h-[400px] lg:h-[600px] w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105" 
              />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length-1 : prev-1)} className="absolute left-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"><ChevronLeft /></button>
                  <button onClick={() => setSelectedImage(prev => prev === product.images.length-1 ? 0 : prev+1)} className="absolute right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"><ChevronRight /></button>
                </>
              )}
            </div>
            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 justify-center">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${selectedImage === i ? "border-teal-600 shadow-md" : "border-gray-200"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRICING & SELECTION */}
          <div className="w-full lg:w-[40%] p-6 lg:p-10 flex flex-col">
            <h2 className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-1">{product.category}</h2>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-teal-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm font-bold">
                4.8 <Star size={12} className="fill-white" />
              </div>
              <span className="text-gray-400 text-sm border-l pl-2">Medical Grade Certified</span>
            </div>

            <div className="mb-8">
              <div className="text-3xl font-black text-gray-900">₹{selectedVariant?.price ?? "--"}</div>
              <div className="text-teal-700 text-sm font-semibold mt-1">Inclusive of all taxes</div>
            </div>

            {/* CLASS SELECTOR */}
            {classOptions.length > 0 && (
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select Class</label>
                <div className="flex gap-2 flex-wrap">
                  {classOptions.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setSelectedClass(opt)}
                      className={`px-4 py-2 rounded-md border-2 font-bold text-sm transition-all ${selectedClass === opt ? "border-teal-600 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600 hover:border-teal-200"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY & ADD TO BAG */}
            <div className="mt-auto">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Quantity</label>
              <div className="flex gap-4 items-center">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden h-12">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 hover:bg-gray-50"><Minus size={16}/></button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="px-4 hover:bg-gray-50"><Plus size={16}/></button>
                </div>
                <button 
                  disabled={addingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-teal-100 transition-all disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  {addingToCart ? "ADDING..." : "ADD TO BAG"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: FULL WIDTH TABLE (MIDDLE) */}
        <div className="bg-white mt-6 shadow-sm border-t lg:border border-gray-100 p-6 lg:p-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider border-b-4 border-teal-600 inline-block pb-1">
            Product Description & Components
          </h3>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-bold text-gray-700 w-40">Cat No.</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Product Name</th>
                  <th className="px-6 py-4 font-bold text-gray-700 w-24 text-center">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(product.description || "")
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, index) => {
                    const parts = line.split(":");
                    // Smart detection: if no colons, treat whole line as product name
                    const catNo = parts.length > 1 ? parts[0]?.trim() : "---";
                    const name = parts.length > 1 ? parts[1]?.trim() : parts[0]?.trim();
                    const unit = parts[2]?.trim() || "1";

                    return (
                      <tr key={index} className="hover:bg-teal-50/30 transition-colors group">
                        <td className="px-6 py-4 font-mono text-teal-700 font-medium group-hover:text-teal-900">
                          {catNo}
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium leading-relaxed">
                          {name}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-500 font-bold">
                          {unit}
                        </td>
                      </tr>
                    );
                  })}

                {/* SPECIFICATIONS SUB-TABLE */}
                <tr className="bg-gray-50/80">
                  <td className="px-6 py-4 font-bold text-gray-900 border-t-2 border-gray-200">Category</td>
                  <td colSpan="2" className="px-6 py-4 text-gray-700 border-t-2 border-gray-200">{product.category}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">Material</td>
                  <td colSpan="2" className="px-6 py-4 text-gray-700">Premium Quality Stainless Steel / Medical Grade</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">Warranty</td>
                  <td colSpan="2" className="px-6 py-4 text-gray-700">1 Year Manufacturer Warranty</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex items-center gap-6 text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div> ISO 13485 Certified</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div> CE Marked</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Autoclavable</div>
          </div>
        </div>
      </div>
    </div>
  );
}