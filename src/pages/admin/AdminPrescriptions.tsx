import React, { useState, useMemo, useEffect } from "react";
import {
  Search, Check, X, FileText, ChevronDown,
  Download, Eye, File, Trash2, ZoomIn, ZoomOut, RotateCw,
} from "lucide-react";
import { prescriptionService } from "../../services/prescriptionService";
import type { PrescriptionRecord, PrescriptionFile, PrescriptionStatus } from "../../types";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<PrescriptionStatus, string> = {
  Pending:  "bg-warning/15 text-warning border-warning/30",
  Approved: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

// ── Trigger browser download from base64 ─────────────────────
function triggerDownload(file: PrescriptionFile) {
  const link = document.createElement("a");
  link.href = file.dataUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ── Full-screen viewer — handles BOTH images and PDFs ─────────
const FileViewer: React.FC<{ file: PrescriptionFile; onClose: () => void }> = ({ file, onClose }) => {
  const isPdf = file.type === "application/pdf";
  const [imgScale, setImgScale] = useState(1);
  const [imgRotate, setImgRotate] = useState(0);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black/95">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/80 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          {isPdf
            ? <File className="h-5 w-5 text-red-400" />
            : <Eye className="h-5 w-5 text-blue-400" />}
          <span className="text-white font-medium text-sm truncate max-w-[220px]">{file.name}</span>
          <span className="text-xs text-white/50">({(file.size / 1024).toFixed(0)} KB)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Image controls */}
          {!isPdf && (
            <>
              <button onClick={() => setImgScale(s => Math.max(0.5, s - 0.25))}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-white/70 text-xs w-10 text-center">{Math.round(imgScale * 100)}%</span>
              <button onClick={() => setImgScale(s => Math.min(4, s + 0.25))}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button onClick={() => setImgRotate(r => (r + 90) % 360)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Rotate">
                <RotateCw className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => triggerDownload(file)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" /> Download
          </button>
          <button onClick={onClose}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
            <X className="h-4 w-4" /> Close
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isPdf ? (
          /* PDF rendered inline using iframe with base64 src */
          <div className="w-full h-full flex flex-col items-center">
            <iframe
              src={file.dataUrl}
              title={file.name}
              className="w-full max-w-4xl rounded-lg shadow-2xl bg-white"
              style={{ height: "calc(100vh - 120px)", minHeight: "500px" }}
            />
          </div>
        ) : (
          /* Image viewer with zoom/rotate */
          <div
            className="overflow-auto flex items-center justify-center"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            <img
              src={file.dataUrl}
              alt={file.name}
              className="rounded-lg shadow-2xl transition-transform duration-200 select-none"
              style={{
                transform: `scale(${imgScale}) rotate(${imgRotate}deg)`,
                transformOrigin: "center",
                maxWidth: imgScale > 1 ? "none" : "100%",
              }}
              draggable={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ── Thumbnail card ────────────────────────────────────────────
const FileThumb: React.FC<{ file: PrescriptionFile; onView: () => void }> = ({ file, onView }) => {
  const isPdf = file.type === "application/pdf";

  return (
    <div className="group relative flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all w-32">
      {/* Preview */}
      <div
        onClick={onView}
        className="relative w-full h-24 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {isPdf ? (
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <File className="h-6 w-6 text-red-500" />
            </div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">PDF</span>
          </div>
        ) : (
          <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
          <Eye className="h-6 w-6 text-white" />
          <span className="text-white text-[10px] font-semibold">
            {isPdf ? "View PDF" : "View Image"}
          </span>
        </div>
      </div>

      {/* Info + download */}
      <div className="px-2 pt-1.5 pb-2">
        <p className="text-[10px] font-medium text-foreground truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
          <button
            onClick={() => triggerDownload(file)}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Download"
          >
            <Download className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
export const AdminPrescriptions: React.FC = () => {
  const [records, setRecords] = useState<PrescriptionRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | "">("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [viewerFile, setViewerFile] = useState<PrescriptionFile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await prescriptionService.getAll();
      setRecords(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to load prescriptions.");
    }
  };
  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = records;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    }
    if (statusFilter) list = list.filter(r => r.status === statusFilter);
    return list;
  }, [records, search, statusFilter]);

  const handleUpdateStatus = async (id: string, status: PrescriptionStatus) => {
    try {
      await prescriptionService.updateStatus(id, status, adminNotes[id]);
      toast.success(`Prescription ${status.toLowerCase()}.`);
      await load();
      setExpandedId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await prescriptionService.delete(id);
      toast.success("Prescription deleted.");
      setDeleteConfirm(null);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to delete prescription.");
    }
  };

  const pendingCount = records.filter(r => r.status === "Pending").length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Full-screen file viewer */}
      {viewerFile && (
        <FileViewer file={viewerFile} onClose={() => setViewerFile(null)} />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
        <p className="text-sm text-muted-foreground">
          {pendingCount} pending · {records.length} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or Rx ID…"
            className="pl-9 h-10 w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as PrescriptionStatus | "")}
          className="h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* List */}
      <div className="rounded-2xl border bg-background shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">No prescriptions found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search || statusFilter
                ? "Try adjusting your filters."
                : "Customer prescriptions will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(rx => (
              <div key={rx.id}>
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === rx.id ? null : rx.id)}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {rx.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{rx.name}</p>
                      <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {rx.id}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      📞 {rx.phone} &nbsp;·&nbsp;
                      {new Date(rx.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                      &nbsp;·&nbsp;
                      {rx.files.length} file{rx.files.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[rx.status]}`}>
                    {rx.status}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${expandedId === rx.id ? "rotate-180" : ""}`} />
                </div>

                {/* Expanded */}
                {expandedId === rx.id && (
                  <div className="border-t bg-muted/10 px-6 py-5 space-y-5">

                    {/* ── Files ── */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Uploaded Files ({rx.files.length})
                        </p>
                        {rx.files.length > 1 && (
                          <button
                            onClick={() => rx.files.forEach(triggerDownload)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" /> Download All
                          </button>
                        )}
                      </div>

                      {rx.files.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No files uploaded.</p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {rx.files.map((file, idx) => (
                            <FileThumb
                              key={idx}
                              file={file}
                              onView={() => setViewerFile(file)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Helper text */}
                      <p className="mt-2 text-xs text-muted-foreground">
                        💡 Click any file to view it full-screen. PDFs open inline in the viewer.
                      </p>
                    </div>

                    {/* ── Notes ── */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Patient Notes
                        </p>
                        <div className="rounded-xl border bg-card px-4 py-3 text-sm text-foreground leading-relaxed min-h-[80px]">
                          {rx.notes || (
                            <span className="italic text-muted-foreground">No notes provided.</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Admin Notes
                        </p>
                        <textarea
                          rows={3}
                          value={adminNotes[rx.id] ?? rx.adminNotes ?? ""}
                          onChange={e => setAdminNotes(prev => ({ ...prev, [rx.id]: e.target.value }))}
                          placeholder="Internal notes (not shown to customer)…"
                          className="w-full rounded-xl border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center gap-3 flex-wrap pt-1 border-t">
                      {rx.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(rx.id, "Approved")}
                            className="flex items-center gap-2 rounded-xl bg-success text-success-foreground px-4 py-2 text-sm font-semibold hover:bg-success/90 transition-colors"
                          >
                            <Check className="h-4 w-4" /> Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(rx.id, "Rejected")}
                            className="flex items-center gap-2 rounded-xl bg-destructive text-destructive-foreground px-4 py-2 text-sm font-semibold hover:bg-destructive/90 transition-colors"
                          >
                            <X className="h-4 w-4" /> Reject
                          </button>
                        </>
                      )}
                      {rx.status !== "Pending" && (
                        <button
                          onClick={() => handleUpdateStatus(rx.id, "Pending")}
                          className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                        >
                          Reset to Pending
                        </button>
                      )}

                      {/* Delete */}
                      <div className="ml-auto">
                        {deleteConfirm === rx.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Delete permanently?</span>
                            <button
                              onClick={() => handleDelete(rx.id)}
                              className="rounded-lg bg-destructive text-destructive-foreground px-3 py-1.5 text-xs font-semibold hover:bg-destructive/90"
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(rx.id)}
                            className="flex items-center gap-1.5 rounded-xl border border-destructive/30 text-destructive px-3 py-2 text-xs font-semibold hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
