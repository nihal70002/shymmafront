import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  User,
  ShieldCheck,
  Truck,
  Clock,
  Award
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { useEffect, useState } from "react";
import { getProducts } from "../../api/products.api";
import { motion } from "framer-motion";
import { getCategories } from "../../api/categories.api";
import api from "../../api/axios";


import { LogOut } from "lucide-react";








export default function Landing() {
  const navigate = useNavigate();

 const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [loadingSearch, setLoadingSearch] = useState(false);
const [showMobileSearch, setShowMobileSearch] = useState(false);


useEffect(() => {
  async function fetchData() {
    try {
      const [productRes, categoryRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      const products = productRes.data?.items || [];
      setFeaturedProducts(products.slice(0, 4));

      // show only main categories (no subcategories)
      const mainCategories = (categoryRes.data || []).filter(
        (c) => !c.parentCategoryId
      );

      setCategories(mainCategories);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);

useEffect(() => {
  if (!searchQuery.trim()) {
    setSuggestions([]);
    return;
  }

  const delayDebounce = setTimeout(async () => {
    try {
      setLoadingSearch(true);
      const res = await api.get("/products", {
        params: {
          page: 1,
          pageSize: 6,
          search: searchQuery.trim()
        }
      });
      setSuggestions(res.data?.items || []);
    } catch (err) {
      console.error("Landing search error", err);
      setSuggestions([]);
    } finally {
      setLoadingSearch(false);
    }
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

const handleSearchSubmit = () => {
  const query = searchQuery.trim();
  if (!query) return;
  navigate(`/products?search=${encodeURIComponent(query)}`);
  setShowDropdown(false);
  setShowMobileSearch(false);
};




  
 const newArrivals = [
  {
    id: 1,
    name: "Multifix Humeral Nail",
    desc: "A precision-engineered intramedullary fixation system designed to provide superior stability and anatomical alignment in humeral fracture management. Built with high-strength titanium alloy for long-term durability.",
    img: "/products/multifix.jpg",
    link: "/products/45"
  },
  {
    id: 2,
    name: "Femoral Neck System",
    desc: "An advanced fixation solution offering controlled compression and enhanced rotational stability for effective treatment of femoral neck fractures, supporting faster mobilization and reliable clinical outcomes.",
    img: "/products/walk.jpg",
    link: "/products/37"
  }
];

 const [categories, setCategories] = useState([]);



  const stats = [
    { icon: <ShieldCheck className="text-cyan-600" />, title: "ISO Certified", desc: "Quality guaranteed" },
    { icon: <Truck className="text-cyan-600" />, title: "Global Shipping", desc: "Fast & reliable delivery" },
    { icon: <Clock className="text-cyan-600" />, title: "24/7 Support", desc: "Expert medical assistance" },
    { icon: <Award className="text-cyan-600" />, title: "Premium Grade", desc: "Medical-grade titanium" },
  ];




  return (
    <div className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden pt-[58px] sm:pt-0">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed sm:sticky top-0 left-0 right-0 z-50 bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">

    {/* LOGO */}
    <Link to="/" className="flex items-center gap-2">
  <img
    src="/logo/logo.png"
    alt="logo"
    className="h-10 sm:h-19 md:h-22 w-auto object-contain"
  />
</Link>

    {/* SEARCH BAR */}
    <div className="hidden sm:flex flex-1 max-w-xl w-full mx-2">
      <div className="w-full relative">

        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />

        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {/* DROPDOWN */}
        {showDropdown && searchQuery.trim().length > 0 && (
          <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4">

            {loadingSearch && (
              <div className="text-sm text-gray-500 px-2 py-2">
                Searching...
              </div>
            )}

            {!loadingSearch && suggestions.length === 0 && (
              <div className="text-sm text-gray-500 px-2 py-2">
                No results found
              </div>
            )}

            {!loadingSearch && suggestions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                {suggestions.slice(0, 6).map((item) => (
                  <div
                    key={item.productId}
                    onClick={() => {
                      navigate(`/products/${item.productId}`);
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <img
                      src={item.primaryImageUrl || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover border border-gray-100"
                    />

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                        {item.name}
                      </span>

                      <span className="text-xs text-gray-500">
                        {item.brandName}
                      </span>

                    </div>
                  </div>
                ))}

              </div>
            )}

            {!loadingSearch && suggestions.length > 6 && (
              <div
                onClick={() => {
                  handleSearchSubmit();
                }}
                className="text-center mt-4 pt-3 border-t text-sm font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
              >
                View all results →
              </div>
            )}

          </div>
        )}

      </div>
    </div>

    {/* ACTION ICONS */}
    <div className="flex items-center gap-4 sm:gap-6 text-gray-600">

      <button
        onClick={() => setShowMobileSearch(prev => !prev)}
        className="sm:hidden flex flex-col items-center hover:text-black transition"
      >
        <Search size={22} />
        <span className="text-xs">Search</span>
      </button>

      {!localStorage.getItem("token") ? (
        <button
          onClick={() => navigate("/login")}
          className="flex flex-col items-center hover:text-black transition"
        >
          <User size={22} />
          <span className="text-xs">Login</span>
        </button>
      ) : (
        <>
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center hover:text-black transition"
          >
            <User size={22} />
            <span className="text-xs">Profile</span>
          </button>

          <button
  onClick={() => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  }}
  className="flex flex-col items-center hover:text-red-500 transition"
>
  <LogOut size={22} />
  <span className="text-xs">Logout</span>
</button>
        </>
      )}

      <button
        onClick={() => navigate("/cart")}
        className="flex flex-col items-center hover:text-black transition"
      >
        <ShoppingCart size={22} />
        <span className="text-xs">Cart</span>
      </button>

    </div>

  </div>
</nav>

{showMobileSearch && (
  <div className="sm:hidden fixed left-0 right-0 top-[58px] z-40 bg-white px-4 py-3 border-b border-gray-200 shadow-lg">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        autoFocus
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchSubmit();
          }
        }}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
      />
    </div>

    {searchQuery.trim().length > 0 && (
      <div className="mt-3 bg-white rounded-xl border border-gray-100 shadow-lg p-3">
        {loadingSearch && <div className="text-sm text-gray-500 px-2 py-2">Searching...</div>}

        {!loadingSearch && suggestions.length === 0 && (
          <div className="text-sm text-gray-500 px-2 py-2">No results found</div>
        )}

        {!loadingSearch &&
          suggestions.slice(0, 5).map((item) => (
            <div
              key={item.productId}
              onClick={() => {
                navigate(`/products/${item.productId}`);
                setSearchQuery("");
                setShowMobileSearch(false);
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={item.primaryImageUrl || "/placeholder.jpg"}
                alt={item.name}
                className="w-10 h-10 rounded-md object-cover border"
              />
              <div>
                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                <p className="text-xs text-gray-500">{item.brandName}</p>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
)}

      {/* ================= HERO SLIDER ================= */}
   {/* ================= HERO SLIDER ================= */}
<section className="w-full ">
  <Swiper
    modules={[Autoplay]}
    autoplay={{
      delay: 4000,
      disableOnInteraction: false,
    }}
    loop
    speed={900}
  >

    {/* VARICOSE */}





    <SwiperSlide>
      <div
        onClick={() => navigate("/products/512")}
        className="cursor-pointer w-full aspect-[1660/490]"
      >
        <img
          src="/posters/maxo.jpg"
          alt="Hinged Knee Brace"
          className="w-full h-auto object-cover"
          

        />
      </div>
    </SwiperSlide>


    

    {/* ELBOW */}
    <SwiperSlide>
      <div
        onClick={() => navigate("/products/602")}
        className="cursor-pointer w-full 

lg:aspect-[1660/490]"
      >
        <img
          src="/posters/mhn.jpg"
          alt="Elbow Binder"
          className="w-full h-auto object-cover"
         

        />
      </div>
    </SwiperSlide>

    {/* KNEE */}
    


    <SwiperSlide>
      <div
        onClick={() => navigate("/products/512")}
        className="cursor-pointer w-full aspect-[1660/490]"
      >
        <img
          src="/posters/fns.jpg"
          alt="Hinged Knee Brace"
          className="w-full h-auto object-cover"
          

        />
      </div>
    </SwiperSlide>

  </Swiper>
</section>



 {/* Adjusted margin: -mt-4 on mobile, -mt-8 on desktop */}
<div className="max-w-7xl mx-auto px-4 mt-2 sm:-mt-8 relative z-10">
  {/* Grid adjustment: 
      - p-4 on mobile to save space
      - gap-2 on mobile vs gap-4 on desktop 
  */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100">
    {stats.map((stat, i) => (
      <div key={i} className="flex items-center gap-2 sm:gap-4 p-1 sm:p-2">
        {/* Smaller icon container on mobile */}
        <div className="p-2 sm:p-3 bg-cyan-50 rounded-lg shrink-0">
          {/* Ensure the icon itself is smaller on mobile if possible, e.g., size={18} */}
          <div className="text-cyan-600 scale-75 sm:scale-100">
            {stat.icon}
          </div>
        </div>
        
        <div className="min-w-0"> {/* min-w-0 prevents text overflow issues */}
          {/* Smaller text on mobile: text-[10px] or text-xs */}
          <h4 className="font-bold text-[11px] sm:text-sm text-gray-900 truncate sm:whitespace-normal">
            {stat.title}
          </h4>
          <p className="text-[9px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-none">
            {stat.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>




      {/* ================= CATEGORIES ================= */}
    {/* ================= CATEGORIES ================= */}
    <section className="py-20 bg-white">
  <style>{`
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 6s linear infinite;
    }
  `}</style>

  <div className="max-w-7xl mx-auto px-6">
    {/* Company Branding Section */}
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-serif text-[#3a96a5] uppercase tracking-[0.2em] mb-3">
        Our Products
      </h2>
      <div className="flex justify-center mb-8">
        <div className="h-1 w-20 bg-red-600 rounded-full" />
      </div>
      <p className="max-w-4xl mx-auto text-gray-600 text-base md:text-lg leading-relaxed">
        We at <span className="font-bold text-gray-900">Shymma Surgicals</span> offer quality stainless steel and Titanium Orthopaedic Trauma Implants in a wide range. Our company ensures top-tier quality for every product.
      </p>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/category/${encodeURIComponent(cat.slug)}`}
          className="group flex flex-col items-center"
        >
          {/* The Animated Circle System */}
         <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-md border border-gray-100 group-hover:shadow-xl transition-all duration-500">

  <img
  src={cat.imageUrl || "/placeholder.jpg"}
  alt={cat.name}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
/>

</div>

          {/* Product Labeling */}
          <div className="mt-8 text-center">
            <h3 className="text-[11px] font-black text-[#3a96a5] uppercase tracking-[0.3em] mb-2">
              SHYMMA®
            </h3>
            <p className="text-base md:text-xl font-bold text-slate-800 group-hover:text-[#3a96a5] transition-colors duration-300 uppercase leading-tight">
              {cat.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

    
      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-gray-50 py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-cyan-600 font-semibold hover:underline"
            >
              View All →
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Loading State */}
            {loading && (
              <p className="col-span-full text-center text-gray-500">
                Loading products...
              </p>
            )}

            {/* Empty State */}
            {!loading && featuredProducts.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No featured products available.
              </p>
            )}

            {/* Products with Alternating Slide Animation */}
            {!loading &&
              featuredProducts.map((product, index) => {
                // Animation logic: Index 0,1 slide from Left (-100), Index 2,3 slide from Right (100)
                const direction = index < 2 ? -100 : 100;

                return (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, x: direction }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.25, 
                      delay: index * 0.03,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Link
                      to={`/products/${product.productId}`}
                      className="group block bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="bg-gray-50">
                        <img
                          src={product.primaryImageUrl || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4">
                        <p className="font-semibold text-sm line-clamp-2">
                          {product.name}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>


      {/* ================= NEW PRODUCTS ================= */}
<section className="pt-10 pb-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Header - More Professional Typography */}
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
      <div className="space-y-2">
        <span className="text-cyan-600 font-bold tracking-widest text-xs uppercase">Premium Range</span>
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight">
          Advanced <span className="italic text-slate-500">Trauma</span> Solutions
        </h2>
      </div>

      <Link
        to="/products"
        className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-cyan-600 transition-all"
      >
        View All Products 
        <span className="w-8 h-[1px] bg-slate-900 group-hover:bg-cyan-600 group-hover:w-12 transition-all"></span>
      </Link>
    </div>

    {/* Layout: Switch to 1 column on mobile, 2 on desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
      {newArrivals.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
          className="group"
        >
          <Link to={product.link} className="block">
            {/* Image Container: Fixed height for mobile, larger for desktop */}
            <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
              
              {/* Product Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                  New Arrival
                </span>
              </div>

             <img
  src={product.img}
  alt={product.name}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
/>
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Text Content */}
            <div className="mt-8 space-y-3 px-2">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8 bg-cyan-500"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {product.name}
                </h3>
              </div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">
                {product.desc}
              </p>

              <div className="pt-2 flex items-center text-cyan-600 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                Technical Specifications 
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
</section>



{/* ================= CERTIFICATION ================= */}
<section className="py-20 bg-[#f8fafc]">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid lg:grid-cols-2 gap-14 items-center">

      {/* LEFT CONTENT */}
      <div>
        <span className="text-cyan-600 font-bold tracking-[0.3em] text-xs uppercase">
          Certification
        </span>

        <h2 className="mt-4 text-4xl font-black text-slate-900 leading-tight">
          Authorized <span className="text-cyan-600">Distributor</span>
        </h2>

        <div className="w-20 h-1 bg-red-600 rounded-full mt-5 mb-7"></div>

        <p className="text-gray-600 leading-relaxed text-lg">
          Shymma Surgicals is an officially authorized distributor
          of SIORA orthopedic implants and instrumentation products.
          We ensure genuine products, trusted quality standards,
          and reliable surgical solutions for healthcare professionals.
        </p>

        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-600"></div>
            <p className="text-gray-700 font-medium">
              Verified Distribution Partner
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-600"></div>
            <p className="text-gray-700 font-medium">
              Certified Orthopedic Implant Supplier
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-600"></div>
            <p className="text-gray-700 font-medium">
              Trusted Medical Equipment Provider
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 hover:scale-[1.02] transition duration-500">
          <img
            src="/certificate/certificate.jpeg"
            alt="Certification"
            className="w-full max-w-md rounded-2xl object-cover"
          />
        </div>
      </div>

    </div>

  </div>
</section>









      {/* ================= FOOTER ================= */}
     <footer className="bg-gray-900 text-white py-12 mt-16">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
    
    <div>
      <h3 className="font-bold mb-4">Shymma Surgicals</h3>
      <p className="text-sm text-gray-400">
        Authorised dealer of orthopedic implants and medical instruments including 
        GREENS, SIORA, ORMED, DYNA & MGRM products.
      </p>
    </div>

    <div>
      <h4 className="font-semibold mb-4">Shop</h4>
      <ul className="space-y-2 text-sm text-gray-400">
        <li><Link to="/products">All Products</Link></li>
        <li><Link to="/products?category=Orthopedic">Orthopedic Implants</Link></li>
        <li><Link to="/products?category=Instruments">Medical Instruments</Link></li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold mb-4">Support</h4>
      <ul className="space-y-2 text-sm text-gray-400">
        <li>Contact Us</li>
        <li>Shipping Policy</li>
        <li>Returns</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold mb-4">Contact</h4>
      <p className="text-sm text-gray-400">
        Kozhikode Medical College, Kerala, India <br />
        +91 9447360390 <br />
        shymmasurgicals.in
      </p>
    </div>

  </div>

  <div className="text-center text-xs text-gray-500 mt-10">
    © 2026 Shymma Surgicals. All rights reserved.
  </div>
</footer>

    </div>
  );
}