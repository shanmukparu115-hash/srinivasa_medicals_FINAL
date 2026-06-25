import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Cross, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Empty by default — credentials never pre-filled or shown
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (isAuthenticated && isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      const session = JSON.parse(localStorage.getItem("srinivasa_session") || "null");
      if (session?.role !== "admin") {
        logout();
        setAttempts(a => a + 1);
        toast.error("Access denied. Invalid credentials.");
        setPassword("");
        return;
      }
      toast.success("Welcome, Admin!");
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setAttempts(a => a + 1);
      // Generic error — never reveal whether email or password was wrong
      toast.error("Invalid credentials. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border bg-background p-8 shadow-elevated">

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-md mb-3">
              <Cross className="h-6 w-6" />
            </span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Sri Srinivasa Medicals</p>
          </div>

          {/* Too many attempts warning */}
          {attempts >= 3 && (
            <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/25 px-3 py-2.5">
              <p className="text-xs text-destructive font-medium text-center">
                Multiple failed attempts. Please verify your credentials.
              </p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="admin-email">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="admin-password">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex h-10 w-full rounded-xl border bg-card px-3 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Store
            </Link>
          </div>
        </div>

        {/* Security note — no credentials shown */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          This is a restricted area. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
};
