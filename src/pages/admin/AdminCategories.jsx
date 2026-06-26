import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { ArrowDown, ArrowUp, ChevronDown, Edit3, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const MAX_DEPTH = 3;

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

const getChildren = (categories, parentId) =>
  sortCategories(categories.filter((category) =>
    parentId ? category.parentCategoryId === parentId : !category.parentCategoryId
  ));

const getCategoryDepth = (category, categories) => {
  let depth = 1;
  let parentId = category.parentCategoryId;

  while (parentId) {
    const parent = categories.find((item) => item.id === parentId);
    if (!parent) break;
    depth += 1;
    parentId = parent.parentCategoryId;
  }

  return depth;
};

const getSubtreeHeight = (category, categories) => {
  const children = getChildren(categories, category.id);
  if (children.length === 0) return 1;
  return 1 + Math.max(...children.map((child) => getSubtreeHeight(child, categories)));
};

const isDescendant = (candidateParentId, categoryId, categories) => {
  let currentId = candidateParentId;

  while (currentId) {
    if (currentId === categoryId) return true;
    currentId = categories.find((item) => item.id === currentId)?.parentCategoryId;
  }

  return false;
};

const getLevelLabel = (depth) => {
  if (depth === 1) return "Parent Category";
  if (depth === 2) return "Main Category";
  return "Sub Category";
};

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

  const rootCategories = useMemo(() => getChildren(categories, null), [categories]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories/admin");
      setCategories(sortCategories(res.data || []));
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const parentOptions = useMemo(() => {
    return sortCategories(categories).filter((category) => {
      if (category.id === editingCategory?.id) return false;
      if (editingCategory && isDescendant(category.id, editingCategory.id, categories)) return false;

      const categoryDepth = getCategoryDepth(category, categories);
      const editingHeight = editingCategory ? getSubtreeHeight(editingCategory, categories) : 1;

      return categoryDepth + editingHeight <= MAX_DEPTH;
    });
  }, [categories, editingCategory]);

  const persistCategoryOrder = async (nextCategories, parentCategoryId) => {
    const siblings = getChildren(nextCategories, parentCategoryId);
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
    const siblings = getChildren(categories, parentCategoryId);
    const currentIndex = siblings.findIndex((item) => item.id === category.id);
    const nextIndex = currentIndex + direction;

    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= siblings.length) return;

    const reorderedSiblings = [...siblings];
    [reorderedSiblings[currentIndex], reorderedSiblings[nextIndex]] = [
      reorderedSiblings[nextIndex],
      reorderedSiblings[currentIndex]
    ];

    const orderById = new Map(reorderedSiblings.map((item, index) => [item.id, index + 1]));
    const nextCategories = categories.map((item) =>
      orderById.has(item.id)
        ? { ...item, displayOrder: orderById.get(item.id) }
        : item
    );

    setCategories(sortCategories(nextCategories));
    persistCategoryOrder(nextCategories, parentCategoryId);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openCreate = (parentCategoryId = "") => {
    setEditingCategory(null);
    setName("");
    setParentId(parentCategoryId || "");
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

  const renderCategory = (category, index, siblings, depth = 1) => {
    const children = getChildren(categories, category.id);
    const isOpen = expanded[category.id];
    const canAddChild = depth < MAX_DEPTH;
    const levelLabel = getLevelLabel(depth);

    return (
      <div
        key={category.id}
        className={`overflow-hidden rounded-xl border bg-white ${depth === 1 ? "border-slate-200" : "border-slate-100"}`}
      >
        <div className="flex flex-col gap-4 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => toggleExpand(category.id)}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              disabled={children.length === 0}
            >
              <ChevronDown
                size={20}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div className={`${depth === 1 ? "h-16 w-16" : "h-12 w-12"} shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm`}>
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                  No Image
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  {levelLabel}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  #{index + 1}
                </span>
              </div>
              <div className="truncate text-base font-semibold text-slate-800 sm:text-lg">
                {category.name}
              </div>
              <div className="text-sm text-slate-500">
                {children.length} {children.length === 1 ? "child" : "children"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => moveCategory(category, -1)}
              disabled={index === 0 || savingOrder}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              title="Move up"
            >
              <ArrowUp size={16} />
            </button>
            <button
              type="button"
              onClick={() => moveCategory(category, 1)}
              disabled={index === siblings.length - 1 || savingOrder}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              title="Move down"
            >
              <ArrowDown size={16} />
            </button>
            {canAddChild && (
              <button
                type="button"
                onClick={() => openCreate(category.id)}
                className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
              >
                <Plus size={14} className="inline" /> Child
              </button>
            )}
            <button type="button" onClick={() => openEdit(category)}>
              <Edit3 size={18} />
            </button>
            <button type="button" onClick={() => deleteCategory(category.id)}>
              <Trash2 size={18} className="text-rose-600" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-3 border-t bg-slate-50 p-4">
            {children.length === 0 && (
              <div className="text-sm text-slate-400">No child categories</div>
            )}
            {children.map((child, childIndex) =>
              renderCategory(child, childIndex, children, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Category Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Parent Category -> Main Category -> Sub Category
            </p>
          </div>

          <button
            onClick={() => openCreate()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Parent Category
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto rounded-2xl bg-white p-4 shadow sm:p-6">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <span className="font-semibold">
              Arrange sibling categories with arrows. Products should be assigned to final subcategories.
            </span>
            {savingOrder && (
              <span className="shrink-0 text-xs font-bold uppercase tracking-wide">
                Saving...
              </span>
            )}
          </div>

          {rootCategories.map((category, index) =>
            renderCategory(category, index, rootCategories)
          )}

          {rootCategories.length === 0 && (
            <div className="py-10 text-center text-slate-400">
              No categories created yet.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
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
              className="mb-4 w-full rounded-lg border px-3 py-2"
            />

            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="mb-4 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Parent Category (Top Level)</option>
              {parentOptions.map((category) => {
                const depth = getCategoryDepth(category, categories);
                return (
                  <option key={category.id} value={category.id}>
                    {"- ".repeat(depth - 1)}
                    {category.name} ({getLevelLabel(depth)})
                  </option>
                );
              })}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4 w-full"
            />

            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-28 w-28 rounded-xl border object-cover"
                />
              </div>
            )}

            <button
              onClick={saveCategory}
              className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
