import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, CheckCircle, XCircle, Phone, FileText, Tag } from "lucide-react";
import { productService } from "../services/productService";
import { getCategoryBySlug } from "../data/products";
import { ProductImage } from "../components/ProductImage";
import type { Product } from "../types";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    if (id) {
      productService.getById(id)
        .then((prod) => {
          setProduct(prod);
          setLoaded(true);
        })
        .catch((err) => {
          console.error("Error loading product:", err);
          setLoaded(true);
        });
    }
  }, [id]);

  if (!loaded) return null;

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const cat       = getCategoryBySlug(product.category);
  const isEthical = cat?.showStock === true;

  const renderStockInfo = () => {
    if (isEthical) {
      const qty = product.stockQuantity ?? 0;
      return (
        <div className={`flex items-center gap-3 rounded-2xl border p-4 ${
          qty === 0
            ? "bg-destructive/10 border-destructive/25"
            : qty <= 5
            ? "bg-warning/10 border-warning/25"
            : "bg-success/10 border-success/25"
        }`}>
          {qty === 0
            ? <XCircle className="h-6 w-6 text-destructive shrink-0" />
            : <CheckCircle className="h-6 w-6 text-success shrink-0" />}
          <div>
            <p className={`font-bold text-lg ${
              qty === 0 ? "text-destructive" : qty <= 5 ? "text-warning" : "text-success"
            }`}>
              {qty === 0 ? "Out of Stock" : `Stock: ${qty} Unit${qty !== 1 ? "s" : ""}`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {qty === 0
                ? "Currently unavailable. Call us to enquire."
                : qty <= 5
                ? "Limited stock — call to reserve."
                : "In stock at our store."}
            </p>
          </div>
        </div>
      );
    }
    const available = product.availabilityStatus === "available";
    return (
      <div className={`flex items-center gap-3 rounded-2xl border p-4 ${
        available
          ? "bg-success/10 border-success/25"
          : "bg-destructive/10 border-destructive/25"
      }`}>
        {available
          ? <CheckCircle className="h-6 w-6 text-success shrink-0" />
          : <XCircle className="h-6 w-6 text-destructive shrink-0" />}
        <div>
          <p className={`font-bold text-lg ${available ? "text-success" : "text-destructive"}`}>
            {available ? "Available" : "Not Available"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {available
              ? "Available at our store. Walk in or call us."
              : "Currently not stocked. Call us for alternatives."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 w-full">
      <Link to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Image */}
        <ProductImage product={product} size="detail" />

        {/* Right: Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary uppercase">
                {cat?.name ?? product.category}
              </span>
              {product.sku && (
                <span className="text-xs font-mono text-muted-foreground font-semibold uppercase">
                  SKU: {product.sku}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mt-2">
              {product.name}
            </h1>
            {product.manufacturer && (
              <p className="text-sm text-muted-foreground mt-1">
                Manufacturer: <span className="font-semibold">{product.manufacturer}</span>
              </p>
            )}
          </div>

          {product.price != null ? (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-foreground">
                ₹{product.price}
              </span>
              {product.mrp != null && product.mrp > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.mrp}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-success/15 text-success text-sm font-bold px-3 py-1">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span className="text-sm">Price on request — call us for pricing</span>
            </div>
          )}

          {renderStockInfo()}

          {product.description && (
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Description
              </p>
              <p className="text-sm text-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+919666930275"
              className="flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex-1">
              <Phone className="h-4 w-4" /> Call to Order: +91 96669 30275
            </a>
            <Link to="/prescription"
              className="flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold hover:bg-muted transition-colors flex-1">
              <FileText className="h-4 w-4" /> Upload Prescription
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Online delivery coming soon · Visit us at Hanuman Junction, Tallamudi, AP 521105
          </p>
        </div>
      </div>
    </div>
  );
};
