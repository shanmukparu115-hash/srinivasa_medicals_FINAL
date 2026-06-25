// ============================================================
// feedbackService.ts — Customer feedback consuming Express API
// ============================================================
import type { Feedback } from "../types";
import { API_BASE } from "../lib/api";

export const feedbackService = {
  async getAll(): Promise<Feedback[]> {
    const res = await fetch(`${API_BASE}/api/feedback`);
    if (!res.ok) throw new Error("Failed to fetch feedback.");
    return res.json();
  },

  async create(
    userId: string | undefined,
    customerName: string,
    email: string,
    rating: number,
    category: string,
    message: string
  ): Promise<Feedback> {
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, customerName, email, rating, category, message }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit feedback.");
    }

    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/feedback/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete feedback.");
  },

  getAverageRating(items: Feedback[]): number {
    if (items.length === 0) return 0;
    return items.reduce((s, f) => s + f.rating, 0) / items.length;
  },
};
