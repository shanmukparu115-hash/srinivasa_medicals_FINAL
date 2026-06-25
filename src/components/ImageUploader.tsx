/**
 * ImageUploader — Professional image management component
 *
 * Three methods to add a product image:
 *   1. Paste / type an image URL (https://...)
 *   2. Drag & drop an image file onto the drop zone
 *   3. Click "Browse" to pick a file from device
 *
 * Features:
 *   - URL validation (must load as valid image before saving)
 *   - Accepted formats: JPG, JPEG, PNG, WEBP
 *   - Max file size: 5 MB
 *   - Upload progress indicator
 *   - Image preview before saving
 *   - Replace / Remove controls
 *   - Broken image fallback
 *   - Stores imageSourceType: "URL" | "UPLOAD"
 *   - Fully responsive
 */
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Link2, Upload, FolderOpen, ZoomIn, X,
  CheckCircle, ImageOff, AlertCircle,
} from "lucide-react";

export interface ImageValue {
  dataUrl: string | null;
  sourceType: "URL" | "UPLOAD" | null;
}

interface ImageUploaderProps {
  value: ImageValue;
  onChange: (val: ImageValue) => void;
  productName?: string;
}

type Tab = "url" | "upload";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_MB   = 5;

// ── Helpers ───────────────────────────────────────────────────
function isValidImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function testImageUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload  = () => resolve();
    img.onerror = () => reject(new Error("Image could not be loaded from this URL."));
    img.src     = url;
  });
}

// ── Sub-components ─────────────────────────────────────────────

// Upload progress bar
const ProgressBar: React.FC<{ pct: number }> = ({ pct }) => (
  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
    <div
      className="h-full bg-primary rounded-full transition-all duration-200"
      style={{ width: `${pct}%` }}
    />
  </div>
);

// Lightbox overlay
const Lightbox: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/94 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <img
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          className="max-h-[85vh] w-full object-contain rounded-2xl shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/80 hover:text-white text-sm bg-white/10 rounded-lg px-3 py-1.5"
        >
          <X className="h-4 w-4" /> Close
        </button>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  productName = "product",
}) => {
  const inputRef             = useRef<HTMLInputElement>(null);
  const [tab, setTab]        = useState<Tab>("url");
  const [urlInput, setUrlInput] = useState(() =>
    value.dataUrl?.startsWith("http") ? value.dataUrl : ""
  );
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLoading, setUploadLoading]   = useState(false);
  const [fileError, setFileError]           = useState<string | null>(null);
  const [dragging, setDragging]             = useState(false);
  const [lightbox, setLightbox]             = useState(false);

  const hasImage = !!value.dataUrl;

  // ── Clear ────────────────────────────────────────────────────
  const handleRemove = () => {
    onChange({ dataUrl: null, sourceType: null });
    setUrlInput("");
    setUrlError(null);
    setFileError(null);
    setUploadProgress(0);
  };

  // ── URL method ───────────────────────────────────────────────
  const applyUrl = useCallback(async (url: string) => {
    const trimmed = url.trim();
    setUrlError(null);

    if (!trimmed) {
      setUrlError("Please enter an image URL.");
      return;
    }
    if (!isValidImageUrl(trimmed)) {
      setUrlError("URL must start with http:// or https://");
      return;
    }

    setUrlLoading(true);
    try {
      await testImageUrl(trimmed);
      onChange({ dataUrl: trimmed, sourceType: "URL" });
      setUrlError(null);
    } catch {
      setUrlError("Could not load image from this URL. Check the link and try again.");
    } finally {
      setUrlLoading(false);
    }
  }, [onChange]);

  const handleUrlApply = () => applyUrl(urlInput);
  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); applyUrl(urlInput); }
  };

  // ── File method ──────────────────────────────────────────────
  const processFile = useCallback((file: File) => {
    setFileError(null);
    setUploadProgress(0);

    if (!ACCEPTED.includes(file.type)) {
      setFileError("Unsupported format. Please use JPG, PNG or WEBP.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${MAX_MB} MB.`);
      return;
    }

    setUploadLoading(true);
    // Simulate progress
    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(pct + 20, 80);
      setUploadProgress(pct);
    }, 60);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(timer);
      setUploadProgress(100);
      setTimeout(() => {
        onChange({ dataUrl: reader.result as string, sourceType: "UPLOAD" });
        setUploadLoading(false);
        setUploadProgress(0);
      }, 300);
    };
    reader.onerror = () => {
      clearInterval(timer);
      setFileError("Failed to read file. Please try again.");
      setUploadLoading(false);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  // ── Drag & Drop ──────────────────────────────────────────────
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    // Dropped a file
    const file = e.dataTransfer.files[0];
    if (file) { setTab("upload"); processFile(file); return; }

    // Dropped a URL (e.g. dragged from browser)
    const text = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (text?.startsWith("http")) {
      setTab("url");
      setUrlInput(text);
      applyUrl(text);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  // ── Render: image is set ──────────────────────────────────────
  if (hasImage) {
    return (
      <div className="space-y-3">
        {lightbox && (
          <Lightbox
            src={value.dataUrl!}
            alt={productName}
            onClose={() => setLightbox(false)}
          />
        )}

        {/* Preview card */}
        <div className="relative group rounded-xl overflow-hidden border-2 border-success/50 bg-white shadow-sm">
          <img
            src={value.dataUrl!}
            alt={productName}
            crossOrigin="anonymous"
            className="w-full h-56 object-contain p-3"
            onError={handleRemove}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg bg-success text-white text-[10px] font-bold px-2 py-0.5 shadow">
              <CheckCircle className="h-2.5 w-2.5" /> Image set
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 text-white text-[10px] px-2 py-0.5">
              {value.sourceType === "URL" ? <Link2 className="h-2.5 w-2.5" /> : <FolderOpen className="h-2.5 w-2.5" />}
              {value.sourceType === "URL" ? "URL" : "Uploaded"}
            </span>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => setLightbox(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white text-foreground px-3 py-2 text-xs font-semibold hover:bg-white/90 shadow">
              <ZoomIn className="h-3.5 w-3.5" /> Preview
            </button>
            <button type="button" onClick={handleRemove}
              className="flex items-center gap-1.5 rounded-xl bg-destructive text-white px-3 py-2 text-xs font-semibold hover:bg-destructive/90 shadow">
              <X className="h-3.5 w-3.5" /> Remove & Change
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Hover to preview full-size or remove & replace with a different image.
        </p>
      </div>
    );
  }

  // ── Render: no image ──────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl bg-muted p-1">
        <button type="button" onClick={() => setTab("url")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
            tab === "url"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}>
          <Link2 className="h-3.5 w-3.5" /> Paste Image URL
        </button>
        <button type="button" onClick={() => setTab("upload")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
            tab === "upload"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}>
          <Upload className="h-3.5 w-3.5" /> Upload / Drag & Drop
        </button>
      </div>

      {/* ── TAB: URL ── */}
      {tab === "url" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Paste a direct link to the product image (JPG, PNG, WEBP).
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="url"
                value={urlInput}
                onChange={e => { setUrlInput(e.target.value); setUrlError(null); }}
                onKeyDown={handleUrlKeyDown}
                placeholder="https://example.com/medicine-image.jpg"
                className="pl-9 h-10 w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleUrlApply}
              disabled={urlLoading || !urlInput.trim()}
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              {urlLoading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading…
                </>
              ) : "Use URL"}
            </button>
          </div>

          {urlError && (
            <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/25 px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
              <p className="text-xs text-destructive">{urlError}</p>
            </div>
          )}

          {/* How-to guide */}
          <div className="rounded-xl bg-muted/50 border px-4 py-3 space-y-1.5">
            <p className="text-xs font-semibold text-foreground">How to get a product image URL:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-none">
              <li>1. Go to <strong>Google Images</strong> and search the exact product name</li>
              <li>2. Right-click any product image → <strong>"Copy image address"</strong></li>
              <li>3. Paste the URL above and click <strong>Use URL</strong></li>
            </ol>
            <p className="text-xs text-muted-foreground/70 pt-1 border-t">
              Or copy image links from: netmeds.com · 1mg.com · pharmeasy.in
            </p>
          </div>
        </div>
      )}

      {/* ── TAB: Upload / Drag & Drop ── */}
      {tab === "upload" && (
        <div className="space-y-3">

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploadLoading && inputRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all select-none ${
              dragging
                ? "border-primary bg-primary/8 scale-[1.01] shadow-md"
                : uploadLoading
                ? "border-primary/40 bg-primary/5 cursor-default"
                : "border-border hover:border-primary/60 hover:bg-muted/30"
            }`}
          >
            {uploadLoading ? (
              /* Upload progress */
              <div className="w-full max-w-xs space-y-3">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-foreground">Processing image…</p>
                <ProgressBar pct={uploadProgress} />
                <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
              </div>
            ) : dragging ? (
              /* Drag active state */
              <div className="pointer-events-none">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/15 border-2 border-primary border-dashed mb-3">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-bold text-primary">Release to upload!</p>
              </div>
            ) : (
              /* Default state */
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border mb-3">
                  <ImageOff className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Drag & drop an image here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">or</p>
                <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow hover:bg-primary/90 transition-colors">
                  <FolderOpen className="h-4 w-4" /> Browse from Device
                </span>
                <p className="mt-3 text-xs text-muted-foreground">
                  JPG · PNG · WEBP &nbsp;·&nbsp; Max {MAX_MB} MB
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  You can also drag an image from Google Images or any webpage directly here
                </p>
              </>
            )}
          </div>

          {fileError && (
            <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/25 px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
              <p className="text-xs text-destructive">{fileError}</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Accuracy warning */}
      <div className="flex items-start gap-2 rounded-xl bg-warning/10 border border-warning/25 px-3 py-2.5">
        <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Important:</strong> Upload the exact image of{" "}
          <strong className="text-foreground">this specific product only</strong>.
          Do not use a generic medicine photo or another product's image.
        </p>
      </div>
    </div>
  );
};
