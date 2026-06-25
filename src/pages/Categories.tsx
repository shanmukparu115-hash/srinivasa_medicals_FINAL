import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "../data/products";
import { productService } from "../services/productService";

export const Categories: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    productService.getAll()
      .then((all) => {
        const c: Record<string, number> = {};
        CATEGORIES.forEach(cat => {
          c[cat.slug] = all.filter(p => p.category === cat.slug).length;
        });
        setCounts(c);
      })
      .catch((err) => {
        console.error("Failed to load products for categories:", err);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Browse medicines and products by category
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 w-full">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/products?cat=${cat.slug}`}
              className="group rounded-2xl border bg-card shadow-card hover:shadow-elevated transition-all overflow-hidden"
            >
              {/* Banner */}
              <div className={`h-32 bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                <cat.icon className="h-14 w-14 text-white opacity-90" />
              </div>
              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-foreground text-lg leading-tight">{cat.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0 group-hover:text-primary transition-colors" />
                </div>

                {/* Stock rule label */}
                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    cat.showStock
                      ? "bg-blue-100 text-blue-700"
                      : "bg-teal-100 text-teal-700"
                  }`}>
                    {cat.showStock ? "Shows stock quantity" : "Shows availability"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {counts[cat.slug] ?? 0} product{(counts[cat.slug] ?? 0) !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
