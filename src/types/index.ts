// ============================================================
// Sri Srinivasa Medicals — Central Type Definitions
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "admin";
  isActive: boolean;
  createdAt: string;
}

/**
 * CATEGORY RULES:
 * - "ethical-brand" → uses stockQuantity (number), availability ignored
 * - all others      → uses availabilityStatus ("available"|"not-available"), stock ignored
 */
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;           // slug from CATEGORIES
  description: string;
  manufacturer: string;
  /** Price in Indian Rupees (₹). null = price not set / on request. */
  price: number | null;
  /** MRP (Maximum Retail Price) — if set, shows a strikethrough "was" price. */
  mrp: number | null;

  /**
   * Product image value — one of:
   *   • base64 dataUrl  (admin uploaded from device)
   *   • https:// URL    (admin pasted URL / pre-seeded)
   * null = no image yet → show "No Image Available" placeholder.
   * NEVER shared between products — each belongs to this product only.
   */
  imageDataUrl: string | null;
  /**
   * How the image was set:
   *   "UPLOAD" = dragged/browsed from device (base64)
   *   "URL"    = pasted image URL
   *   null     = no image
   */
  imageSourceType: "UPLOAD" | "URL" | null;
  // Ethical/Brand only
  stockQuantity: number | null;
  // All other categories
  availabilityStatus: "available" | "not-available" | null;
  createdAt: string;
  updatedAt: string;
}

/** Is this category the "Ethical / Brand" type? */
export function isEthicalBrand(category: string): boolean {
  return category === "ethical-brand";
}

// ── Prescription ─────────────────────────────────────────────
export type PrescriptionStatus = "Pending" | "Approved" | "Rejected";

export interface PrescriptionFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface PrescriptionRecord {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  notes: string;
  files: PrescriptionFile[];
  status: PrescriptionStatus;
  adminNotes?: string;
  createdAt: string;
}

// ── Feedback ─────────────────────────────────────────────────
export interface Feedback {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  createdAt: string;
}

// Legacy stubs kept so existing order/cart pages don't break at import level
export interface CartItem {
  product: Product;
  qty: number;
}

export type OrderStatus = "Pending" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";

export interface ContactDetails { name: string; phone: string; email: string; }
export interface AddressDetails { addr: string; city: string; state: string; pin: string; }

export interface Order {
  id: string;
  userId?: string;
  contact: ContactDetails;
  address: AddressDetails;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
