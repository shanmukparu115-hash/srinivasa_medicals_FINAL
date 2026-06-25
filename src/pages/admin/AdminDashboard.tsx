import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package, Users, AlertTriangle, FileText,
  TrendingUp, ArrowRight, Clock, MessageSquare,
} from "lucide-react";
import { productService } from "../../services/productService";
import { authService } from "../../services/authService";
import { prescriptionService } from "../../services/prescriptionService";
import { feedbackService } from "../../services/feedbackService";

import type { Product, User, PrescriptionRecord, Feedback } from "../../types";

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [prescriptions, setPrescriptions] = React.useState<PrescriptionRecord[]>([]);
  const [feedback, setFeedback] = React.useState<Feedback[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [prods, custs, rxs, fbs] = await Promise.all([
          productService.getAll(),
          authService.getAllUsers(),
          prescriptionService.getAll(),
          feedbackService.getAll(),
        ]);
        setProducts(prods);
        setCustomers(custs);
        setPrescriptions(rxs);
        setFeedback(fbs);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const lowStock     = useMemo(() => productService.getLowStock(products), [products]);
  const avgRating    = useMemo(() => feedbackService.getAverageRating(feedback), [feedback]);
  const pendingRx    = useMemo(() => prescriptions.filter(r => r.status === "Pending").length, [prescriptions]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <span className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    { label: "Total Products",   value: products.length,     icon: Package,       color: "text-blue-600",   bg: "bg-blue-50",    link: "/admin/products" },
    { label: "Total Customers",  value: customers.length,    icon: Users,         color: "text-success",    bg: "bg-success/10", link: "/admin/customers" },
    { label: "Prescriptions",    value: prescriptions.length, icon: FileText,     color: "text-purple-600", bg: "bg-purple-50",  link: "/admin/prescriptions" },
    { label: "Pending Rx",       value: pendingRx,           icon: Clock,         color: "text-warning",    bg: "bg-warning/10", link: "/admin/prescriptions" },
    { label: "Feedback",         value: feedback.length,     icon: MessageSquare, color: "text-cyan-600",   bg: "bg-cyan-50",    link: "/admin/feedback" },
    { label: "Avg Rating",       value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "—",
      icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", link: "/admin/feedback" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sri Srinivasa Medicals & Fancy Store</p>
        </div>
        {pendingRx > 0 && (
          <Link to="/admin/prescriptions"
            className="inline-flex items-center gap-2 rounded-xl bg-warning/10 border border-warning/20 px-3 py-2 text-sm font-medium text-warning hover:bg-warning/20 transition-colors">
            <AlertTriangle className="h-4 w-4" />
            {pendingRx} prescription{pendingRx > 1 ? "s" : ""} pending review
          </Link>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map(k => (
          <Link key={k.label} to={k.link}
            className="rounded-2xl border bg-background p-5 shadow-card hover:shadow-elevated transition-shadow group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{k.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.bg}`}>
                <k.icon className={`h-5 w-5 ${k.color}`} />
              </span>
            </div>
            <p className={`mt-3 flex items-center gap-1 text-xs font-medium ${k.color}`}>
              View details <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Recent Prescriptions */}
        <div className="rounded-2xl border bg-background shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Recent Prescriptions
            </h2>
            <Link to="/admin/prescriptions"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {prescriptions.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No prescriptions submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    {["Rx ID", "Patient", "Date", "Status"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {prescriptions.slice(0, 8).map(rx => (
                    <tr key={rx.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-foreground">{rx.id}</td>
                      <td className="px-5 py-3 text-foreground">{rx.name}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">
                        {new Date(rx.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          rx.status === "Pending"  ? "bg-warning/15 text-warning"
                          : rx.status === "Approved" ? "bg-success/15 text-success"
                          : "bg-destructive/15 text-destructive"
                        }`}>
                          {rx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border bg-background shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock
            </h2>
            <Link to="/admin/products" className="text-xs text-primary font-medium hover:underline">
              Manage
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              All Ethical/Brand stock levels OK ✓
            </div>
          ) : (
            <ul className="divide-y">
              {lowStock.slice(0, 8).map(p => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3 gap-3">
                  <p className="text-sm text-foreground line-clamp-1 flex-1">{p.name}</p>
                  <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                    (p.stockQuantity ?? 0) <= 3
                      ? "bg-destructive/15 text-destructive"
                      : "bg-warning/15 text-warning"
                  }`}>
                    {p.stockQuantity ?? 0} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
