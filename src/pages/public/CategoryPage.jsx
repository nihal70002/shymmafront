import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CategoryPage() {
  const { slug } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = slug ? slug.replaceAll("-", " ") : "Category";

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/categories/${slug}`);
        setSubCategories(response.data.subCategories || []);
      } catch (err) {
        setError("Unable to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [slug]);

  return (
    /* Changed: Page background is now bg-gray-50 to make white cards stand out */
    <div className="min-h-screen bg-[#f8fafc] py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-[2px] w-8 bg-blue-600"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Premium Collection</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            {title}
          </h1>
        </header>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Grid: 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading && subCategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/products?categoryId=${sub.id}`}
              className="group flex flex-col"
            >
              {/* Card: Pure White on Gray Background */}
              <div className="relative w-full aspect-square bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] group-hover:-translate-y-2 flex items-center justify-center p-8 overflow-hidden border border-white group-hover:border-blue-50">
                
                {/* Product Image */}
                <img
                  src={sub.imageUrl || "/placeholder.png"}
                  alt={sub.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
                />

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full"></div>
              </div>

              {/* Text: Centered & Clean */}
              <div className="mt-5 text-center px-2">
                <h3 className="text-[13px] font-bold text-gray-800 leading-snug uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                  {sub.name}
                </h3>
                <div className="mt-2 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <span className="text-[9px] font-bold text-blue-600 border-b-2 border-blue-600 pb-0.5 tracking-widest uppercase">
                    View Catalog
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}