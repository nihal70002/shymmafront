import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { ArrowDown, ArrowUp, Edit3, Trash2, Plus, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const getCategoryOrder = (category, fallbackIndex = 0) => {
  const order = category.displayOrder ?? category.sortOrder ?? category.order ?? category.position;
  return Number.isFinite(Number(order)) ? Number(order) : fallbackIndex;
};

const sortCategories = (items) =>
  [...items].sort((a, b) => {
    const orderDiff = getCategoryOrder(a, Number.MAX_SAFE_INTEGER) - getCategoryOrder(b, Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    return (a.id || 0) - (b.id || 0);
  });

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);

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
      setCategories(sortCategories(res.data || []));
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const mainCategories = sortCategories(categories.filter(c => !c.parentCategoryId));

  const persistCategoryOrder = async (nextCategories, parentCategoryId) => {
    const siblings = sortCategories(
      nextCategories.filter((category) =>
        parentCategoryId ? category.parentCategoryId === parentCategoryId : !category.parentCategoryId
      )
    );

    const payload = siblings.map((category, index) => ({
      id: category.id,
      displayOrder: index + 1,
      parentCategoryId: category.parentCategoryId || null
    }));

    setSavingOrder(true);
    try {
      await api.put("/categories/reorder", { categories: payload });
      toast.success("Category order updated");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to save category order");
      loadCategories();
    } finally {
      setSavingOrder(false);
    }
  };

  const moveCategory = (category, direction) => {
    const parentCategoryId = category.parentCategoryId || null;
    const siblings = sortCategories(
      categories.filter((item) =>
        parentCategoryId ? item.parentCategoryId === parentCategoryId : !item.parentCategoryId
      )
    );
    const currentIndex = siblings.findIndex((item) => item.id === category.id);
    const nextIndex = currentIndex + direction;

    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= siblings.length) return;

    const reorderedSiblings = [...siblings];
    [reorderedSiblings[currentIndex], reorderedSiblings[nextIndex]] = [
      reorderedSiblings[nextIndex],
      reorderedSiblings[currentIndex]
    ];

    const orderById = new Map(
      reorderedSiblings.map((item, index) => [item.id, index + 1])
    );

    const nextCategories = categories.map((item) =>
      orderById.has(item.id)
        ? {
            ...item,
            displayOrder: orderById.get(item.id),
            sortOrder: item.sortOrder === undefined ? item.sortOrder : orderById.get(item.id),
            order: item.order === undefined ? item.order : orderById.get(item.id),
            position: item.position === undefined ? item.position : orderById.get(item.id)
          }
        : item
    );

    setCategories(sortCategories(nextCategories));
    persistCategoryOrder(nextCategories, parentCategoryId);
  };

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
          <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <span className="font-semibold">
              Use the arrow buttons to arrange how categories appear on the landing page.
            </span>
            {savingOrder && (
              <span className="shrink-0 text-xs font-bold uppercase tracking-wide">
                Saving...
              </span>
            )}
          </div>

          {mainCategories.map((main, mainIndex) => {
            const subCategories = sortCategories(categories.filter(
              sub => sub.parentCategoryId === main.id
            ));

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
                      <div className="mb-1 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                        #{mainIndex + 1}
                      </div>
                      <div className="font-semibold text-lg text-slate-800">
                        {main.name}
                      </div>

                      {/* Count Badge */}
                      <div className="text-sm text-slate-500">
                        {subCategories.length} Subcategories
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveCategory(main, -1)}
                      disabled={mainIndex === 0 || savingOrder}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      title="Move up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategory(main, 1)}
                      disabled={mainIndex === mainCategories.length - 1 || savingOrder}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      title="Move down"
                    >
                      <ArrowDown size={16} />
                    </button>
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

                    {subCategories.map((sub, subIndex) => (
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

                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              #{subIndex + 1}
                            </div>
                            <span className="font-medium text-slate-700">
                              {sub.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveCategory(sub, -1)}
                            disabled={subIndex === 0 || savingOrder}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            title="Move up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCategory(sub, 1)}
                            disabled={subIndex === subCategories.length - 1 || savingOrder}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            title="Move down"
                          >
                            <ArrowDown size={14} />
                          </button>
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
