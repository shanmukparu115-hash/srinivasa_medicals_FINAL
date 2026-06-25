import { API_BASE } from "../lib/api";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export const contactService = {
  async getAllMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/api/contact`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
  },

  async updateMessageStatus(id: string, status: "unread" | "read"): Promise<void> {
    const res = await fetch(`${API_BASE}/api/contact/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
  },

  async deleteMessage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/contact/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete message");
  },
};
