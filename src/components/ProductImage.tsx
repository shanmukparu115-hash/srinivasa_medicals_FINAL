/**
 * ProductImage — renders a product's OWN image or a strict "No Image" placeholder.
 *
 * Supports:
 *   • base64 dataUrl  (uploaded by admin)
 *   • https:// URL    (pre-seeded catalogue images)
 *
 * RULES:
 * 1. Only renders product.imageDataUrl (this product's own image reference).
 * 2. If null / empty / broken → shows "No Image Available" placeholder.
 * 3. NEVER falls back to a category image or another product's image.
 * 4. showWarning=true adds admin-visible "Upload Image" badge.
 */
import React, { useState } from "react";
import { ImageOff, Upload } from "lucide-react";
import type { Product } from "../types";
import { getCategoryBySlug } from "../data/products";

interface ProductImageProps {
  product: Product;
  className?: string;
  showWarning?: boolean;
  size?: "card" | "detail" | "thumb";
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = "",
  showWarning = false,
  size = "card",
}) => {
  const [imgError, setImgError] = useState(false);
  const cat = getCategoryBySlug(product.category);
  const bgGradient = cat?.color ?? "from-slate-400 to-slate-600";
  const hasImage = !!product.imageDataUrl && !imgError;

  const heightClass = {
    thumb:  "h-16 w-16",
    card:   "h-44 w-full",
    detail: "h-80 w-full",
  }[size];

  if (hasImage) {
    return (
      <div className={`relative overflow-hidden ${size === "thumb" ? "rounded-lg" : "rounded-xl"} bg-white ${className}`}>
        <img
          src={product.imageDataUrl!}
          alt={product.name}
          className={`${heightClass} w-full object-contain p-2`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {showWarning && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 text-white text-[10px] px-2 py-1 font-semibold">
              <Upload className="h-3 w-3" /> Change
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── NO IMAGE PLACEHOLDER ──────────────────────────────────
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden
        bg-gradient-to-br ${bgGradient}
        ${size === "thumb" ? "rounded-lg" : "rounded-xl"}
        ${heightClass} ${className}`}
    >
      <ImageOff className={`text-white/70 ${size === "thumb" ? "h-6 w-6" : "h-10 w-10"}`} />
      {size !== "thumb" && (
        <p className="mt-2 text-white/80 text-xs font-semibold text-center px-2">
          No Image Available
        </p>
      )}
      {showWarning && size !== "thumb" && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg bg-warning text-warning-foreground text-[10px] px-2 py-1 font-bold">
          <Upload className="h-3 w-3" /> Upload Image
        </span>
      )}
    </div>
  );
};
