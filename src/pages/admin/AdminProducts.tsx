import React, { useState, useMemo, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2, X,
  CheckCircle, XCircle, Package, ImageOff, AlertTriangle,
} from "lucide-react";
import { productService } from "../../services/productService";
import type { Product } from "../../types";
import { CATEGORIES, getCategoryBySlug } from "../../data/products";
import { ImageUploader, type ImageValue } from "../../components/ImageUploader";
import toast from "react-hot-toast";

const ETHICAL = "ethical-brand";

interface FormData {
  sku: string;
  name: string;
  category: string;
  description: string;
  manufacturer: string;
  price: string;
  mrp: string;
  stockQuantity: string;
  availabilityStatus: "available" | "not-available";
  image: ImageValue;
}

const EMPTY: FormData = {
  sku: "", name: "", category: ETHICAL, description: "", manufacturer: "",
  price: "", mrp: "",
  stockQuantity: "", availabilityStatus: "available",
  image: { dataUrl: null, sourceType: null },
};

const InputCls = "mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";
const LabelCls = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export const AdminProducts: React.FC = () => {
  const [products, setProducts]         = useState<Product[]>([]);
  const [search, setSearch]             = useState("");
  const [catFilter, setCatFilter]       = useState("");
  const [imgFilter, setImgFilter]       = useState<"" | "missing" | "has">(""); // image filter
  const [showModal, setShowModal]       = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [form, setForm]                 = useState<FormData>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage]                 = useState(1);
  const PER_PAGE = 12;

  const load = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to load products.");
    }
  };
  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const isEthical = form.category === ETHICAL;
  const missingImageCount = products.filter(p => !p.imageDataUrl).length;

  const filtered = useMemo(() => {
    let list = products;
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.manufacturer || "").toLowerCase().includes(search.toLowerCase())
    );
    if (catFilter) list = list.filter(p => p.category === catFilter);
    if (imgFilter === "missing") list = list.filter(p => !p.imageDataUrl);
    if (imgFilter === "has")     list = list.filter(p => !!p.imageDataUrl);
    return list;
  }, [products, search, catFilter, imgFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      sku: p.sku || "",
      name: p.name,
      category: p.category,
      description: p.description || "",
      manufacturer: p.manufacturer || "",
      price: p.price != null ? String(p.price) : "",
      mrp: p.mrp != null ? String(p.mrp) : "",
      stockQuantity: p.stockQuantity != null ? String(p.stockQuantity) : "",
      availabilityStatus: p.availabilityStatus ?? "available",
      image: { dataUrl: p.imageDataUrl ?? null, sourceType: p.imageSourceType ?? null },
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sku.trim()) { toast.error("Product SKU is required."); return; }
    if (!form.name.trim()) { toast.error("Product name is required."); return; }
    const isEth = form.category === ETHICAL;
    if (isEth && form.stockQuantity === "") {
      toast.error("Stock quantity is required for Ethical/Brand.");
      return;
    }
    if (!form.image.dataUrl) {
      toast("⚠ Product saved without image. Please upload one.", { icon: "⚠️" });
    }

    const data: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      manufacturer: form.manufacturer.trim(),
      price: form.price !== "" ? Number(form.price) : null,
      mrp: form.mrp !== "" ? Number(form.mrp) : null,
      imageDataUrl: form.image.dataUrl,
      imageSourceType: form.image.sourceType,
      stockQuantity: isEth ? Number(form.stockQuantity) : null,
      availabilityStatus: isEth ? null : form.availabilityStatus,
    };

    try {
      if (editingId) {
        await productService.update(editingId, data);
        toast.success("Product updated!");
      } else {
        await productService.add(data);
        toast.success("Product added!");
      }
      setShowModal(false);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
      toast.success("Product deleted.");
      setDeleteConfirm(null);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 shadow transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Missing image warning banner */}
      {missingImageCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl bg-warning/10 border border-warning/30 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">
              {missingImageCount} product{missingImageCount > 1 ? "s" : ""} missing an image
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customers will see a "No Image Available" placeholder. Edit each product to upload its exact image.
            </p>
            <button
              onClick={() => { setImgFilter("missing"); setPage(1); }}
              className="mt-1.5 text-xs text-warning font-semibold hover:underline"
            >
              Show products without images →
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="pl-9 h-10 w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={imgFilter} onChange={e => { setImgFilter(e.target.value as "" | "missing" | "has"); setPage(1); }}
          className="h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="">All Images</option>
          <option value="missing">⚠ Missing Image</option>
          <option value="has">✓ Has Image</option>
        </select>
        {(search || catFilter || imgFilter) && (
          <button onClick={() => { setSearch(""); setCatFilter(""); setImgFilter(""); setPage(1); }}
            className="h-10 px-3 rounded-xl border text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1.5">
            <X className="h-4 w-4" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-background shadow-card overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first product above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {["Image", "Product", "Category", "Price", "Stock / Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map(p => {
                  const pCat = getCategoryBySlug(p.category);
                  const isEth = pCat?.showStock === true;
                  return (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">

                      {/* Image cell */}
                      <td className="px-4 py-3">
                        <div className="relative group cursor-pointer" onClick={() => openEdit(p)}>
                          {p.imageDataUrl ? (
                            <img
                              src={p.imageDataUrl}
                              alt={p.name}
                              className="h-14 w-14 rounded-xl object-cover border border-border shadow-sm"
                              onError={e => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-muted/50 border border-warning/30 flex flex-col items-center justify-center gap-0.5">
                              <ImageOff className="h-5 w-5 text-muted-foreground" />
                              <span className="text-[9px] text-warning font-bold uppercase leading-none">
                                Upload
                              </span>
                            </div>
                          )}
                          {/* Hover edit hint */}
                          <div className="absolute inset-0 bg-primary/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Edit2 className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-semibold text-foreground">{p.name}</p>
                              {p.sku && (
                                <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                                  {p.sku}
                                </span>
                              )}
                            </div>
                            {p.manufacturer && (
                              <p className="text-xs text-muted-foreground mt-0.5">{p.manufacturer}</p>
                            )}
                            {!p.imageDataUrl && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-warning bg-warning/10 rounded-full px-1.5 py-0.5">
                                <AlertTriangle className="h-2.5 w-2.5" /> No image
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-muted-foreground text-xs font-medium">
                        {pCat?.name ?? p.category}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        {p.price != null ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-foreground text-sm">₹{p.price}</span>
                            {p.mrp != null && p.mrp > p.price && (
                              <span className="text-xs text-muted-foreground line-through">₹{p.mrp}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not set</span>
                        )}
                      </td>

                      {/* Stock / Status */}
                      <td className="px-4 py-3">
                        {isEth ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            (p.stockQuantity ?? 0) === 0
                              ? "bg-destructive/15 text-destructive"
                              : (p.stockQuantity ?? 0) <= 5
                              ? "bg-warning/15 text-warning"
                              : "bg-success/15 text-success"
                          }`}>
                            {(p.stockQuantity ?? 0) === 0
                              ? "Out of Stock"
                              : `${p.stockQuantity} Units`}
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            p.availabilityStatus === "available"
                              ? "bg-success/15 text-success"
                              : "bg-destructive/15 text-destructive"
                          }`}>
                            {p.availabilityStatus === "available"
                              ? <><CheckCircle className="h-3 w-3" /> Available</>
                              : <><XCircle className="h-3 w-3" /> Not Available</>}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit product & image">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {deleteConfirm === p.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(p.id)}
                                className="px-2 py-1 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90">
                                Delete
                              </button>
                              <button onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 rounded-lg bg-muted text-foreground text-xs">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(p.id)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete product">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {filtered.length} products
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`h-7 w-7 rounded-lg text-xs font-semibold ${
                    n === page ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-xl bg-background rounded-2xl border shadow-elevated max-h-[95vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-background z-10">
              <h2 className="font-bold text-foreground">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* ── PRODUCT IMAGE (top of form — most important) ── */}
              <div>
                <label className={LabelCls}>
                  Product Image *
                  <span className="ml-1 normal-case font-normal text-muted-foreground">
                    (must be the exact image of THIS product)
                  </span>
                </label>
                <div className="mt-2">
                  <ImageUploader
                    value={form.image}
                    onChange={img => setForm(f => ({ ...f, image: img }))}
                    productName={form.name || "this product"}
                  />
                </div>
              </div>

              <hr className="border-border" />

              {/* SKU */}
              <div>
                <label className={LabelCls}>SKU / Item Code *</label>
                <input
                  value={form.sku}
                  onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                  required className={InputCls}
                  placeholder="e.g. ETH-0001, GEN-0001, SUR-0001"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className={LabelCls}>Product Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required className={InputCls}
                  placeholder="e.g. Dolo 650, Augmentin 625, Johnson's Baby Oil"
                />
              </div>

              {/* Category */}
              <div>
                <label className={LabelCls}>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className={InputCls}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Manufacturer */}
              <div>
                <label className={LabelCls}>Manufacturer</label>
                <input
                  value={form.manufacturer}
                  onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))}
                  className={InputCls}
                  placeholder="e.g. Cipla, Sun Pharma, J&J"
                />
              </div>

              {/* Description */}
              <div>
                <label className={LabelCls}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Optional product description"
                />
              </div>

              {/* Price + MRP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LabelCls}>
                    Selling Price (₹)
                  </label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className={`${InputCls} pl-7`}
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Price shown to customers</p>
                </div>
                <div>
                  <label className={LabelCls}>
                    MRP (₹) <span className="font-normal normal-case text-muted-foreground">optional</span>
                  </label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.mrp}
                      onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))}
                      className={`${InputCls} pl-7`}
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Shown as strikethrough if &gt; price</p>
                </div>
              </div>

              {/* Dynamic: stock or availability */}
              <div className="rounded-xl border bg-muted/20 p-4">
                {isEthical ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded-full bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5">
                        Ethical / Brand
                      </span>
                      <span className="text-xs text-muted-foreground">→ Enter exact stock quantity</span>
                    </div>
                    <label className={LabelCls}>Stock Quantity *</label>
                    <input
                      type="number" min="0"
                      value={form.stockQuantity}
                      onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))}
                      required className={InputCls} placeholder="0"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Customers see: "Stock: {form.stockQuantity || "0"} Units"
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded-full bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-0.5">
                        {CATEGORIES.find(c => c.slug === form.category)?.name ?? form.category}
                      </span>
                      <span className="text-xs text-muted-foreground">→ Set availability</span>
                    </div>
                    <label className={LabelCls}>Availability Status *</label>
                    <div className="mt-2 flex gap-3">
                      {(["available", "not-available"] as const).map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, availabilityStatus: status }))}
                          className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border text-sm font-semibold transition-colors ${
                            form.availabilityStatus === status
                              ? status === "available"
                                ? "bg-success text-success-foreground border-success"
                                : "bg-destructive text-destructive-foreground border-destructive"
                              : "bg-card hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {status === "available"
                            ? <><CheckCircle className="h-4 w-4" /> Available</>
                            : <><XCircle className="h-4 w-4" /> Not Available</>}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Customers see: {form.availabilityStatus === "available" ? "✅ Available" : "❌ Not Available"}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 h-10 rounded-xl border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
