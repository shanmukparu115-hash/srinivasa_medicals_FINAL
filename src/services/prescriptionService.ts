// ============================================================
// prescriptionService.ts — Prescription management consuming Express API
// ============================================================
import type { PrescriptionRecord, PrescriptionStatus, PrescriptionFile } from "../types";
import { API_BASE } from "../lib/api";

// Helper to convert base64 dataURL to a File object for multer
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const prescriptionService = {
  async getAll(): Promise<PrescriptionRecord[]> {
    const res = await fetch(`${API_BASE}/api/prescriptions`);
    if (!res.ok) throw new Error("Failed to fetch prescriptions.");
    const records: PrescriptionRecord[] = await res.json();
    return records.map(r => ({
      ...r,
      files: r.files.map(f => ({
        ...f,
        dataUrl: f.dataUrl.startsWith('/media/') ? `${API_BASE}${f.dataUrl}` : f.dataUrl
      }))
    }));
  },

  async getByUserId(userId: string): Promise<PrescriptionRecord[]> {
    const res = await fetch(`${API_BASE}/api/prescriptions/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch prescriptions for user.");
    const records: PrescriptionRecord[] = await res.json();
    return records.map(r => ({
      ...r,
      files: r.files.map(f => ({
        ...f,
        dataUrl: f.dataUrl.startsWith('/media/') ? `${API_BASE}${f.dataUrl}` : f.dataUrl
      }))
    }));
  },

  async create(
    userId: string | undefined,
    name: string,
    phone: string,
    notes: string,
    files: PrescriptionFile[]
  ): Promise<PrescriptionRecord> {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("notes", notes);
    if (userId) {
      formData.append("userId", userId);
    }

    files.forEach((f) => {
      try {
        const fileObj = dataURLtoFile(f.dataUrl, f.name);
        formData.append("files", fileObj);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Could not convert file ${f.name} to binary:`, msg);
      }
    });

    const res = await fetch(`${API_BASE}/api/prescriptions`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit prescription.");
    }

    const record: PrescriptionRecord = await res.json();
    return {
      ...record,
      files: record.files.map(f => ({
        ...f,
        dataUrl: f.dataUrl.startsWith('/media/') ? `${API_BASE}${f.dataUrl}` : f.dataUrl
      }))
    };
  },

  async updateStatus(id: string, status: PrescriptionStatus, adminNotes?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/prescriptions/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update prescription status.");
    }
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/prescriptions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete prescription.");
  },
};
