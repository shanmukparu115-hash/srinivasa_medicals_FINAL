import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Tag } from "lucide-react";
import type { Product } from "../types";
import { getCategoryBySlug } from "../data/products";
import { ProductImage } from "./ProductImage";

interface Props { product: Product; }

export const ProductCard: React.FC<Props> = ({ product }) => {
  const cat       = getCategoryBySlug(product.category);
  const isEthical = cat?.showStock === true;

  const hasPrice  = product.price != null;
  const hasMrp    = product.mrp != null && product.mrp > (product.price ?? 0);
  const discount  = hasPrice && hasMrp
    ? Math.round(((product.mrp! - product.price!) / product.mrp!) * 100)
    : null;

  const stockBadge = (() => {
    if (isEthical) {
      const qty = product.stockQuantity ?? 0;
      if (qty === 0) return (
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold px-2 py-0.5">
          <XCircle className="h-2.5 w-2.5" /> Out of Stock
        </span>
      );
      return (
        <span className={`inline-flex items-center rounded-full text-[10px] font-bold px-2 py-0.5 ${
          qty <= 5 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
        }`}>
          Stock: {qty} Unit{qty !== 1 ? "s" : ""}
        </span>
      );
    }
    const available = product.availabilityStatus === "available";
    return available ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-success text-[10px] font-bold px-2 py-0.5">
        <CheckCircle className="h-2.5 w-2.5" /> Available
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold px-2 py-0.5">
        <XCircle className="h-2.5 w-2.5" /> Not Available
      </span>
    );
  })();

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col rounded-2xl border bg-card shadow-card hover:shadow-elevated transition-all overflow-hidden"
    >
      {/* Product image */}
      <ProductImage
        product={product}
        size="card"
        className="group-hover:brightness-95 transition-all"
      />

      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Category + name */}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">
              {cat?.name ?? product.category}
            </p>
            {product.sku && (
              <span className="text-[9px] font-mono text-muted-foreground font-medium uppercase">
                {product.sku}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-foreground line-clamp-2 mt-0.5 leading-snug">
            {product.name}
          </h3>
          {product.manufacturer && (
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
              {product.manufacturer}
            </p>
          )}
        </div>

        {/* Price row */}
        {hasPrice ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-foreground">
              ₹{product.price}
            </span>
            {hasMrp && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.mrp}
              </span>
            )}
            {discount && discount > 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold px-1.5 py-0.5">
                {discount}% off
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" /> Price on request
          </p>
        )}

        {/* Stock / availability */}
        {stockBadge}
      </div>
    </Link>
  );
};
