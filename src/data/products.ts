import {
  Pill, Package, Users, Scissors,
  HeartPulse, Baby, Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Product } from "../types";

export type { Product };

export interface Category {
  slug: string;
  name: string;
  desc: string;
  color: string;
  icon: LucideIcon;
  /** true = show numeric stock; false = show Available/Not Available */
  showStock: boolean;
}

/**
 * BUSINESS RULE:
 * showStock: true  → Ethical/Brand — display actual stock quantity
 * showStock: false → all others    — display Available / Not Available
 */
export const CATEGORIES: Category[] = [
  {
    slug: "ethical-brand",
    name: "Ethical / Brand",
    icon: Pill,
    color: "from-blue-600 to-blue-700",
    desc: "Brand-name prescription medicines",
    showStock: true,
  },
  {
    slug: "generic",
    name: "Generic",
    icon: Package,
    color: "from-cyan-500 to-blue-500",
    desc: "Generic formulations",
    showStock: false,
  },
  {
    slug: "paediatric",
    name: "Paediatric",
    icon: Baby,
    color: "from-pink-400 to-rose-500",
    desc: "Medicines for children",
    showStock: false,
  },
  {
    slug: "paediatrician",
    name: "Paediatrician",
    icon: Users,
    color: "from-purple-500 to-indigo-500",
    desc: "Paediatrician-prescribed products",
    showStock: false,
  },
  {
    slug: "surgical",
    name: "Surgical",
    icon: Scissors,
    color: "from-slate-500 to-slate-700",
    desc: "Surgical instruments & supplies",
    showStock: false,
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    icon: HeartPulse,
    color: "from-teal-500 to-cyan-500",
    desc: "Everyday hygiene & wellness",
    showStock: false,
  },
  {
    slug: "baby-care",
    name: "Baby Care",
    icon: Stethoscope,
    color: "from-orange-400 to-amber-500",
    desc: "Baby health & care products",
    showStock: false,
  },
];

/** Lookup category metadata by slug */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

// Products managed via productService + localStorage
export const PRODUCTS: Product[] = [];
