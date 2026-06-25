import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, FileText, CheckCircle, XCircle, Clock, Phone, ArrowRight } from "lucide-react";
import { prescriptionService } from "../services/prescriptionService";
import type { PrescriptionRecord } from "../types";

const STATUS_COLORS: Record<string, string> = {
  Pending:  "bg-warning/15 text-warning border-warning/30",
  Approved: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  Pending:  <Clock className="h-4 w-4" />,
  Approved: <CheckCircle className="h-4 w-4" />,
  Rejected: <XCircle className="h-4 w-4" />,
};

export const Track: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [rxId, setRxId] = useState(searchParams.get("id") || "");
  const [result, setResult] = useState<PrescriptionRecord | null | undefined>(undefined);

  const doSearch = async (id: string) => {
    try {
      const all = await prescriptionService.getAll();
      const record = all.find(r => r.id === id.trim().toUpperCase());
      setResult(record ?? null);
    } catch (err) {
      console.error("Failed to track prescription:", err);
      setResult(null);
    }
  };

  // Auto-search if id in URL
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const t = setTimeout(() => {
        doSearch(id);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(rxId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground">Track Prescription</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your Prescription ID to check its status.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl w-full px-4 py-10">
        {/* Search */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={rxId}
              onChange={e => setRxId(e.target.value.toUpperCase())}
              placeholder="e.g. RXAB1234"
              className="pl-9 h-11 w-full rounded-xl border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button type="submit"
            className="h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Track
          </button>
        </form>

        {/* Result */}
        {result === null && (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground">Prescription not found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No prescription found with ID "{rxId}". Please check and try again.
            </p>
            <a href="tel:+919666930275"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Phone className="h-4 w-4" /> Call Us for Help
            </a>
          </div>
        )}

        {result && (
          <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Prescription ID</p>
                  <p className="font-bold font-mono text-foreground">{result.id}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${STATUS_COLORS[result.status]}`}>
                  {STATUS_ICONS[result.status]} {result.status}
                </span>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Patient</p>
                  <p className="text-foreground font-medium">{result.name}</p>
                  <p className="text-muted-foreground">{result.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Submitted On</p>
                  <p className="text-foreground">
                    {new Date(result.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Status message */}
              <div className={`rounded-xl px-4 py-3 text-sm border ${
                result.status === "Approved" ? "bg-success/10 border-success/25 text-success"
                : result.status === "Rejected" ? "bg-destructive/10 border-destructive/25 text-destructive"
                : "bg-warning/10 border-warning/25 text-warning"
              }`}>
                {result.status === "Pending"  && "Under review. Our pharmacist will call you within 30 minutes."}
                {result.status === "Approved" && "Approved! Our pharmacist will contact you shortly to confirm your order."}
                {result.status === "Rejected" && "Could not be processed. Please upload a clearer prescription or call us."}
                {result.adminNotes && (
                  <p className="mt-1 text-xs">
                    <span className="font-bold">Pharmacist note:</span> {result.adminNotes}
                  </p>
                )}
              </div>

              <div className="flex gap-3 flex-wrap pt-2">
                <a href="tel:+919666930275"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
                  <Phone className="h-4 w-4" /> Call Pharmacist
                </a>
                {result.status === "Rejected" && (
                  <Link to="/prescription"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Upload New <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {result === undefined && (
          <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">Enter your Prescription ID above</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your Prescription ID was sent when you uploaded it. It starts with "RX".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
