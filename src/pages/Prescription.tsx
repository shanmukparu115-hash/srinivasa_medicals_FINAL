import React, { useState, useRef } from "react";
import { CloudUpload, Trash2, Phone, CheckCircle, Image, File } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import type { PrescriptionFile } from "../types";

export const Prescription: React.FC = () => {
  const { uploadPrescription } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<PrescriptionFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  /** Convert a File object to a base64 dataUrl */
  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    const incoming: File[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.size > MAX_SIZE) { toast.error(`${file.name} exceeds 10 MB.`); return; }
      if (!allowed.includes(file.type)) { toast.error(`${file.name}: only JPG, PNG or PDF allowed.`); return; }
      incoming.push(file);
    });

    if (files.length + incoming.length > 5) {
      toast.error("Maximum 5 files allowed.");
      incoming.splice(5 - files.length);
    }

    setLoading(true);
    try {
      const converted = await Promise.all(
        incoming.map(async (f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          dataUrl: await readFileAsDataUrl(f),
        } as PrescriptionFile))
      );
      setFiles((prev) => [...prev, ...converted]);
    } catch {
      toast.error("Failed to read files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) { toast.error("Please upload at least one file."); return; }
    if (!name || !phone) { toast.error("Please fill in your name and phone number."); return; }

    setLoading(true);
    try {
      await uploadPrescription(name, phone, notes, files);
      toast.success("Prescription submitted! We'll call you within 30 minutes.");
      setFiles([]);
      setName("");
      setPhone("");
      setNotes("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to upload prescription.");
    } finally {
      setLoading(false);
    }
  };

  const FileIcon = ({ type }: { type: string }) =>
    type === "application/pdf"
      ? <File className="h-5 w-5 text-red-500 shrink-0" />
      : <Image className="h-5 w-5 text-primary shrink-0" />;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <section className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Upload your prescription</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Send a photo or PDF and our licensed pharmacist will call you within 30 minutes to confirm availability and pricing.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_360px] w-full">
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
              dragActive ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${dragActive ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
              <CloudUpload className="h-7 w-7" />
            </div>
            <p className="mt-4 font-semibold text-foreground">
              {loading ? "Reading files…" : "Drag & drop or click to upload"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">JPG, PNG or PDF · up to 10 MB · max 5 files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* File list with preview thumbnails */}
          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li key={idx} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
                  {/* Thumbnail for images, icon for PDFs */}
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="h-10 w-10 rounded-lg object-cover border shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg border bg-red-50 flex items-center justify-center shrink-0">
                      <FileIcon type={file.type} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · {file.type === "application/pdf" ? "PDF" : "Image"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Details */}
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="rxname">Full name *</label>
                <input id="rxname" type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="rxphone">Phone *</label>
                <input id="rxphone" type="tel" required value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground" htmlFor="rxnotes">Notes for pharmacist</label>
                <textarea id="rxnotes" rows={3} value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Preferred brand, allergies, delivery time…"
                  className="mt-1.5 flex w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={files.length === 0 || loading}
            className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading ? "Processing files…" : "Submit Prescription"}
          </button>
        </form>

        {/* Right Side */}
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="font-semibold text-foreground">What happens next?</h3>
            <ol className="mt-4 space-y-4 text-sm">
              {[
                { title: "Pharmacist reviews", desc: "Our team reviews your prescription for accuracy." },
                { title: "We call you", desc: "We contact you within 30 minutes to confirm and take payment." },
                { title: "Same-day delivery", desc: "Same-day dispatch, or collect from our store." }
              ].map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border bg-gradient-hero p-6 text-white shadow-card">
            <h3 className="font-semibold">Need urgent help?</h3>
            <p className="mt-2 text-sm text-white/90">Call our helpline for chronic medication refills and emergencies.</p>
            <a href="tel:+919666930275" className="mt-4 inline-flex items-center gap-2 font-semibold hover:text-white/85 transition-colors">
              <Phone className="h-4 w-4" /> +91 96669 30275
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};
