import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, LogOut, Phone, Mail, FileText, Clock,
  CheckCircle, XCircle, ChevronDown, File, Eye,
  Download, Upload,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { prescriptionService } from "../../services/prescriptionService";
import type { PrescriptionRecord, PrescriptionFile } from "../../types";
import toast from "react-hot-toast";

// ── Status config ─────────────────────────────────────────────
const RX_STATUS_COLORS: Record<string, string> = {
  Pending:  "bg-warning/15 text-warning",
  Approved: "bg-success/15 text-success",
  Rejected: "bg-destructive/15 text-destructive",
};
const RX_STATUS_ICONS: Record<string, React.ReactNode> = {
  Pending:  <Clock className="h-4 w-4" />,
  Approved: <CheckCircle className="h-4 w-4" />,
  Rejected: <XCircle className="h-4 w-4" />,
};

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
        <span className="text-white text-sm font-medium truncate max-w-xs">{file.name}</span>
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

// ── Prescription card with step tracker ──────────────────────
const STATUS_BG: Record<string, string> = {
  Pending:  "border-l-warning  bg-warning/5",
  Approved: "border-l-success  bg-success/5",
  Rejected: "border-l-destructive bg-destructive/5",
};

const PrescriptionCard: React.FC<{ rx: PrescriptionRecord }> = ({ rx }) => {
  const [expanded, setExpanded] = useState(false);
  const [viewer, setViewer]     = useState<PrescriptionFile | null>(null);

  const step = rx.status === "Pending" ? 1 : 2;
  const STEPS = ["Submitted", "Under Review", "Decision Made"];

  const stepDotClass = (i: number) => {
    if (i < step) return "bg-success text-white";
    if (i === step) {
      if (rx.status === "Approved")  return "bg-success text-white";
      if (rx.status === "Rejected")  return "bg-destructive text-white";
      return "bg-warning text-white";
    }
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className={`rounded-2xl border-l-4 border border-border bg-card shadow-card overflow-hidden ${STATUS_BG[rx.status]}`}>
      {viewer && <FileViewer file={viewer} onClose={() => setViewer(null)} />}

      {/* Always-visible header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-bold font-mono text-foreground tracking-wide">{rx.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(rx.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })} · {rx.files.length} file{rx.files.length !== 1 ? "s" : ""}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold ${RX_STATUS_COLORS[rx.status]}`}>
            {RX_STATUS_ICONS[rx.status]} {rx.status}
          </span>
        </div>

        {/* 3-step progress */}
        <div className="mt-4 flex items-center">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1 min-w-[64px]">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${stepDotClass(i)}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-1 rounded-full mb-4 ${i < step ? "bg-success" : "bg-muted"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Status message */}
        <div className={`mt-3 rounded-xl px-4 py-3 text-sm border ${
          rx.status === "Approved" ? "bg-success/10 border-success/25 text-success"
          : rx.status === "Rejected" ? "bg-destructive/10 border-destructive/25 text-destructive"
          : "bg-warning/10 border-warning/25 text-warning"
        }`}>
          {rx.status === "Pending"  && "Awaiting pharmacist review. We'll call you within 30 minutes."}
          {rx.status === "Approved" && "Prescription approved! Our pharmacist will contact you shortly."}
          {rx.status === "Rejected" && "Prescription could not be processed. Please upload a clearer copy or call us."}
          {rx.adminNotes && (
            <p className="mt-1 text-xs opacity-80">
              <span className="font-bold">Pharmacist note:</span> {rx.adminNotes}
            </p>
          )}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-2.5 border-t text-xs font-semibold text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <span>{expanded ? "Hide files & details" : `View uploaded files (${rx.files.length})`}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t px-5 py-4 space-y-4 bg-muted/5">
          {rx.notes && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Your Notes</p>
              <p className="text-sm text-foreground bg-muted/30 rounded-xl px-4 py-3">{rx.notes}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Uploaded Files ({rx.files.length})
            </p>
            {rx.files.length === 0
              ? <p className="text-sm text-muted-foreground italic">No files uploaded.</p>
              : (
                <div className="flex flex-wrap gap-3">
                  {rx.files.map((file, idx) => {
                    const isPdf = file.type === "application/pdf";
                    return (
                      <div key={idx} onClick={() => setViewer(file)}
                        className="group relative flex flex-col rounded-xl border bg-background overflow-hidden shadow-sm hover:shadow-md cursor-pointer w-28">
                        <div className="relative w-full h-20 bg-muted/30 flex items-center justify-center overflow-hidden">
                          {isPdf
                            ? <div className="flex flex-col items-center gap-1">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                                  <File className="h-5 w-5 text-red-500" />
                                </div>
                                <span className="text-[10px] font-bold text-red-500 uppercase">PDF</span>
                              </div>
                            : <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
                          }
                          <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="px-2 pt-1.5 pb-2">
                          <p className="text-[10px] font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground">{(file.size/1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            }
            <p className="mt-2 text-xs text-muted-foreground">💡 Click any file to view full-screen.</p>
          </div>
          <div className="flex gap-3 flex-wrap pt-2 border-t">
            {rx.status === "Rejected" && (
              <Link to="/prescription"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90">
                <Upload className="h-4 w-4" /> Upload New
              </Link>
            )}
            <a href="tel:+919666930275"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted">
              <Phone className="h-4 w-4" /> Call Pharmacist
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Profile Page ─────────────────────────────────────────
export const CustomerProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [tab, setTab] = useState<"profile" | "prescriptions">("profile");

  useEffect(() => {
    if (user) {
      prescriptionService.getByUserId(user.id)
        .then(setPrescriptions)
        .catch(err => console.error("Failed to load user prescriptions:", err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/");
  };

  if (!user) return null;

  const TABS = [
    { key: "profile",       label: "Profile" },
    { key: "prescriptions", label: `Prescriptions (${prescriptions.length})` },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-white font-bold text-xl shadow-card shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium text-destructive border-destructive/30 hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="rounded-2xl border bg-card shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Account Details</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: User,  label: "Full Name",  value: user.name },
              { icon: Mail,  label: "Email",      value: user.email },
              { icon: Phone, label: "Phone",      value: user.phone || "Not provided" },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border">
                <row.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="font-medium text-foreground mt-0.5">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 flex gap-3 flex-wrap border-t">
            <Link to="/prescription"
              className="inline-flex items-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-semibold hover:bg-primary/20 transition-colors">
              <FileText className="h-4 w-4" /> Upload Prescription
            </Link>
            <Link to="/prescription-status"
              className="inline-flex items-center gap-2 rounded-xl bg-success/10 text-success px-4 py-2 text-sm font-semibold hover:bg-success/20 transition-colors">
              <CheckCircle className="h-4 w-4" /> Prescription Status
            </Link>
            <Link to="/feedback"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
              Give Feedback
            </Link>
          </div>
        </div>
      )}

      {/* Prescriptions tab */}
      {tab === "prescriptions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {prescriptions.length === 0
                ? "No prescriptions submitted yet."
                : `${prescriptions.length} prescription${prescriptions.length > 1 ? "s" : ""}`}
            </p>
            <Link to="/prescription"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
              <FileText className="h-4 w-4" /> Upload New
            </Link>
          </div>
          {prescriptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">No prescriptions submitted</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                Upload a prescription and our pharmacist will review it within 30 minutes.
              </p>
              <Link to="/prescription"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
                Upload Prescription
              </Link>
            </div>
          ) : (
            prescriptions.map(rx => <PrescriptionCard key={rx.id} rx={rx} />)
          )}
        </div>
      )}
    </div>
  );
};
