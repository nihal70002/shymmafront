import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Plus, X, Trash2, ChevronDown, ChevronUp,
  Upload, Loader2, Edit3, Search, Filter, Package,
  AlertTriangle, Eye, EyeOff, Image as ImageIcon,
  TrendingUp, TrendingDown, Minus
} from "lucide-react";
import toast from "react-hot-toast";
import Papa from "papaparse";







/* ================= CONSTANTS ================= */
const DEFAULT_VARIANT = {
  class: "",
  style: "",
  material: "",
  color: "",
  size: "",
  price: "",
  stock: 0,
  productCode: ""
};


const EMPTY_FORM = {
  name: "",
  categoryId: "",
  brandId: "",
  description: "",
  images: [],
  variants: [{ ...DEFAULT_VARIANT }]
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedCatFilter, setSelectedCatFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, c, b] = await Promise.all([
        api.get("/admin/products"),
        api.get("/categories/admin"),
        api.get("/brands")
      ]);
      setProducts(p.data || []);
      setCategories(c.data || []);
      setBrands(b.data || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const mainCategories = categories.filter(c => !c.parentCategoryId);

  /* ================= HANDLERS ================= */
  const handleToggleActive = async (productId) => {
    setTogglingId(productId);
    try {
      await api.put(`/admin/products/${productId}/toggle`);
      setProducts(prev => prev.map(p => 
        p.productId === productId ? { ...p, isActive: !p.isActive } : p
      ));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImageUploading(true);
    try {
      const uploaded = [];

      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await api.post("/upload/image", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        uploaded.push(res.data.imageUrl);

      }

      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploaded]
      }));
    } catch {
      alert("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };



  const handleCsvUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async ({ data }) => {
      try {
        await bulkCreateProducts(data);
        toast.success("Bulk import completed");
        loadData();
      } catch (err) {
        console.error(err);
        toast.error("Bulk import failed");
      }
    }
  });
};



  const bulkCreateProducts = async (rows) => {
  // Group by product name
  const grouped = {};

  for (const r of rows) {
    if (!grouped[r.name]) {
      grouped[r.name] = {
        name: r.name,
        categoryId: Number(r.categoryId),
        brandId: Number(r.brandId),
        description: r.description,
        imageUrls: r.imageUrls
          ? r.imageUrls.split("|").map(i => i.trim())
          : [],
        variants: []
      };
    }

    grouped[r.name].variants.push({
      size: r.size,
      price: Number(r.price),
      productCode: r.productCode,
      stock: 0
    });
  }

  // Create products one by one (safe)
  for (const product of Object.values(grouped)) {
    await api.post("/admin/products", product);
  }
};





  const addCategory = async () => {
    if (!newCategory.trim()) return alert("Name required");
    try {
      await api.post("/categories", {
  name: newCategory.trim(),
  parentCategoryId: parentCategoryId || null
});
      setNewCategory(""); 
      setShowCatModal(false); 
      loadData();
    } catch { 
      alert("Failed to add category"); 
    }
  };

  const openEditModal = (product) => {
    setEditingId(product.productId);
    setForm({
      name: product.name,
      categoryId: product.categoryId.toString(),
      brandId: product.brandId?.toString() || "",
      description: product.description || "",
      images: product.imageUrls || [],


      variants: product.variants.map(v => ({ ...v }))
    });
    setShowModal(true);
    setPrimaryImageIndex(0);

  };

  const formatSAR = (amount) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount);

 const saveProduct = async () => {
  /* ================= 1. VALIDATION ================= */
  if (!form.name || !form.categoryId || !form.brandId) {
    toast.error("Product name, category and brand are required");
    return;
  }

  if (!form.variants || form.variants.length === 0) {
    toast.error("At least one variant is required");
    return;
  }

  const combinations = new Set();
  const skus = new Set();

  for (const v of form.variants) {
    const size = v.size?.trim();
    const sku = v.productCode?.trim();

    if (!size) {
      toast.error("Variant size cannot be empty");
      return;
    }
    if (!sku) {
      toast.error("SKU is required for each variant");
      return;
    }

    const comboKey = [
      v.class?.trim().toLowerCase() || "",
      v.style?.trim().toLowerCase() || "",
      v.material?.trim().toLowerCase() || "",
      v.color?.trim().toLowerCase() || "",
      size.toLowerCase()
    ].join("|");

    if (combinations.has(comboKey)) {
      toast.error(`Duplicate variant: ${size}`);
      return;
    }
    if (skus.has(sku.toLowerCase())) {
      toast.error(`Duplicate SKU: ${sku}`);
      return;
    }

    combinations.add(comboKey);
    skus.add(sku.toLowerCase());
  }

  /* ================= 2. IMAGE REORDERING ================= */
  const orderedImages = [...form.images];
  if (primaryImageIndex > 0 && orderedImages.length > primaryImageIndex) {
    const [primary] = orderedImages.splice(primaryImageIndex, 1);
    orderedImages.unshift(primary);
  }

  /* ================= 3. PAYLOAD PREPARATION ================= */
  // We prepare the base product data (matches AdminUpdateProductDto)
  const productPayload = {
    name: form.name.trim(),
    categoryId: Number(form.categoryId),
    brandId: Number(form.brandId),
    description: form.description?.trim() || "",
    imageUrls: orderedImages,
  };

  // Prepare variants separately for the loop
  const variantData = form.variants.map(v => ({
    class: v.class?.trim() || "",
    style: v.style?.trim() || "",
    material: v.material?.trim() || "",
    color: v.color?.trim() || "",
    size: v.size.trim(),
    productCode: v.productCode.trim(),
    price: Number(v.price) || 0,
    stock: Number(v.stock) || 0,
    variantId: v.variantId // Important for updates
  }));
  console.log("Variants before save:", form.variants);


  /* ================= 4. API EXECUTION ================= */
  try {
    if (editingId) {
      // STEP A: Update the main product details
      // (Note: productPayload does NOT include the variants array here)
      await api.put(`/admin/products/${editingId}`, productPayload);

      // STEP B: Update/Create variants one by one
      // We use a regular for-loop to avoid concurrency issues on the server
      for (const v of variantData) {
        if (v.variantId) {
          await api.put(`/admin/products/variant/${v.variantId}`, v);
        } else {
          await api.post(`/admin/products/${editingId}/variant`, v);
        }
      }
    } else {
      // For NEW products, we send everything in one POST
      const createPayload = { ...productPayload, variants: variantData };
      await api.post("/admin/products", createPayload);
    }

    /* ================= 5. UI REFRESH ================= */
    toast.success(editingId ? "Product updated" : "Product added");
    closeModal();
    loadData(); // Safer to reload everything to sync with DB state

  } catch (err) {
    console.error("Save Error:", err);
    let msg = "Error saving product";

    if (err?.response?.data?.errors) {
      const firstError = Object.values(err.response.data.errors)[0];
      msg = Array.isArray(firstError) ? firstError[0] : firstError;
    } else if (err?.response?.data) {
      msg = typeof err.response.data === 'string' ? err.response.data : (err.response.data.title || msg);
    }

    toast.error(String(msg));
  }
};
  const deleteProduct = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/admin/products/${deleteTarget.productId}`);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      alert("Failed to delete product permanently");
    }
  };

  const closeModal = () => {
  setShowModal(false);
  setEditingId(null);
  setForm(EMPTY_FORM);
  setPrimaryImageIndex(0);
};

const deleteCategory = async (id) => {
  if (!window.confirm("Delete this category?")) return;

  try {
    await api.delete(`/categories/${id}`);
    toast.success("Category deleted");
    loadData();
  } catch (err) {
    toast.error(err?.response?.data || "Cannot delete category");
  }
};


const updateCategory = async (id, name, parentId) => {
  try {
    await api.put(`/categories/${id}`, {
      name,
      isActive: true,
      parentCategoryId: parentId
    });

    toast.success("Category updated");
    loadData();
  } catch (err) {
    toast.error("Update failed");
  }
};





  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();

    const matchesStatus =
      filter === "ALL"
        ? true
        : filter === "ACTIVE"
        ? p.isActive
        : !p.isActive;

    


    const matchesCategory =
      selectedCatFilter === "ALL"
        ? true
        : p.categoryId.toString() === selectedCatFilter;

    const matchesName = p.name?.toLowerCase().includes(term);
    const matchesProductCode = p.productCode?.toLowerCase().includes(term);
    const matchesVariantSku = p.variants?.some(v =>
      v.productCode?.toLowerCase().includes(term)
    );

    const matchesSearch = !term || matchesName || matchesProductCode || matchesVariantSku;

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Stats calculation
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    lowStock: products.filter(p => 
      p.variants?.some(v => v.stock < 10)
    ).length
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">

      <div className="max-w-[1800px] mx-auto px-6 py-8 h-full overflow-y-auto">

        
        {/* HEADER SECTION */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25">
                  <Package size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Product Inventory</h1>
                  <p className="text-sm text-slate-500 font-medium">Manage your product catalog</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowCatModal(true)} 
                className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
              >
                <Plus size={16} className="inline mr-2" />
                Add Category
              </button>
              <button 
                onClick={() => setShowBrandModal(true)} 
                className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
              >
                <Plus size={16} className="inline mr-2" />
                Add Brand
              </button>

              <label className="px-6 py-2.5 bg-white border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer hover:border-blue-500">
  Bulk CSV Import
  <input
    type="file"
    accept=".csv"
    hidden
    onChange={handleCsvUpload}
  />
</label>

              <button 
                onClick={() => setShowModal(true)} 
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
              >
                <Plus size={16} className="inline mr-2" />
                New Product
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-600">Total Products</span>
                <Package size={20} className="text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-600">Active</span>
                <Eye size={20} className="text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">{stats.active}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-600">Inactive</span>
                <EyeOff size={20} className="text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-400">{stats.inactive}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-600">Low Stock</span>
                <AlertTriangle size={20} className="text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-amber-600">{stats.lowStock}</div>
            </div>
          </div>

          {/* FILTERS BAR */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              
              {/* Status Filter */}
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
                {["ALL", "ACTIVE", "INACTIVE"].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)} 
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filter === f 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  <select 
                    value={selectedCatFilter} 
                    onChange={(e) => setSelectedCatFilter(e.target.value)} 
                    className="pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none cursor-pointer appearance-none min-w-[180px] hover:border-slate-300 focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  <input 
                    placeholder="Search products, SKU..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full sm:w-72 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm text-slate-700 rounded-xl outline-none hover:border-slate-300 focus:border-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Variants
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => {
                  const img =
  p.primaryImageUrl ||
  p.imageUrls?.[0] ||
  null;


                  const isExpanded = expandedRow === p.productId;

                  return (
                    <React.Fragment key={p.productId}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                           <div className="relative flex-shrink-0">
  {img ? (
    <img
      src={img}
      alt={p.name}
      className="w-14 h-14 object-cover rounded-xl border-2 border-slate-100"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "";
      }}
    />
  ) : (
    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-slate-200">
      <ImageIcon size={24} className="text-slate-400" />
    </div>
  )}
</div>

                            <div>
                              <p className="font-semibold text-slate-900 text-sm mb-0.5">
                                {p.name}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                SKU: {p.productCode || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            {p.categoryName || "General"}
                          </span>
                        </td>

                        {/* Brand */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">
                            {p.brandName || "—"}
                          </span>
                        </td>

                        {/* Variants */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : p.productId)}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <span>{p.variants?.length || 0} variant{p.variants?.length !== 1 ? 's' : ''}</span>
                            {isExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-6 py-4 text-center">
                          <button
                            disabled={togglingId === p.productId}
                            onClick={() => handleToggleActive(p.productId)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${
                              p.isActive ? "bg-emerald-500" : "bg-slate-300"
                            } ${togglingId === p.productId ? "opacity-50" : "hover:opacity-90"}`}
                          >
                            {togglingId === p.productId ? (
                              <Loader2 size={14} className="animate-spin mx-auto text-white" />
                            ) : (
                              <span
                                className={`inline-block h-5 w-5 bg-white rounded-full shadow-sm transform transition-transform ${
                                  p.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(p)}
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit product"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => setDeleteTarget(p)}
                              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Variants Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {p.variants?.map((v, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <div className="text-xs font-semibold text-slate-500 mb-1">SIZE</div>
                                      <div className="text-lg font-bold text-slate-900">{v.size}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs font-semibold text-slate-500 mb-1">PRICE</div>
                                      <div className="text-lg font-bold text-blue-600">{formatSAR(v.price)}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div>
                                      <div className="text-xs font-semibold text-slate-500">SKU</div>
                                      <div className="text-sm font-medium text-slate-700">{v.productCode}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs font-semibold text-slate-500">STOCK</div>
                                      <div className={`text-sm font-bold ${v.stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {v.stock} units
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-400" size={36} />
              </div>
              <p className="text-slate-600 font-semibold text-lg mb-1">No products found</p>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-rose-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Delete Product?</h3>
            <p className="text-slate-600 text-center mb-8">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{deleteTarget.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={deleteProduct} 
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
              >
                Delete Product
              </button>
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CATEGORY/BRAND MODAL */}
      {/* ADD CATEGORY / BRAND MODAL */}
{(showCatModal || showBrandModal) && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          {showCatModal ? "Add Category" : "Add Brand"}
        </h3>
        <button
          onClick={() => {
            setShowCatModal(false);
            setShowBrandModal(false);
            setParentCategoryId("");
          }}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={24} className="text-slate-500" />
        </button>
      </div>

      {/* CATEGORY NAME INPUT */}
      <input
        type="text"
        placeholder={showCatModal ? "Enter category name" : "Enter brand name"}
        value={showCatModal ? newCategory : newBrand}
        onChange={(e) =>
          showCatModal
            ? setNewCategory(e.target.value)
            : setNewBrand(e.target.value)
        }
        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 mb-4 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
        autoFocus
      />

      {/* 🔥 PARENT CATEGORY DROPDOWN (ONLY FOR CATEGORY) */}
      {showCatModal && (
        <select
          value={parentCategoryId}
          onChange={(e) => setParentCategoryId(e.target.value)}
          className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 mb-6 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
        >
          <option value="">Main Category (No Parent)</option>
          {categories
            .filter(c => !c.parentCategoryId) // only first-level categories
            .map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      )}

      <button
        onClick={
          showCatModal
            ? addCategory
            : async () => {
                if (!newBrand.trim())
                  return alert("Brand name required");

                try {
                  await api.post("/brands", {
                    brandName: newBrand.trim()
                  });

                  setNewBrand("");
                  setShowBrandModal(false);
                  loadData();
                } catch {
                  alert("Failed to add brand");
                }
              }
        }
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
      >
        {showCatModal ? "Add Category" : "Add Brand"}
      </button>
    </div>
  </div>
)}





      {/* ADD/EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    {editingId ? "Update product information and variants" : "Create a new product with variants"}
                  </p>
                </div>
                <button 
                  onClick={closeModal} 
                  className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
           <div className="p-6 overflow-y-auto flex-1">
  <div className="space-y-6">

    {/* Product Images & Basic Info */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Image Upload */}
      <div className="lg:col-span-1">
        <label className="text-sm font-semibold text-slate-700 mb-3 block">
          Product Images (Max 5)
        </label>

        {/* Main Image */}
        <div className="relative aspect-square border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50 hover:border-blue-400 transition-all cursor-pointer">
          {imageUploading && (
            <div className="absolute inset-0 bg-white/90 z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          {form.images.length > 0 ? (
            <img
  src={form.images[primaryImageIndex]}
  className="w-full h-full object-cover"
  alt="Main Product"
/>

          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Upload className="text-slate-400 mb-3" size={36} />
              <span className="text-sm font-semibold text-slate-600">
                Upload Main Image
              </span>
              <span className="text-xs text-slate-400 mt-1">
                PNG, JPG up to 10MB
              </span>
            </div>
          )}

          <input
  type="file"
  accept="image/*"
  multiple
  className="absolute inset-0 opacity-0 cursor-pointer"
  onChange={handleImageUpload}
/>

        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-5 gap-2 mt-3">
 {form.images.map((img, idx) => (
  <div
    key={idx}
    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
      primaryImageIndex === idx
        ? "border-blue-500"
        : "border-slate-200"
    }`}
    onClick={() => setPrimaryImageIndex(idx)}
  >
    <img
      src={img}
      className="w-full h-full object-cover"
      alt={`Product ${idx + 1}`}
    />

    {/* PRIMARY BADGE */}
    {primaryImageIndex === idx && (
      <div className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">
        Primary
      </div>
    )}

    {/* REMOVE IMAGE BUTTON */}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setForm(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== idx)
        }));
        if (primaryImageIndex === idx) {
          setPrimaryImageIndex(0);
        }
      }}
      className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
    >
      <X size={12} />
    </button>
  </div>
))}







          {form.images.length < 5 && (
            <label className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
              <Plus className="text-slate-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* Basic Product Info */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium"
            placeholder="Enter product name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-medium"
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories
  .filter(c => c.parentCategoryId !== null)
  .map(c => {
    const parent = categories.find(p => p.id === c.parentCategoryId);
    return (
      <option key={c.id} value={c.id}>
        {parent ? parent.name + " → " : ""}
        {c.name}
      </option>
    );
  })}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Brand <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-medium"
              value={form.brandId}
              onChange={e => setForm({ ...form, brandId: e.target.value })}
            >
              <option value="">Select brand</option>
              {brands.map(b => (
                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Description
          </label>
          <textarea
            rows="4"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
            placeholder="Enter product description..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>
    </div>

    {/* Variants Section (unchanged) */}
    <div className="border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Product Variants</h4>
                      <p className="text-sm text-slate-500">Add different sizes and SKUs for this product</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({
                        ...form,
                        variants: [...form.variants, { ...DEFAULT_VARIANT }]
                      })}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <Plus size={16} className="inline mr-1" />
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.variants.map((v, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">

                          <div>
  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
    Class
  </label>
  <input
    type="text"
    placeholder="e.g., Class 1"
    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
    value={v.class || ""}
    onChange={e => {
      const vs = [...form.variants];
      vs[i].class = e.target.value;
      setForm({ ...form, variants: vs });
    }}
  />
</div>


<div>
  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
    Style
  </label>
  <input
    type="text"
    placeholder="e.g., AD / AF"
    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
    value={v.style || ""}
    onChange={e => {
      const vs = [...form.variants];
      vs[i].style = e.target.value;
      setForm({ ...form, variants: vs });
    }}
  />
</div>


<div>
  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
    Material
  </label>
  <input
    type="text"
    placeholder="e.g., Cotton"
    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
    value={v.material || ""}
    onChange={e => {
      const vs = [...form.variants];
      vs[i].material = e.target.value;
      setForm({ ...form, variants: vs });
    }}
  />
</div>

<div>
  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
    Color
  </label>
  <input
    type="text"
    placeholder="e.g., Beige"
    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
    value={v.color || ""}
    onChange={e => {
      const vs = [...form.variants];
      vs[i].color = e.target.value;
      setForm({ ...form, variants: vs });
    }}
  />
</div>





                          
                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                              Size <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., M, XL, 2-3Y"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                              value={v.size}
                              onChange={e => {
                                const vs = [...form.variants];
                                vs[i].size = e.target.value;
                                setForm({ ...form, variants: vs });
                              }}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                              SKU / Product Code <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., PROD-001"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                              value={v.productCode}
                              onChange={e => {
                                const vs = [...form.variants];
                                vs[i].productCode = e.target.value;
                                setForm({ ...form, variants: vs });
                              }}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                              Price (SAR) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="number"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                              value={v.price === 0 ? "" : v.price}
                              onChange={e => {
                                const vs = [...form.variants];
                                vs[i].price = e.target.value === "" ? "" : Number(e.target.value);
                                setForm({ ...form, variants: vs });
                              }}
                            />
                          </div>

                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                                Stock
                              </label>
                              <input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                value={v.stock === 0 ? "" : v.stock}
                                onChange={e => {
                                  const vs = [...form.variants];
                                  vs[i].stock = e.target.value === "" ? 0 : Number(e.target.value);
                                  setForm({ ...form, variants: vs });
                                }}
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => setForm({
                                  ...form,
                                  variants: form.variants.filter((_, idx) => idx !== i)
                                })}
                                disabled={form.variants.length === 1}
                                className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove variant"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
    
  </div>
</div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex gap-3">
                <button 
                  onClick={saveProduct} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  {editingId ? "Update Product" : "Create Product"}
                </button>
                <button
  onClick={async () => {
    await saveProduct();
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true); // keep modal open
  }}
  className="px-6 py-3 bg-slate-200 rounded-xl font-semibold"
>
  Save & Add Next
</button>





                <button 
                  onClick={closeModal} 
                  className="px-8 border-2 border-slate-200 py-3 rounded-xl font-semibold text-slate-700 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}