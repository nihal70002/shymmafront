import React from "react";
import { Download, FileText, ShieldCheck, Building2, Award, Package, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const downloads = [
  {
    id: 1,
    title: "Authorized Distributor Certificate",
    description: "Official certificate verifying Shymma Surgicals as an authorized distributor of SIORA orthopedic implants and medical equipment.",
    icon: <ShieldCheck className="text-cyan-600" />,
    file: "/certificate/certificate.jpeg",
    category: "Certification"
  },
  {
    id: 2,
    title: "Company Registration Document",
    description: "Official company registration certificate establishing Shymma Surgicals as a registered business entity in Kerala, India.",
    icon: <Building2 className="text-cyan-600" />,
    file: "/docs/company-registration.pdf",
    category: "Legal"
  },
  {
    id: 3,
    title: "GST Registration Certificate",
    description: "Goods and Services Tax registration certificate for tax compliance and official business operations.",
    icon: <FileText className="text-cyan-600" />,
    file: "/docs/gst-certificate.pdf",
    category: "Tax"
  },
  {
    id: 4,
    title: "Medical Equipment Certification",
    description: "Certification for medical equipment and surgical instruments compliance with healthcare standards.",
    icon: <Award className="text-cyan-600" />,
    file: "/certificate/certificate2.jpeg",
    category: "Certification"
  },
  {
    id: 5,
    title: "Product Catalogue 2026",
    description: "Complete product catalogue featuring our extensive range of surgical instruments, orthopedic implants, and medical supplies.",
    icon: <Package className="text-cyan-600" />,
    file: "/docs/product-catalogue.pdf",
    category: "Catalogue"
  },
  {
    id: 6,
    title: "Orthopedic Implants Brochure",
    description: "Detailed brochure showcasing our orthopedic implant product line including technical specifications and applications.",
    icon: <FileText className="text-cyan-600" />,
    file: "/docs/orthopedic-brochure.pdf",
    category: "Brochure"
  }
];

export default function Downloads() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Download size={32} />
            </div>
            <h1 className="text-4xl font-bold">Downloads</h1>
          </div>
          <p className="text-cyan-50 text-lg max-w-2xl">
            Access our official documents, certificates, product catalogues, and brochures. 
            All documents are available for viewing and download.
          </p>
        </div>
      </div>

      {/* Downloads Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {downloads.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50 flex gap-3">
                <button
                  onClick={() => window.open(item.file, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
                >
                  <FileText size={16} />
                  View
                </button>
                <a
                  href={item.file}
                  download
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-colors"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-3xl p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 bg-cyan-600 rounded-2xl text-white">
              <ShieldCheck size={48} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Need Additional Documents?
              </h3>
              <p className="text-gray-600 mb-4">
                If you require specific documents, product information, or distributorship details, 
                please contact our team. We're happy to provide any additional information you may need.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
              >
                Contact Us
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
