import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/products.api";
import { addToCartApi, getCart } from "../../api/cart.api";
import ProductCard from "../../components/products/ProductCard";
import { ShoppingCart, User, Package, Search, ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import api from "../../api/axios";



export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");


  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const PAGE_SIZE = 12;
const [selectedCategories, setSelectedCategories] = useState([]);
const [brands, setBrands] = useState([]);
const [selectedBrand, setSelectedBrand] = useState(null);
const [showCategorySearch, setShowCategorySearch] = useState(false);
const [showBrandSearch, setShowBrandSearch] = useState(false);
const [categorySearch, setCategorySearch] = useState("");
const [brandSearch, setBrandSearch] = useState("");
const [allCategories, setAllCategories] = useState([]); // Holds all categories from DB
const [showAllCategories, setShowAllCategories] = useState(false); 



const observer = useRef();



const loadProducts = useCallback(async (pageNo, reset = false) => {
  try {
    setLoading(true);

    console.log("FETCHING PRODUCTS:", {
      page: pageNo,
      selectedCategories,
      brand: selectedBrand,
      search: searchQuery
    });

    const res = await getProducts(
      pageNo,
      PAGE_SIZE,
      selectedCategories,
      selectedBrand,
      searchQuery
    );

    const items = res.data.items || [];

    setProducts(prev =>
      reset ? items : [...prev, ...items]
    );

    setHasMore(res.data.hasMore);
    setPage(pageNo);

  } catch (err) {
    console.error("LOAD PRODUCTS ERROR:", err);
  } finally {
    setLoading(false);
  }
}, [selectedCategories, selectedBrand, searchQuery]);





const lastProductRef = useCallback(node => {
  if (loading) return;
  if (observer.current) observer.current.disconnect();

  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      const nextPage = page + 1;
      loadProducts(nextPage);
    }
  });

  if (node) observer.current.observe(node);
}, [loading, hasMore, page, selectedCategories, selectedBrand, searchQuery]);





// This effect runs on mount AND whenever filters change
useEffect(() => {
  setPage(1);
  setHasMore(true);
  loadProducts(1, true);
}, [selectedCategories, selectedBrand, searchQuery, loadProducts]);




// Keep loadCart separate so it only runs once on mount
useEffect(() => {
  loadCart();
}, []);



useEffect(() => {
  const queryFromUrl = searchParams.get("search") || "";
  setSearchQuery(queryFromUrl);
}, [searchParams]);

// If search is cleared, ensure we are on the base products route
useEffect(() => {
  if (searchQuery === "" && searchParams.get("search")) {
    navigate("/products", { replace: true });
  }
}, [searchQuery, navigate, searchParams]);



useEffect(() => {
  if (searchQuery === "") {
    navigate("/products", { replace: true });
  }
}, [searchQuery]);


const loadCart = async () => {
  const cartRes = await getCart();
  setCartCount(cartRes.data?.length || 0);
};








useEffect(() => {
  const loadFilters = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data || []);
    } catch (err) {
      console.error("Failed to load brands", err);
    }
  };

  loadFilters();
}, []);


useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setAllCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  loadCategories();
}, []);







  const handleAddToCart = async (variantId) => {
    try {
      await addToCartApi(Number(variantId), 1);
      const updatedCart = await getCart();
      setCartCount(updatedCart.data?.length || 0);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-teal-600 text-white px-5 py-2.5 rounded-md shadow-lg font-medium z-50 text-xs';
      notification.textContent = '✓ Added to bag';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };





const toggleCategory = (categoryId) => {
  setSelectedCategories(prev =>
    prev.includes(categoryId)
      ? prev.filter(id => id !== categoryId)
      : [...prev, categoryId]
  );
};


const clearFilters = () => {
  setSelectedCategories([]);
  setSelectedBrand(null);
  setCategorySearch("");
  setBrandSearch("");
  setShowCategorySearch(false);
  setShowBrandSearch(false);
  setSearchQuery("");
};

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "instant" });
}, [searchParams]);

const filteredProducts = products;


  if (loading && products.length === 0) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent mb-4"></div>
      <p className="text-gray-500 font-medium">Fetching the latest styles...</p>
    </div>
  );
}

console.log(allCategories);
  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">

    


     

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 px-6 py-3 max-w-screen-2xl mx-auto text-xs">
          <span onClick={() => navigate("/")} className="text-gray-600 hover:text-teal-600 cursor-pointer font-medium transition-colors">
            Home
          </span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-bold text-teal-700">All Products</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {/* MAIN CONTENT */}
<div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto overflow-x-hidden">




        {/* SIDEBAR FILTERS */}
        
 <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 p-4 sticky top-24">




  {/* FILTER HEADER */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <SlidersHorizontal size={18} className="text-teal-600" />
      <h3 className="text-xs font-bold text-gray-900">FILTERS</h3>
    </div>
    <button
      onClick={clearFilters}
      className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
    >
      CLEAR
    </button>
  </div>

  {/* CATEGORIES */}
  <div className="mb-6 pb-6 border-b border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-xs font-bold text-gray-900">CATEGORIES</h4>
      <button
        onClick={() => setShowCategorySearch(prev => !prev)}
        className="text-gray-400 hover:text-teal-600"
      >
        <Search size={14} />
      </button>
    </div>

    {showCategorySearch && (
      <input
        autoFocus
        type="text"
        placeholder="Search category"
        value={categorySearch}
        onChange={(e) => setCategorySearch(e.target.value)}
        className="w-full mb-3 px-2 py-1 text-xs border rounded-md"
      />
    )}

    <div className="space-y-1">
  {(showAllCategories
    ? allCategories
    : allCategories.slice(0, 8))
    .filter(cat =>
  (cat?.name || "")

    .toLowerCase()
    .includes(categorySearch.toLowerCase())
)

    .map((cat) => (
      <label
        key={cat.id}

        className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-teal-700 transition-colors"
      >
        <input
          type="checkbox"
          checked={selectedCategories.includes(cat.id)}
          onChange={() => toggleCategory(cat.id)}
          className="w-4 h-4 rounded border-gray-300 text-teal-600"
        />
        <span className="leading-snug">
          {cat.name}
        </span>
      </label>
    ))}

  {/* 👇 ADD THIS BUTTON RIGHT HERE */}
  {allCategories.length > 8 && (
    <button
      onClick={() => setShowAllCategories(!showAllCategories)}
      className="text-xs font-semibold text-teal-600 mt-2"
    >
      {showAllCategories ? "Show Less" : "More"}
    </button>
  )}
</div>
</div>


  {/* BRAND */}
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-xs font-bold text-gray-900">BRAND</h4>
      <button
        onClick={() => setShowBrandSearch(prev => !prev)}
        className="text-gray-400 hover:text-indigo-600"
      >
        <Search size={14} />
      </button>
    </div>

    {showBrandSearch && (
      <input
        autoFocus
        type="text"
        placeholder="Search brand"
        value={brandSearch}
        onChange={(e) => setBrandSearch(e.target.value)}
        className="w-full mb-3 px-2 py-1 text-xs border rounded-md"
      />
    )}

    <div className="space-y-2">
      {brands
        .filter(brand =>
          brand.brandName
            .toLowerCase()
            .includes(brandSearch.toLowerCase())
        )
        .map((brand) => (
          <label
            key={brand.brandId}
            className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedBrand === brand.brandId}
              onChange={() =>
                setSelectedBrand(
                  selectedBrand === brand.brandId ? null : brand.brandId
                )
              }
              className="accent-indigo-600"
            />
            {brand.brandName}
          </label>
        ))}
    </div>
  </div>

  {/* Price (unchanged placeholder) */}
  <div className="mb-4">
    <div className="space-y-3"></div>
  </div>

</aside>


{/* PRODUCTS SECTION */}
<main className="flex-1 lg:pl-6 mt-6 lg:mt-0">
  {/* Header Bar */}
  <div className="flex items-center justify-between mb-4 px-2 py-2 border-b border-gray-200">
    <h1 className="text-base font-bold text-gray-900">
      {filteredProducts.length} <span className="font-normal text-gray-600">Products</span>
    </h1>
  </div>

  {/* Updated Grid: gap-1 fixes the left/right overflow on mobile */}
  <div className="grid grid-cols-2 gap-1 md:gap-4 lg:grid-cols-4">
    {filteredProducts.map((product, index) => (
      <div 
        key={product.productId} 
        ref={index === filteredProducts.length - 1 ? lastProductRef : null}
      >
        <ProductCard product={product} onAddToCart={handleAddToCart} />
      </div>
    ))}
  </div>

  {/* Loading Spinner for Infinite Scroll */}
  {loading && (
    <div className="flex justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
    </div>
  )}
</main>
      </div>
   



{showFilters && (
  <div className="fixed inset-0 bg-black/50 z-[100] lg:hidden">
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        <button onClick={() => setShowFilters(false)} className="p-2 text-gray-500">
          <ChevronRight className="rotate-90" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8">
        {/* REUSE CATEGORY SECTION */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4">CATEGORIES</h4>
          <div className="grid grid-cols-1 gap-3">
            {allCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 text-sm">
  <input
    type="checkbox"
    checked={selectedCategories.includes(cat.id)}
    onChange={() => toggleCategory(cat.id)}
    className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
  />
  {cat.name}
</label>

            ))}
          </div>
        </div>

        {/* REUSE BRAND SECTION */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4">BRANDS</h4>
          <div className="grid grid-cols-1 gap-3">
            {brands.map((brand) => (
              <label key={brand.brandId} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBrand === brand.brandId}
                  onChange={() => setSelectedBrand(selectedBrand === brand.brandId ? null : brand.brandId)}
                  className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                {brand.brandName}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-4 border-t flex gap-4">
        <button onClick={clearFilters} className="flex-1 py-3 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg">
          CLEAR ALL
        </button>
        <button onClick={() => setShowFilters(false)} className="flex-1 py-3 text-sm font-bold text-white bg-teal-600 rounded-lg">
          APPLY
        </button>
      </div>
    </div>
  </div>
)}





{/* MOBILE BOTTOM BAR */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-1 lg:hidden z-50">

 

  <button
    onClick={() => setShowFilters(true)}
    className="text-sm font-medium"
  >
    FILTER
  </button>

</div>



      {/* Footer */}
      <footer className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-10 mt-20">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">


            <div>
              <h3 className="font-bold mb-4 text-lg">About Us</h3>
              <p className="text-teal-100 text-sm leading-relaxed">
                Premium quality medical and industrial products for your needs.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2 text-teal-100 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Products</li>
                <li className="hover:text-white cursor-pointer transition-colors">Orders</li>
                <li className="hover:text-white cursor-pointer transition-colors">Profile</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Support</h3>
              <ul className="space-y-2 text-teal-100 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Returns</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Contact</h3>
              <p className="text-teal-100 text-sm">
                Email: support@safa.store<br />
                Phone: +1 234 567 890
              </p>
            </div>
          </div>
          <div className="border-t border-teal-600 pt-6 text-center">
            <p className="text-sm text-teal-200">
              © 2026 Safa Al-Tamayyuz Trading. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>
    </div>
  );
}