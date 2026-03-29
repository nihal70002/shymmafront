import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products.api";
import { addToCartApi } from "../../api/cart.api";
import { ChevronLeft, ShoppingCart, Star, ChevronRight, Plus, Minus, Shield, Award, ChevronDown } from "lucide-react";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCartFromApi } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(id);
        const images = res.data.imageUrls?.length
          ? res.data.imageUrls
          : res.data.primaryImageUrl ? [res.data.primaryImageUrl] : [];
        const mappedProduct = {
          id: res.data.productId,
          name: res.data.name,
          category: res.data.categoryName,
          description: res.data.description,
          components: res.data.components || [],
          images,
          variants: (res.data.variants || []).map(v => ({
            id: v.variantId, class: v.class, size: v.size,
            price: v.price, stock: v.availableStock
          }))
        };
        setProduct(mappedProduct);
        setSelectedImage(0);
        if (mappedProduct.variants.length > 0) {
          const first = mappedProduct.variants[0];
          setSelectedClass(first.class || null);
          setSelectedVariant(first);
        }
      } catch (err) {
        console.error("Failed to load product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const classOptions = [...new Set(product?.variants?.map(v => v.class).filter(Boolean))];
  const filteredVariants = product?.variants?.filter(v => !selectedClass || v.class === selectedClass) || [];

  useEffect(() => {
    if (filteredVariants.length > 0) setSelectedVariant(filteredVariants[0]);
  }, [selectedClass, product]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      setAddingToCart(true);
      await addToCartApi(selectedVariant.id, quantity);
      const res = await api.get("/cart");
      setCartFromApi(res.data.length || 0);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <div style={styles.loadingScreen}>
      <div style={styles.loadingRing} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return (
    <div style={{ padding: "80px 24px", textAlign: "center", fontFamily: "Georgia, serif" }}>
      Product not found.
    </div>
  );

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .thumb-btn:hover { border-color: #0d5e5e !important; }
        .nav-btn:hover { background: #f0fafa !important; }
        .class-btn:hover { border-color: #0d5e5e !important; background: #f0fafa !important; }
        .qty-btn:hover { background: #f7f7f7; }
        .add-btn:hover { background: #0d5e5e !important; letter-spacing: 3px !important; }
        .back-link:hover { color: #0d5e5e !important; }
        .table-row:hover td { background: #f9fefe !important; }
        .accordion-toggle:hover { color: #0d5e5e !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f4f4f4; }
        ::-webkit-scrollbar-thumb { background: #c8d8d8; border-radius: 3px; }

        /* ── Responsive overrides ── */
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .image-panel { border-right: none !important; border-bottom: 1px solid #f0f0f0 !important; padding: 24px 16px !important; }
          .detail-panel { padding: 24px 16px !important; }
          .main-image-wrap { height: 320px !important; }
          .product-name { font-size: 26px !important; }
          .price { font-size: 30px !important; }
          .purchase-row { flex-wrap: wrap !important; gap: 10px !important; }
          .add-btn-el { flex: 1 1 100% !important; min-width: unset !important; }
          .table-th, .table-td, .table-td-mono { padding: 10px 14px !important; font-size: 12px !important; }
          .table-section-header { padding: 20px 16px 14px !important; }
          .badge-row { gap: 6px !important; }
          .thumb-row { gap: 8px !important; }
          .thumb-btn-el { width: 54px !important; height: 54px !important; }
          .breadcrumb-current { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; }
        }

        @media (max-width: 400px) {
          .main-image-wrap { height: 260px !important; }
          .product-name { font-size: 22px !important; }
          .price { font-size: 26px !important; }
          .cert-badge { font-size: 10px !important; padding: 3px 7px !important; }
          .table-th, .table-td, .table-td-mono { padding: 8px 10px !important; }
          .nav-btn-el { width: 32px !important; height: 32px !important; }
        }
      `}</style>

      {/* TOAST */}
      {showToast && (
        <div style={styles.toast}>
          <span style={{ marginRight: 8 }}>✓</span> {quantity} item{quantity > 1 ? "s" : ""} added to bag
        </div>
      )}

      {/* BREADCRUMB */}
      <div style={styles.breadcrumbBar}>
        <div style={styles.breadcrumbInner}>
          <button className="back-link" onClick={() => navigate("/")} style={styles.backLink}>
            <ChevronLeft size={14} style={{ marginRight: 2 }} /> Home
          </button>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbMid}>{product.category}</span>
          <span style={styles.breadcrumbSep}>/</span>
          <span className="breadcrumb-current" style={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.container}>
        <div className="main-grid" style={styles.mainGrid}>

          {/* LEFT: IMAGE PANEL */}
          <div className="image-panel" style={styles.imagePanel}>
            <div className="main-image-wrap" style={styles.mainImageWrap}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={styles.mainImage}
              />
              {product.images.length > 1 && (
                <>
                  <button className="nav-btn nav-btn-el" style={{ ...styles.navBtn, left: 12 }}
                    onClick={() => setSelectedImage(p => p === 0 ? product.images.length - 1 : p - 1)}>
                    <ChevronLeft size={16} color="#0d5e5e" />
                  </button>
                  <button className="nav-btn nav-btn-el" style={{ ...styles.navBtn, right: 12 }}
                    onClick={() => setSelectedImage(p => p === product.images.length - 1 ? 0 : p + 1)}>
                    <ChevronRight size={16} color="#0d5e5e" />
                  </button>
                </>
              )}
              {product.images.length > 1 && (
                <div style={styles.dots}>
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      style={{ ...styles.dot, background: i === selectedImage ? "#0d5e5e" : "#ccdada" }} />
                  ))}
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {product.images.length > 1 && (
              <div className="thumb-row" style={styles.thumbRow}>
                {product.images.map((img, i) => (
                  <button key={i} className="thumb-btn thumb-btn-el" onClick={() => setSelectedImage(i)}
                    style={{ ...styles.thumbBtn, borderColor: i === selectedImage ? "#0d5e5e" : "#e2e2e2", boxShadow: i === selectedImage ? "0 0 0 2px #d0eaea" : "none" }}>
                    <img src={img} alt="" style={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS PANEL */}
          <div className="detail-panel" style={styles.detailPanel}>
            <div style={styles.categoryTag}>{product.category}</div>

            <h1 className="product-name" style={styles.productName}>{product.name}</h1>

            <div className="badge-row" style={styles.badgeRow}>
              <div style={styles.ratingBadge}>
                <Star size={12} fill="#fff" color="#fff" style={{ marginRight: 4 }} />
                4.8
              </div>
              <div className="cert-badge" style={styles.certBadge}>
                <Shield size={12} color="#0d5e5e" style={{ marginRight: 5 }} />
                Medical Grade Certified
              </div>
              <div className="cert-badge" style={styles.certBadge}>
                <Award size={12} color="#0d5e5e" style={{ marginRight: 5 }} />
                ISO Approved
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.priceBlock}>
              <div className="price" style={styles.price}>₹{selectedVariant?.price ?? "--"}</div>
              <div style={styles.taxNote}>Inclusive of all taxes &amp; duties</div>
            </div>

            {classOptions.length > 0 && (
              <div style={styles.selectorBlock}>
                <div style={styles.selectorLabel}>Select Class</div>
                <div style={styles.selectorRow}>
                  {classOptions.map(opt => (
                    <button key={opt} className="class-btn"
                      onClick={() => setSelectedClass(opt)}
                      style={{ ...styles.classBtn, borderColor: selectedClass === opt ? "#0d5e5e" : "#ddd", background: selectedClass === opt ? "#eef8f8" : "#fff", color: selectedClass === opt ? "#0d5e5e" : "#555", fontWeight: selectedClass === opt ? 600 : 400 }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <div style={styles.accordionBlock}>
                <button className="accordion-toggle" style={styles.accordionToggle} onClick={() => setDescExpanded(e => !e)}>
                  <span>Product Description</span>
                  <ChevronDown size={16} style={{ transform: descExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
                </button>
                {descExpanded && (
                  <p style={styles.descText}>{product.description}</p>
                )}
              </div>
            )}

            <div style={styles.divider} />

            {/* QUANTITY + ADD TO CART */}
            <div className="purchase-row" style={styles.purchaseRow}>
              <div style={styles.qtyLabel}>Qty</div>
              <div style={styles.qtyControl}>
                <button className="qty-btn" style={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus size={14} color="#333" />
                </button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button className="qty-btn" style={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>
                  <Plus size={14} color="#333" />
                </button>
              </div>

              <button className="add-btn add-btn-el" disabled={addingToCart} onClick={handleAddToCart} style={styles.addBtn}>
                <ShoppingCart size={16} style={{ marginRight: 10 }} />
                {addingToCart ? "ADDING…" : "ADD TO BAG"}
              </button>
            </div>

            {selectedVariant?.stock !== undefined && (
              <div style={styles.stockNote}>
                {selectedVariant.stock > 0
                  ? `${selectedVariant.stock} units in stock`
                  : <span style={{ color: "#c0392b" }}>Out of stock</span>}
              </div>
            )}
          </div>
        </div>

        {/* COMPONENT TABLE */}
        <div style={styles.tableSection}>
          <div className="table-section-header" style={styles.tableSectionHeader}>
            <h3 style={styles.tableTitle}>Components &amp; Catalogue</h3>
            <div style={styles.tableSubtitle}>Detailed specification breakdown</div>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th className="table-th" style={{ ...styles.th, width: "20%" }}>Cat No.</th>
                  <th className="table-th" style={{ ...styles.th, width: "65%" }}>Description</th>
                  <th className="table-th" style={{ ...styles.th, width: "15%", textAlign: "center" }}>Units</th>
                </tr>
              </thead>
              <tbody>
                {product.components?.length > 0 ? (
                  product.components.map((item, i) => (
                    <tr key={i} className="table-row">
                      <td className="table-td-mono" style={styles.tdMono}>{item.catNo}</td>
                      <td className="table-td" style={styles.td}>{item.instrumentName}</td>
                      <td className="table-td" style={{ ...styles.td, textAlign: "center" }}>{item.units || 1}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={styles.emptyCell}>No catalogue data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f8f6",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1a1a",
    paddingBottom: 80,
  },
  loadingScreen: {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: "100vh", background: "#f8f8f6",
  },
  loadingRing: {
    width: 44, height: 44, borderRadius: "50%",
    border: "3px solid #d0eaea", borderTopColor: "#0d5e5e",
    animation: "spin 0.8s linear infinite",
  },
  toast: {
    position: "fixed", top: 88, right: 16, left: 16, zIndex: 9999,
    background: "#0d5e5e", color: "#fff",
    padding: "12px 20px", borderRadius: 6,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
    display: "flex", alignItems: "center",
    boxShadow: "0 8px 32px rgba(13,94,94,0.25)",
    animation: "slideDown 0.3s ease",
    maxWidth: 420,
    margin: "0 auto",
  },
  breadcrumbBar: {
    background: "#fff", borderBottom: "1px solid #ebebeb",
    padding: "0 16px",
  },
  breadcrumbInner: {
    maxWidth: 1400, margin: "0 auto",
    display: "flex", alignItems: "center", gap: 6,
    padding: "12px 0", fontSize: 12,
    fontFamily: "'DM Sans', sans-serif", color: "#999",
    flexWrap: "nowrap", overflow: "hidden",
  },
  backLink: {
    display: "flex", alignItems: "center", background: "none",
    border: "none", cursor: "pointer", color: "#999", fontSize: 12,
    fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s",
    padding: 0, whiteSpace: "nowrap", flexShrink: 0,
  },
  breadcrumbSep: { color: "#ccc", flexShrink: 0 },
  breadcrumbMid: { color: "#888", whiteSpace: "nowrap", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 80 },
  breadcrumbCurrent: { color: "#222", fontWeight: 500 },

  container: { maxWidth: 1400, margin: "0 auto", padding: "24px 16px" },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 0,
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 2px 40px rgba(0,0,0,0.07)",
    marginBottom: 24,
  },

  /* IMAGE PANEL */
  imagePanel: {
    padding: "40px 32px",
    borderRight: "1px solid #f0f0f0",
    background: "#fdfdfb",
  },
  mainImageWrap: {
    position: "relative", borderRadius: 12,
    overflow: "hidden", background: "#fff",
    border: "1px solid #ebebeb", height: 520,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  mainImage: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain" },
  navBtn: {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    background: "#fff", border: "1px solid #e8e8e8",
    borderRadius: "50%", width: 40, height: 40,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "background 0.2s",
  },
  dots: {
    position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
    display: "flex", gap: 6,
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    border: "none", cursor: "pointer", padding: 0,
    transition: "background 0.2s",
  },
  thumbRow: {
    display: "flex", gap: 10, marginTop: 16,
    flexWrap: "nowrap", overflowX: "auto",
    paddingBottom: 4,
    WebkitOverflowScrolling: "touch",
  },
  thumbBtn: {
    width: 68, height: 68, border: "2px solid",
    borderRadius: 8, overflow: "hidden",
    cursor: "pointer", background: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    padding: 0, flexShrink: 0,
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },

  /* DETAIL PANEL */
  detailPanel: {
    padding: "40px 48px",
    display: "flex", flexDirection: "column", gap: 0,
  },

  categoryTag: {
    display: "inline-block", fontSize: 10, fontWeight: 600,
    letterSpacing: 2, textTransform: "uppercase",
    color: "#0d5e5e", marginBottom: 12,
  },
  productName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 36, fontWeight: 700, lineHeight: 1.15,
    color: "#111", marginBottom: 20, letterSpacing: "-0.3px",
  },
  badgeRow: {
    display: "flex", alignItems: "center",
    gap: 10, flexWrap: "wrap", marginBottom: 24,
  },
  ratingBadge: {
    display: "flex", alignItems: "center",
    background: "#0d5e5e", color: "#fff",
    fontSize: 12, fontWeight: 700, padding: "4px 10px",
    borderRadius: 4,
  },
  certBadge: {
    display: "flex", alignItems: "center",
    background: "#eef8f8", color: "#0d5e5e",
    fontSize: 11, fontWeight: 500, padding: "4px 10px",
    borderRadius: 4, border: "1px solid #c8e8e8",
  },
  divider: { height: 1, background: "#f0f0f0", margin: "20px 0" },

  priceBlock: { marginBottom: 24 },
  price: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 40, fontWeight: 700, color: "#111", lineHeight: 1,
  },
  taxNote: { fontSize: 12, color: "#0d5e5e", fontWeight: 500, marginTop: 6 },

  selectorBlock: { marginBottom: 20 },
  selectorLabel: {
    fontSize: 10, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase", color: "#888", marginBottom: 10,
  },
  selectorRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  classBtn: {
    padding: "8px 18px", border: "1.5px solid", borderRadius: 6,
    cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s", letterSpacing: 0.3,
  },

  accordionBlock: { marginBottom: 4 },
  accordionToggle: {
    width: "100%", display: "flex", justifyContent: "space-between",
    alignItems: "center", background: "none", border: "none",
    borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0",
    padding: "14px 0", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
    color: "#555", transition: "color 0.2s", letterSpacing: 0.3,
  },
  descText: {
    fontSize: 13, lineHeight: 1.8, color: "#666",
    paddingTop: 12, paddingBottom: 4, animation: "fadeUp 0.25s ease",
  },

  purchaseRow: {
    display: "flex", alignItems: "center",
    gap: 14, marginBottom: 12, flexWrap: "wrap",
  },
  qtyLabel: {
    fontSize: 10, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase", color: "#aaa", minWidth: 24,
  },
  qtyControl: {
    display: "flex", alignItems: "center",
    border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden",
  },
  qtyBtn: {
    width: 44, height: 46, display: "flex", alignItems: "center",
    justifyContent: "center", background: "none", border: "none",
    cursor: "pointer", transition: "background 0.15s",
  },
  qtyValue: {
    width: 44, textAlign: "center", fontWeight: 700, fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    borderLeft: "1px solid #e8e8e8", borderRight: "1px solid #e8e8e8",
    lineHeight: "46px",
  },
  addBtn: {
    flex: 1, height: 46, background: "#0d5e5e", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s, letter-spacing 0.2s",
    boxShadow: "0 4px 16px rgba(13,94,94,0.2)",
    minWidth: 180,
  },
  stockNote: { fontSize: 11, color: "#888", marginTop: 4 },

  /* TABLE */
  tableSection: {
    background: "#fff", borderRadius: 16,
    boxShadow: "0 2px 40px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  tableSectionHeader: {
    padding: "28px 36px 20px",
    borderBottom: "1px solid #f0f0f0",
  },
  tableTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: "-0.2px",
  },
  tableSubtitle: { fontSize: 12, color: "#aaa", marginTop: 4, letterSpacing: 0.3 },
  tableWrap: { overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    padding: "12px 36px", fontFamily: "'DM Sans', sans-serif",
    fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
    textTransform: "uppercase", color: "#aaa",
    background: "#fafafa", borderBottom: "1px solid #ebebeb",
    textAlign: "left",
  },
  tdMono: {
    padding: "14px 36px", fontFamily: "monospace",
    fontSize: 12, color: "#0d5e5e", borderBottom: "1px solid #f5f5f5",
    transition: "background 0.15s", whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 36px", color: "#444",
    borderBottom: "1px solid #f5f5f5",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.15s",
  },
  emptyCell: {
    padding: "40px", textAlign: "center", color: "#bbb",
    fontStyle: "italic", fontSize: 13,
  },
};