import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { productService } from "../services/productService";
import { CATEGORIES } from "../data/products";
import type { Product } from "../types";

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";
  const pageParam = searchParams.get("page") || "1";
  const page = parseInt(pageParam, 10) || 1;
  const limit = 12;

  useEffect(() => {
    const fetchProds = async () => {
      setLoading(true);
      try {
        const data = await productService.search({ q, category: cat, page, limit });
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    // Debounce search input slightly if needed, but here we just fetch on change
    const timer = setTimeout(() => {
      fetchProds();
    }, 300);
    return () => clearTimeout(timer);
  }, [q, cat, page]);

  const set = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    // Reset page to 1 on new filter
    if (key !== "page") {
      p.set("page", "1");
    }
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});
  const hasFilters = !!(q || cat);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <div className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Medicine Catalogue</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {loading ? "Searching..." : `${total} product${total !== 1 ? "s" : ""} found`}
            {cat && !loading && ` in ${CATEGORIES.find(c => c.slug === cat)?.name ?? cat}`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 w-full">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={e => set("q", e.target.value)}
              placeholder="Search medicines, brands, SKUs…"
              className="pl-9 h-10 w-full rounded-xl border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category filter */}
          <select
            value={cat}
            onChange={e => set("cat", e.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="h-10 px-3 rounded-xl border text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1.5"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => set("cat", "")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
              !cat ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:border-primary/50"
            }`}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.slug}
              onClick={() => set("cat", c.slug)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                cat === c.slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground hover:border-primary/50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Grid & Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col rounded-2xl border bg-card shadow-card overflow-hidden animate-pulse">
                <div className="h-44 bg-muted w-full"></div>
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mt-1"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="mt-auto h-5 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card py-24 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              {hasFilters
                ? "Try adjusting your filters or searching for something else."
                : "No products available."}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t">
                <button
                  disabled={page <= 1}
                  onClick={() => set("page", (page - 1).toString())}
                  className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => set("page", (page + 1).toString())}
                  className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
