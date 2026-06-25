import React from "react";
import { ShoppingBag, Phone, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * AdminOrders — kept in sidebar for future use.
 * Sri Srinivasa Medicals is a medicine availability / prescription site.
 * Online ordering is not yet enabled.
 */
export const AdminOrders: React.FC = () => (
  <div className="space-y-5 max-w-7xl mx-auto">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Orders</h1>
      <p className="text-sm text-muted-foreground">Online order management</p>
    </div>

    <div className="rounded-2xl border bg-background shadow-card overflow-hidden">
      <div className="py-20 px-6 text-center flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Online Ordering Not Yet Active</h2>
        <p className="mt-2 text-muted-foreground max-w-sm text-sm leading-relaxed">
          Sri Srinivasa Medicals is currently a medicine availability and prescription
          management platform. Online ordering will be enabled in a future update.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-md text-left">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <Phone className="h-4 w-4" />
            </div>
            <p className="font-semibold text-sm text-foreground">Phone Orders</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customers call +91 96669 30275 to place orders.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <FileText className="h-4 w-4" />
            </div>
            <p className="font-semibold text-sm text-foreground">Prescriptions</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review uploaded prescriptions from customers.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          <Link to="/admin/prescriptions"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
            View Prescriptions <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  </div>
);
