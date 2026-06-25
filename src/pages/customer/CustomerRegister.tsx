import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Cross, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const CustomerRegister: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (password !== confirmPw) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    try {
      await register(name, email, phone, password);
      toast.success("Account created! Welcome!");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Registration failed.");
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
        <h1 className="mt-4 text-center text-2xl font-bold text-foreground">Create your account</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Join Sri Srinivasa Medicals</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Full name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Phone</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative mt-1.5">
              <input type={showPw ? "text" : "password"} required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-xl border bg-card px-3 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Minimum 8 characters" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <input type="password" required minLength={8} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Repeat password" />
          </div>
          <button type="submit" disabled={loading}
            className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
