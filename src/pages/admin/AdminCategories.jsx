import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Edit3, Trash2, Plus, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories/admin");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const mainCategories = categories.filter(c => !c.parentCategoryId);

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setParentId("");
    setImageFile(null);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentId(cat.parentCategoryId || "");
    setPreview(cat.imageUrl || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const saveCategory = async () => {
    if (!name.trim()) {
      toast.error("Category name required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("parentCategoryId", parentId || "");
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Category updated");
      } else {
        await api.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Category created");
      }

      setShowModal(false);
      loadCategories();
    } catch (err) {
      toast.error(err?.response?.data || "Operation failed");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      loadCategories();
    } catch (err) {
      toast.error(err?.response?.data || "Cannot delete category");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Category Management
          </h1>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">

          {mainCategories.map(main => {
            const subCategories = categories.filter(
              sub => sub.parentCategoryId === main.id
            );

            return (
              <div
                key={main.id}
                className="border rounded-xl overflow-hidden bg-slate-50"
              >
                {/* Parent Row */}
                <div className="flex items-center justify-between p-4 hover:bg-slate-100 transition">

                  <div className="flex items-center gap-4">

                    {/* Dropdown Icon */}
                    <button onClick={() => toggleExpand(main.id)}>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          expanded[main.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Bigger Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden border bg-white shadow-sm">
                      {main.imageUrl ? (
                        <img
                          src={main.imageUrl}
                          alt={main.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-lg text-slate-800">
                        {main.name}
                      </div>

                      {/* Count Badge */}
                      <div className="text-sm text-slate-500">
                        {subCategories.length} Subcategories
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => openEdit(main)}>
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => deleteCategory(main.id)}>
                      <Trash2 size={18} className="text-rose-600" />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                {expanded[main.id] && (
                  <div className="bg-white border-t p-4 space-y-3">
                    {subCategories.length === 0 && (
                      <div className="text-sm text-slate-400">
                        No subcategories
                      </div>
                    )}

                    {subCategories.map(sub => (
                      <div
                        key={sub.id}
                        className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white">
                            {sub.imageUrl && (
                              <img
                                src={sub.imageUrl}
                                alt={sub.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <span className="font-medium text-slate-700">
                            {sub.name}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => openEdit(sub)}>
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => deleteCategory(sub.id)}>
                            <Trash2 size={16} className="text-rose-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {mainCategories.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              No categories created yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              <option value="">Main Category</option>
              {mainCategories
                .filter(c => c.id !== editingCategory?.id)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-4"
            />

            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-28 h-28 object-cover rounded-xl border"
                />
              </div>
            )}

            <button
              onClick={saveCategory}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}