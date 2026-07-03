import React from "react";
import { MapPin, Phone, Clock, Mail, Building2, Stethoscope } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-cyan-50 text-lg max-w-2xl">
            Get in touch with Shymma Surgicals for product inquiries, quotations, bulk orders, and customer support.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Contact Description */}
        <div className="mb-12">
          <p className="text-gray-700 leading-relaxed text-lg">
            We are committed to providing quality surgical instruments, medical equipment, and healthcare solutions. 
            For product inquiries, quotations, bulk orders, distributorship information, or customer support, 
            please contact us using the details below or visit our store during business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="p-3 bg-cyan-100 rounded-xl shrink-0">
                <Building2 className="text-cyan-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Business Name</h3>
                <p className="text-gray-700">Shymma Surgicals</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="p-3 bg-cyan-100 rounded-xl shrink-0">
                <MapPin className="text-cyan-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Address</h3>
                <p className="text-gray-700 leading-relaxed">
                  Spencer Plaza Building,<br />
                  Opposite Government Medical College,<br />
                  Medical College,<br />
                  Kozhikode,<br />
                  Kerala – 673008,<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="p-3 bg-cyan-100 rounded-xl shrink-0">
                <Phone className="text-cyan-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                <p className="text-gray-700">+91 495 2351125</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="p-3 bg-cyan-100 rounded-xl shrink-0">
                <Stethoscope className="text-cyan-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Business Category</h3>
                <p className="text-gray-700">Surgical Equipment & Medical Supplies</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="p-3 bg-cyan-100 rounded-xl shrink-0">
                <Clock className="text-cyan-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Working Hours</h3>
                <p className="text-gray-700">
                  Monday to Saturday<br />
                  9:00 AM – 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Map / Additional Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-3xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-600 rounded-xl text-white">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Visit Our Store</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Conveniently located opposite Government Medical College, Kozhikode. 
                Visit us during business hours for personalized assistance and product demonstrations.
              </p>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="text-gray-400" size={48} />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Map integration available
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-600 rounded-xl text-white">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Quick Response</h3>
              </div>
              <p className="text-gray-600 mb-4">
                For faster response, you can also reach us via email or visit our Downloads section 
                for product catalogues and detailed information.
              </p>
              <div className="flex gap-4">
                <a
                  href="/downloads"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
                >
                  View Downloads
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
