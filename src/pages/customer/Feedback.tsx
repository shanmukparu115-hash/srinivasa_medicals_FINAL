import React, { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { feedbackService } from "../../services/feedbackService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = ["General", "Product Quality", "Delivery", "Customer Service", "Pricing"];

export const Feedback: React.FC = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    if (message.trim().length < 10) { toast.error("Please write at least 10 characters."); return; }
    setLoading(true);
    try {
      await feedbackService.create(user?.id, name, email, rating, category, message.trim());
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Feedback Submitted!</h1>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Thank you, {name}. Your feedback helps us serve you better.
        </p>
        <button
          onClick={() => { setSubmitted(false); setRating(0); setMessage(""); setCategory("General"); }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Share your feedback</h1>
          <p className="mt-2 text-muted-foreground">
            We'd love to hear about your experience with Sri Srinivasa Medicals & Fancy Store.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl w-full px-4 py-10">
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-card shadow-card p-6 sm:p-8 space-y-6">

          {/* Star rating */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Overall Rating <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-9 w-9 transition-colors ${
                      s <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-1.5 text-sm font-medium text-amber-600">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium border transition-colors ${
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Your Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text" required value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Your Message <span className="text-destructive">*</span>
            </label>
            <textarea
              required rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us about your experience — what we did well, what we can improve…"
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">{message.length} characters</p>
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex w-full items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
            {loading ? "Submitting…" : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};
