import React from "react";
import { Heart, Award, ShieldCheck, Users, Target, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">About Shymma Surgicals</h1>
          <p className="text-cyan-50 text-lg max-w-2xl">
            Your trusted partner for surgical instruments, medical equipment, and healthcare solutions in Kerala.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Welcome to <span className="font-bold text-cyan-600">Shymma Surgicals</span>, a trusted supplier of surgical instruments, medical equipment, healthcare consumables, and surgical supplies based in Kozhikode, Kerala.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Located near the Government Medical College, Kozhikode, Shymma Surgicals has been committed to serving hospitals, clinics, healthcare professionals, laboratories, and individual customers with high-quality medical and surgical products.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Our extensive product range includes surgical instruments, medical disposables, hospital equipment, diagnostic products, orthopedic supplies, and healthcare accessories sourced from trusted manufacturers and authorized brands.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              At Shymma Surgicals, we believe in delivering quality products, reliable service, competitive pricing, and exceptional customer support. Our mission is to provide dependable healthcare solutions while maintaining the highest standards of professionalism and customer satisfaction.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              We strive to build long-term relationships with our customers by ensuring product quality, timely service, and trusted healthcare solutions.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-cyan-100 rounded-xl">
              <Heart className="text-cyan-600" size={28} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="text-cyan-600" />,
                title: "Quality & Reliability",
                description: "We provide only the highest quality medical products from trusted manufacturers and authorized brands."
              },
              {
                icon: <Users className="text-cyan-600" />,
                title: "Customer Satisfaction",
                description: "Our customers are our priority. We ensure exceptional service and support at every step."
              },
              {
                icon: <ShieldCheck className="text-cyan-600" />,
                title: "Professional Service",
                description: "We maintain the highest standards of professionalism in all our business operations."
              },
              {
                icon: <Target className="text-cyan-600" />,
                title: "Trusted Healthcare Solutions",
                description: "We deliver dependable healthcare solutions that healthcare professionals can rely on."
              },
              {
                icon: <CheckCircle className="text-cyan-600" />,
                title: "Commitment to Excellence",
                description: "We are committed to excellence in product quality, service, and customer relationships."
              }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-cyan-50 rounded-xl w-fit mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-3xl p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 bg-cyan-600 rounded-2xl text-white">
              <Heart size={48} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Serving Healthcare Since Day One
              </h3>
              <p className="text-gray-600">
                Strategically located near Government Medical College, Kozhikode, we are perfectly positioned to serve the healthcare needs of the region with quick access and reliable service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
