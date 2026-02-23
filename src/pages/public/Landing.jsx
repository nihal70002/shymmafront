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









export default function Landing() {
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  async function fetchProducts() {
    try {
      const res = await getProducts();

      // Backend returns { items: [...] }
      const products = res.data?.items || [];

      setFeaturedProducts(products.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, []);




  
 const newArrivals = [
  {
    id: 1,
    name: "Multifix Humeral Nail",
    desc: "A precision-engineered intramedullary fixation system designed to provide superior stability and anatomical alignment in humeral fracture management. Built with high-strength titanium alloy for long-term durability.",
    img: "/products/multifix.jpg",
    link: "/products/multifix-humeral-nail"
  },
  {
    id: 2,
    name: "Femoral Neck System",
    desc: "An advanced fixation solution offering controlled compression and enhanced rotational stability for effective treatment of femoral neck fractures, supporting faster mobilization and reliable clinical outcomes.",
    img: "/products/walk.jpg",
    link: "/products/femoral-neck-system"
  }
];

 const categories = [
  { id: 2, name: "Locking Plate System", slug: "locking-plate-system", img: "/categories/locking-plate.jpg" },
  { id: 3, name: "Locking Hand System", slug: "locking-hand-system", img: "/categories/locking-hand.jpg" },
  { id: 4, name: "Locking System", slug: "locking-system", img: "/categories/locking-system.jpg" },
  { id: 5, name: "Radial Head Prosthesis", slug: "radial-head-prosthesis", img: "/categories/radial-head.jpg" },
  { id: 6, name: "Bipolar Prosthesis", slug: "bipolar-prosthesis", img: "/categories/bipolar.jpg" },
  { id: 7, name: "PFNA Nailing System", slug: "pfna-nailing-system", img: "/categories/pfna.jpg" },
  { id: 8, name: "Cannulated Compression System", slug: "cannulated-compression-system", img: "/categories/cannulated.jpg" },
];



  const stats = [
    { icon: <ShieldCheck className="text-cyan-600" />, title: "ISO Certified", desc: "Quality guaranteed" },
    { icon: <Truck className="text-cyan-600" />, title: "Global Shipping", desc: "Fast & reliable delivery" },
    { icon: <Clock className="text-cyan-600" />, title: "24/7 Support", desc: "Expert medical assistance" },
    { icon: <Award className="text-cyan-600" />, title: "Premium Grade", desc: "Medical-grade titanium" },
  ];




  return (
    <div className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo/logo.png" className="h-20 w-24" alt="logo" />
           
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:flex">
            <div className="w-full relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/products?search=${e.target.value}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <Link to="/login"><User size={22} /></Link>
            <Link to="/cart"><ShoppingCart size={22} /></Link>
          </div>
        </div>
      </nav>

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
          src="/posters/maxo.jpg"
          alt="Hinged Knee Brace"
          className="w-full h-auto object-cover"
          

        />
      </div>
    </SwiperSlide>


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
<div className="max-w-7xl mx-auto px-4 -mt-4 sm:-mt-8 relative z-10">
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/category/${cat.slug}`}
          className="group flex flex-col items-center"
        >
          {/* The Animated Circle System */}
          <div className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center">
            
            {/* 1. The 3/4 Spinning Line (Non-dotted, Solid) */}
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#3a96a5] border-r-[#3a96a5] border-l-[#3a96a5] animate-spin-slow" />
            
            {/* 2. Static Inner Decorative Ring */}
            <div className="absolute inset-[6px] rounded-full border border-gray-100 shadow-sm" />

            {/* 3. Product Image Container */}
            <div className="relative w-[85%] h-[85%] rounded-full overflow-hidden bg-white shadow-inner">
              <img
                src={cat.img}
                alt={cat.name}
                // Zoomed to 160% to crop out poster text and focus on hardware
                className="w-full h-full object-cover scale-[1.6] group-hover:scale-[1.8] transition-transform duration-700 ease-in-out"
              />
            </div>
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
            transition={{ duration: 1 }}
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
                const price =
                  product.variants?.find((v) => v.availableStock > 0)?.price ||
                  product.variants?.[0]?.price ||
                  0;

                // Animation logic: Index 0,1 slide from Left (-100), Index 2,3 slide from Right (100)
                const direction = index < 2 ? -100 : 100;

                return (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, x: direction }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 1.2, 
                      delay: index * 0.1, // Slight stagger so they don't hit at the exact same time
                      ease: [0.22, 1, 0.36, 1] // Smooth "S-curve" easing
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
                        <p className="text-cyan-600 font-bold mt-2">
                          ₹{price}
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
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Header - More Professional Typography */}
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
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
          transition={{ duration: 0.8, delay: index * 0.1 }}
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









      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold mb-4">Safa Store</h3>
            <p className="text-sm text-gray-400">
              Premium medical and orthopedic supplies delivered across KSA.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Orthopedic">Orthopedic</Link></li>
              <li><Link to="/products?category=Surgical">Surgical</Link></li>
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
              Jeddah, Saudi Arabia <br />
              +966 12 6513490
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-10">
          © 2026 Safa Store. All rights reserved.
        </div>
      </footer>

    </div>
  );
}