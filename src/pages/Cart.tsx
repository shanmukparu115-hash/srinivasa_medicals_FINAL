import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Phone } from "lucide-react";

/** Cart is disabled — this is a medicine availability site, not a shop. */
export const Cart: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
      <ShoppingCart className="h-10 w-10" />
    </div>
    <h1 className="text-2xl font-bold text-foreground">Online Ordering Coming Soon</h1>
    <p className="mt-2 text-muted-foreground max-w-sm">
      We're working on online ordering. For now, visit us in store or call to
      check availability and reserve your medicines.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row gap-3">
      <a href="tel:+919666930275"
        className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
        <Phone className="h-4 w-4" /> Call: +91 96669 30275
      </a>
      <Link to="/products"
        className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
        Browse Medicines <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);
