import React, { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Cross, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const CustomerLogin: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: { pathname?: string } } | null;
  const from = state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const session = JSON.parse(localStorage.getItem("srinivasa_session") || "null");
      if (session?.role === "admin") {
        toast.success("Welcome back, Admin!");
        navigate("/admin/dashboard", { replace: true });
      } else {
        toast.success("Welcome back!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 w-full min-h-[60vh] justify-center">
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-md">
          <Cross className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Sign in to Sri Srinivasa Medicals</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="lemail">Email</label>
            <input
              id="lemail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground" htmlFor="lpw">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">Forgot?</Link>
            </div>
            <div className="relative mt-1.5">
              <input
                id="lpw"
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-xl border bg-card px-3 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Your password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">Create one</Link>
        </p>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Admin?{" "}
          <Link to="/admin/login" className="text-primary hover:underline">Admin login →</Link>
        </p>
      </div>
    </div>
  );
};
