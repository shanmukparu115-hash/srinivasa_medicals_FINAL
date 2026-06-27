// ============================================================
// productService.ts — Product CRUD consuming Node.js / MySQL API
// ============================================================
import type { Product } from "../types";
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

export const productService = {
  async search(params: { q?: string; category?: string; page?: number; limit?: number }): Promise<{ products: Product[], total: number, page: number, totalPages: number }> {
    const url = new URL(`${API_BASE}/api/products`, window.location.origin);
    if (params.q) url.searchParams.append("search", params.q);
    if (params.category) url.searchParams.append("category", params.category);
    if (params.page) url.searchParams.append("page", params.page.toString());
    if (params.limit) url.searchParams.append("limit", params.limit.toString());

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to search products.");
    const data = await res.json();
    data.products = data.products.map((p: Product) => ({ ...p, imageDataUrl: p.imageDataUrl?.startsWith('/media/') ? `${API_BASE}${p.imageDataUrl}` : p.imageDataUrl }));
    return data;
  },

  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products.");
    const products: Product[] = await res.json();
    return products.map(p => ({ ...p, imageDataUrl: p.imageDataUrl?.startsWith('/media/') ? `${API_BASE}${p.imageDataUrl}` : p.imageDataUrl }));
  },

  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    if (!res.ok) throw new Error("Product not found.");
    const product: Product = await res.json();
    if (product.imageDataUrl?.startsWith('/media/')) {
      product.imageDataUrl = `${API_BASE}${product.imageDataUrl}`;
    }
    return product;
  },

  async add(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const payload = {
      ...data,
      imageDataUrl: data.imageSourceType === "URL" ? data.imageDataUrl : null,
    };

    const res = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add product.");
    }

    const product: Product = await res.json();
    if (product.imageDataUrl?.startsWith('/media/')) {
      product.imageDataUrl = `${API_BASE}${product.imageDataUrl}`;
    }

    if (data.imageSourceType === "UPLOAD" && data.imageDataUrl && data.imageDataUrl.startsWith("data:")) {
      try {
        const file = dataURLtoFile(data.imageDataUrl, "product-image.jpg");
        const formData = new FormData();
        formData.append("image", file);

        const imgRes = await fetch(`${API_BASE}/api/products/${product.id}/image`, {
          method: "POST",
          body: formData,
        });

        if (imgRes.ok) {
          const imgData = await imgRes.json();
          product.imageDataUrl = imgData.imageUrl?.startsWith('/media/') ? `${API_BASE}${imgData.imageUrl}` : imgData.imageUrl;
          product.imageSourceType = "UPLOAD";
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("Failed to upload product image:", msg);
      }
    }

    return product;
  },

  async update(id: string, data: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> {
    const payload = {
      ...data,
      imageDataUrl: data.imageSourceType === "URL" ? data.imageDataUrl : undefined,
    };

    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update product.");
    }

    const product: Product = await res.json();
    if (product.imageDataUrl?.startsWith('/media/')) {
      product.imageDataUrl = `${API_BASE}${product.imageDataUrl}`;
    }

    if (data.imageSourceType === "UPLOAD" && data.imageDataUrl && data.imageDataUrl.startsWith("data:")) {
      const file = dataURLtoFile(data.imageDataUrl, "product-image.jpg");
      const formData = new FormData();
      formData.append("image", file);

      const imgRes = await fetch(`${API_BASE}/api/products/${id}/image`, {
        method: "POST",
        body: formData,
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        product.imageDataUrl = imgData.imageUrl?.startsWith('/media/') ? `${API_BASE}${imgData.imageUrl}` : imgData.imageUrl;
        product.imageSourceType = "UPLOAD";
      }
    } else if (data.imageDataUrl === null) {
      await fetch(`${API_BASE}/api/products/${id}/image`, { method: "DELETE" });
      product.imageDataUrl = null;
      product.imageSourceType = null;
    }

    return product;
  },

  async updateImage(productId: string, imageDataUrl: string | null, imageSourceType: "UPLOAD" | "URL" | null = null): Promise<void> {
    if (imageSourceType === "URL" || !imageDataUrl) {
      await this.update(productId, { imageDataUrl, imageSourceType });
    } else if (imageSourceType === "UPLOAD" && imageDataUrl.startsWith("data:")) {
      const file = dataURLtoFile(imageDataUrl, "product-image.jpg");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE}/api/products/${productId}/image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image.");
    }
  },

  async removeImage(productId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/products/${productId}/image`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to remove image.");
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product.");
  },

  getLowStock(products: Product[], threshold = 10): Product[] {
    return products.filter(
      p => p.category === "ethical-brand" &&
           p.stockQuantity !== null &&
           p.stockQuantity !== undefined &&
           p.stockQuantity <= threshold &&
           p.stockQuantity >= 0
    );
  },

  getMissingImages(products: Product[]): Product[] {
    return products.filter(p => !p.imageDataUrl);
  },
};
