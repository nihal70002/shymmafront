import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
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
      name: "NewMom Maternity Pad",
      desc: "Designed for maximum absorbency and gentle care, Newmom Maternity Pads offer superior protection and comfort during the postpartum period. Perfect for new mothers.",
      img: "/products/maternity-pad.jpg", // Replace with your actual path
      link: "/products/maternity-pad"
    },
    {
      id: 2,
      name: "Dyna Hinged Knee Brace",
      desc: "A premium wrap-around knee brace featuring dual metal hinges for superior medial-lateral stability with soft neoprene construction that delivers comfortable compression.",
      img: "/products/kneebrace.jpg", // Replace with your actual path
      link: "/products/knee-brace"
    }
  ];

 const categories = [
  { id: 1, name: "Supports & Braces", img: "/categories/supports.jpg" },
  { id: 3, name: "Lumbo Sacral (Back) and Abdominal Supports", img: "/categories/lumbo.jpg" },
  { id: 4, name: "Cervical (Neck) Care", img: "/categories/cervical.jpg" },
  { id: 5, name: "Mobility Aids", img: "/categories/mobility.jpg" },
  { id: 6, name: "Traction Kits", img: "/categories/traction.jpg" },
  { id: 7, name: "Compression Therapy", img: "/categories/compression.jpg" },
  { id: 8, name: "Exercise Essentials", img: "/categories/exercise.jpg" },
  { id: 9, name: "Wound Care/Bandages", img: "/categories/wound.jpg" },
  { id: 10, name: "Casting Aids", img: "/categories/casting.jpg" },
  { id: 11, name: "Foot Care", img: "/categories/foot.jpg" },
];




  return (
    <div className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo/logo.png" className="h-9" alt="logo" />
           
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





      {/* ================= CATEGORIES ================= */}
    {/* ================= CATEGORIES ================= */}
      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }} // Slowed title reveal
            className="text-2xl sm:text-3xl font-bold text-center mb-10"
          >
            Shop By Category
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -50 }} // Increased distance for a more noticeable slide
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ 
                  duration: 0.8,      // Increased duration (was 0.5)
                  delay: i * 0.2,     // Increased stagger time (was 0.1)
                  ease: [0.21, 0.45, 0.32, 0.9] // Custom cubic-bezier for a "smooth stop" feel
                }}
              >
                <Link
                  to={`/products?categoryId=${cat.id}`}
                  className="group block bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="h-32 sm:h-40 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="p-4 text-center font-semibold text-sm sm:text-base">
                    {cat.name}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
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
  <div className="w-full px-6 lg:px-12">

    {/* Header */}
    <div className="flex justify-between items-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        New Arrivals
      </h2>
      <Link
        to="/products?sort=new"
        className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors flex items-center gap-1"
      >
        View All <span className="text-xl">→</span>
      </Link>
    </div>

    {/* 2 Column Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

      {newArrivals.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className="group cursor-pointer"
        >
          <Link to={product.link}>

            {/* Bigger Image Container */}
            <div className="relative overflow-hidden rounded-xl bg-gray-50 h-[420px]">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Text */}
            <div className="space-y-4 mt-6">
              <h3 className="text-2xl font-bold text-blue-900 group-hover:text-cyan-600 transition-colors">
                {product.name}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {product.desc}
                <span className="text-cyan-600 font-medium ml-1 hover:underline">
                  Read More
                </span>
              </p>
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