import React, { useState, useMemo, useEffect } from "react";
import { Search, Star, Trash2, MessageSquare, TrendingUp } from "lucide-react";
import { feedbackService } from "../../services/feedbackService";
import type { Feedback } from "../../types";
import toast from "react-hot-toast";

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const RATING_COLORS: Record<number, string> = {
  1: "text-red-500", 2: "text-orange-500", 3: "text-yellow-500",
  4: "text-lime-500", 5: "text-green-500",
};

export const AdminFeedback: React.FC = () => {
  const [items, setItems] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await feedbackService.getAll();
      setItems(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to load feedback.");
    }
  };
  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.customerName.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.message.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    }
    if (ratingFilter) list = list.filter(f => String(f.rating) === ratingFilter);
    return list;
  }, [items, search, ratingFilter]);

  const avgRating = items.length
    ? (items.reduce((s, f) => s + f.rating, 0) / items.length).toFixed(1)
    : "—";

  const handleDelete = async (id: string) => {
    try {
      await feedbackService.delete(id);
      toast.success("Feedback deleted.");
      setDeleteConfirm(null);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to delete feedback.");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Delete all ${items.length} feedback entries permanently?`)) return;
    try {
      await Promise.all(items.map(f => feedbackService.delete(f.id)));
      toast.success("All feedback deleted.");
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to delete all feedback.");
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: items.filter(f => f.rating === r).length,
    pct: items.length ? Math.round((items.filter(f => f.rating === r).length / items.length) * 100) : 0,
  }));

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Feedback</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} submission{items.length !== 1 ? "s" : ""} · Average: {avgRating} ★
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 text-destructive px-4 py-2 text-sm font-semibold hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Delete All
          </button>
        )}
      </div>

      {/* Stats row */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[auto_1fr]">
          {/* Big average */}
          <div className="rounded-2xl border bg-background shadow-card p-6 flex flex-col items-center justify-center min-w-[160px]">
            <p className="text-5xl font-bold text-foreground">{avgRating}</p>
            <div className="flex gap-0.5 mt-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
          </div>
          {/* Bar chart */}
          <div className="rounded-2xl border bg-background shadow-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Rating Distribution
            </p>
            <div className="space-y-2">
              {ratingCounts.map(({ rating, count, pct }) => (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-right text-muted-foreground font-medium">{rating}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, message or category…"
            className="pl-9 h-10 w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}
          className="h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Ratings</option>
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="rounded-2xl border bg-background shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">No feedback yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Customer feedback will appear here once submitted.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(fb => (
              <div key={fb.id} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {fb.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{fb.customerName}</p>
                        {fb.email && (
                          <p className="text-xs text-muted-foreground">{fb.email}</p>
                        )}
                        <span className="ml-auto sm:ml-0 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {fb.category}
                        </span>
                      </div>
                      {/* Stars */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`h-3.5 w-3.5 ${s <= fb.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                        <span className={`text-xs font-semibold ${RATING_COLORS[fb.rating]}`}>
                          {STAR_LABELS[fb.rating]}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          · {new Date(fb.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {/* Message */}
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        "{fb.message}"
                      </p>
                    </div>
                  </div>
                  {/* Delete */}
                  <div className="shrink-0">
                    {deleteConfirm === fb.id ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">Delete?</span>
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(fb.id)}
                            className="rounded-lg bg-destructive text-destructive-foreground px-2 py-1 text-xs font-semibold hover:bg-destructive/90">
                            Yes
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="rounded-lg border px-2 py-1 text-xs font-semibold hover:bg-muted">
                            No
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(fb.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
