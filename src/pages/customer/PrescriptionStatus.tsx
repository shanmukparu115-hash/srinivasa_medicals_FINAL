import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FileText, CheckCircle, XCircle, Clock, ChevronDown,
  File, Eye, Download, Phone, Upload, RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { prescriptionService } from "../../services/prescriptionService";
import type { PrescriptionRecord, PrescriptionFile } from "../../types";

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending: {
    icon:    <Clock className="h-5 w-5" />,
    color:   "text-warning",
    bg:      "bg-warning/10 border-warning/30",
    bar:     "bg-warning",
    border:  "border-l-warning",
    label:   "Under Review",
    message: "Your prescription has been received and is being reviewed by our pharmacist. We will call you within 30 minutes to confirm availability and pricing.",
  },
  Approved: {
    icon:    <CheckCircle className="h-5 w-5" />,
    color:   "text-success",
    bg:      "bg-success/10 border-success/30",
    bar:     "bg-success",
    border:  "border-l-success",
    label:   "Approved ✓",
    message: "Great news! Your prescription has been approved. Our pharmacist will contact you shortly to confirm your order and arrange delivery or pickup.",
  },
  Rejected: {
    icon:    <XCircle className="h-5 w-5" />,
    color:   "text-destructive",
    bg:      "bg-destructive/10 border-destructive/30",
    bar:     "bg-destructive",
    border:  "border-l-destructive",
    label:   "Rejected",
    message: "We were unable to process this prescription. This may be due to an unclear image or missing details. Please upload a clearer copy or call us for assistance.",
  },
};

// 3-step progress: Submitted → Under Review → Decision
function getStep(status: string) {
  if (status === "Pending")  return 1;
  return 2;
}

// ── Inline file viewer ────────────────────────────────────────
const FileViewer: React.FC<{ file: PrescriptionFile; onClose: () => void }> = ({ file, onClose }) => {
  const isPdf = file.type === "application/pdf";
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const download = () => {
    const a = document.createElement("a");
    a.href = file.dataUrl; a.download = file.name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black/95">
      <div className="flex items-center justify-between px-5 py-3 bg-black/80 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          {isPdf ? <File className="h-5 w-5 text-red-400" /> : <Eye className="h-5 w-5 text-blue-400" />}
          <span className="text-white text-sm font-medium truncate max-w-xs">{file.name}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={download}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
            <Download className="h-4 w-4" /> Download
          </button>
          <button onClick={onClose}
            className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20">
            ✕ Close
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isPdf
          ? <iframe src={file.dataUrl} title={file.name}
              className="w-full max-w-4xl rounded-lg bg-white"
              style={{ height: "calc(100vh - 120px)", minHeight: 500 }} />
          : <img src={file.dataUrl} alt={file.name}
              className="max-h-[calc(100vh-120px)] max-w-full rounded-lg shadow-2xl object-contain"
              draggable={false} />
        }
      </div>
    </div>
  );
};

// ── Single prescription status card ──────────────────────────
const RxStatusCard: React.FC<{ rx: PrescriptionRecord }> = ({ rx }) => {
  const [open, setOpen] = useState(false);
  const [viewer, setViewer] = useState<PrescriptionFile | null>(null);
  const cfg  = STATUS_CONFIG[rx.status];
  const step = getStep(rx.status);
  const STEPS = ["Submitted", "Under Review", "Decision Made"];

  return (
    <div className={`rounded-2xl border-l-4 border border-border/70 bg-card shadow-card overflow-hidden ${cfg.border}`}>
      {viewer && <FileViewer file={viewer} onClose={() => setViewer(null)} />}

      {/* ── Top: always visible ── */}
      <div className="px-5 pt-4 pb-3">

        {/* ID + date + status badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-bold font-mono text-foreground tracking-wide">{rx.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submitted {new Date(rx.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })} · {rx.files.length} file{rx.files.length !== 1 ? "s" : ""}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold border ${cfg.bg} ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
        </div>

        {/* 3-step progress bar */}
        <div className="mt-4 flex items-center">
          {STEPS.map((label, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1 min-w-[64px]">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all
                    ${done   ? "bg-success text-white"
                    : active ? `${cfg.bar} text-white ${rx.status === "Pending" ? "ring-2 ring-offset-1 ring-warning/50" : ""}`
                    : "bg-muted text-muted-foreground"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-semibold text-center leading-tight
                    ${active ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>

                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-1 rounded-full mb-4 transition-all
                    ${i < step ? "bg-success" : "bg-muted"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Status message — always visible */}
        <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed border ${cfg.bg}`}>
          <p className={`font-semibold mb-1 ${cfg.color}`}>{cfg.label}</p>
          <p className="text-muted-foreground">{cfg.message}</p>
          {rx.adminNotes && (
            <p className="mt-2 text-xs border-t border-border/50 pt-2">
              <span className="font-bold text-foreground">Pharmacist's note: </span>
              <span className="text-muted-foreground">{rx.adminNotes}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── Expand toggle ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-2.5 border-t text-xs font-semibold text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <span>{open ? "Hide uploaded files" : `View uploaded files (${rx.files.length})`}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* ── Expanded files ── */}
      {open && (
        <div className="border-t px-5 py-4 space-y-4 bg-muted/5">

          {/* Your notes */}
          {rx.notes && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Your Notes to Pharmacist
              </p>
              <p className="text-sm text-foreground bg-muted/30 rounded-xl px-4 py-3 leading-relaxed">
                {rx.notes}
              </p>
            </div>
          )}

          {/* File thumbnails */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Files You Uploaded
            </p>
            {rx.files.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No files uploaded with this prescription.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {rx.files.map((file, idx) => {
                  const isPdf = file.type === "application/pdf";
                  return (
                    <div key={idx} onClick={() => setViewer(file)}
                      className="group relative flex flex-col rounded-xl border bg-background overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer w-28">
                      <div className="relative w-full h-20 bg-muted/30 flex items-center justify-center overflow-hidden">
                        {isPdf ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                              <File className="h-5 w-5 text-red-500" />
                            </div>
                            <span className="text-[10px] font-bold text-red-500 uppercase">PDF</span>
                          </div>
                        ) : (
                          <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <Eye className="h-5 w-5 text-white" />
                          <span className="text-[10px] text-white font-semibold">
                            {isPdf ? "View PDF" : "View"}
                          </span>
                        </div>
                      </div>
                      <div className="px-2 pt-1.5 pb-2">
                        <p className="text-[10px] font-medium text-foreground truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Click any file to view it full-screen.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap pt-2 border-t">
            {rx.status === "Rejected" && (
              <Link to="/prescription"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" /> Upload New Prescription
              </Link>
            )}
            <a href="tel:+919666930275"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
              <Phone className="h-4 w-4" /> Call Pharmacist
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Prescription Status Page ────────────────────────────
export const PrescriptionStatus: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  const load = useCallback(() => {
    setLoading(true);
    if (user) {
      prescriptionService.getByUserId(user.id)
        .then((data) => {
          setPrescriptions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  const filtered = filter === "All"
    ? prescriptions
    : prescriptions.filter(r => r.status === filter);

  const counts = {
    All:      prescriptions.length,
    Pending:  prescriptions.filter(r => r.status === "Pending").length,
    Approved: prescriptions.filter(r => r.status === "Approved").length,
    Rejected: prescriptions.filter(r => r.status === "Rejected").length,
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <FileText className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Login to check prescription status</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Sign in to your account to view the status of your uploaded prescriptions.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
            Sign In
          </Link>
          <Link to="/register"
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <section className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Prescription Status
              </h1>
              <p className="mt-1 text-muted-foreground">
                Track all your uploaded prescriptions in real time.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={load}
                className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors text-muted-foreground">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
              <Link to="/prescription"
                className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" /> Upload New
              </Link>
            </div>
          </div>

          {/* Summary counts */}
          {prescriptions.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["All", "Pending", "Approved", "Rejected"] as const).map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${
                    filter === s
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card hover:bg-muted"
                  }`}>
                  <p className={`text-2xl font-bold ${filter === s ? "text-primary-foreground" : "text-foreground"}`}>
                    {counts[s]}
                  </p>
                  <p className={`text-xs font-medium mt-0.5 ${filter === s ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {s}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl w-full px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading prescriptions…</p>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No prescriptions yet</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Upload a prescription and our pharmacist will review it within 30 minutes.
            </p>
            <Link to="/prescription"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Upload className="h-4 w-4" /> Upload Prescription
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="text-foreground font-semibold">No {filter} prescriptions</p>
            <button onClick={() => setFilter("All")}
              className="mt-3 text-sm text-primary hover:underline">
              Show all
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(rx => <RxStatusCard key={rx.id} rx={rx} />)}
          </div>
        )}
      </div>
    </div>
  );
};
