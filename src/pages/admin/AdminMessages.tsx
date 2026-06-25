import React, { useEffect, useState } from "react";
import { MessageSquare, Mail, MailOpen } from "lucide-react";
import toast from "react-hot-toast";
import { contactService } from "../../services/contactService";
import type { ContactMessage } from "../../services/contactService";

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await contactService.getAllMessages();
      setMessages(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await contactService.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete message.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: "unread" | "read") => {
    const newStatus = currentStatus === "unread" ? "read" : "unread";
    try {
      await contactService.updateMessageStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      toast.success(`Message marked as ${newStatus}.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Contact Messages
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage customer inquiries.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No messages found.</p>
            <p className="text-sm mt-1">When customers contact you, their messages will appear here.</p>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 transition-colors ${
                  msg.status === "unread" ? "bg-primary/5" : "bg-card"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        {msg.status === "unread" ? (
                          <Mail className="h-5 w-5 text-primary" />
                        ) : (
                          <MailOpen className="h-5 w-5 text-muted-foreground" />
                        )}
                        {msg.subject || "No Subject"}
                      </h3>
                      {msg.status === "unread" && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{msg.name}</span> •{" "}
                      <a href={`mailto:${msg.email}`} className="hover:text-primary hover:underline">
                        {msg.email}
                      </a>{" "}
                      • {new Date(msg.createdAt).toLocaleString()}
                    </div>
                    
                    <div className="mt-4 p-4 bg-background rounded-xl border text-sm text-foreground whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:flex-col md:items-end">
                    <button
                      onClick={() => handleToggleStatus(msg.id, msg.status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        msg.status === "unread"
                          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                          : "bg-background text-foreground border-input hover:bg-muted"
                      }`}
                    >
                      Mark as {msg.status === "unread" ? "Read" : "Unread"}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border border-transparent"
                    >
                      Delete
                    </button>
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
