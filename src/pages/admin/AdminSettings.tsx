import React, { useState } from "react";
import { Save, Store, Phone, Mail, MapPin, RefreshCw, Database, KeyRound, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { seedService } from "../../services/seedService";
import toast from "react-hot-toast";

const InputCls = "mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";
const LabelCls = "text-sm font-medium text-foreground";

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();

  // Store info
  const [storeName, setStoreName] = useState("Sri Srinivasa Medicals & Fancy Store");
  const [phone,     setPhone]     = useState("9666930275");
  const [email,     setEmail]     = useState("Kumarsaikumar177@gmail.com");
  const [address,   setAddress]   = useState(
    "Hanuman Junction Main Rd, Hanuman Junction, Appanaveedu, Tallamudi, Andhra Pradesh 521105"
  );

  // Change password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPws,   setShowPws]   = useState(false);

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Store settings saved.");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error("New passwords do not match."); return; }
    if (newPw.length < 8)   { toast.error("Password must be at least 8 characters."); return; }
    try {
      await authService.changeAdminPassword(user?.email || "admin@srinivasa.com", currentPw, newPw);
      toast.success("Password updated successfully.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    }
  };

  const handleReseed = () => {
    if (!confirm("Reload the default product catalogue (40 products)? Your existing products will be replaced.")) return;
    seedService.forceSeed();
    toast.success("Product catalogue reloaded with 40 products.");
  };

  const pwInput = (id: string, label: string, val: string, set: (v: string) => void) => (
    <div>
      <label className={LabelCls} htmlFor={id}>{label}</label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={showPws ? "text" : "password"}
          required
          value={val}
          onChange={e => set(e.target.value)}
          autoComplete="off"
          className={`${InputCls} pr-10`}
        />
        <button type="button" onClick={() => setShowPws(!showPws)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {showPws ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage store configuration</p>
      </div>

      {/* Store Info */}
      <form onSubmit={handleSaveStore} className="rounded-2xl border bg-background shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" /> Store Information
        </h2>
        <div>
          <label className={LabelCls}>Store Name</label>
          <input value={storeName} onChange={e => setStoreName(e.target.value)} className={InputCls} />
        </div>
        <div>
          <label className={LabelCls}><span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Phone</span></label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className={InputCls} />
        </div>
        <div>
          <label className={LabelCls}><span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email</span></label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={InputCls} />
        </div>
        <div>
          <label className={LabelCls}><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Address</span></label>
          <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)}
            className="mt-1.5 w-full rounded-xl border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <button type="submit"
          className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </form>

      {/* Change Admin Password */}
      <form onSubmit={handleChangePassword} className="rounded-2xl border bg-background shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" /> Change Admin Password
        </h2>
        <p className="text-xs text-muted-foreground">
          Use a strong password with at least 8 characters. This change takes effect immediately.
        </p>
        {pwInput("cur-pw",  "Current Password", currentPw, setCurrentPw)}
        {pwInput("new-pw",  "New Password",     newPw,     setNewPw)}
        {pwInput("conf-pw", "Confirm New Password", confirmPw, setConfirmPw)}
        <button type="submit"
          className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
          <KeyRound className="h-4 w-4" /> Update Password
        </button>
      </form>

      {/* Admin Account Info */}
      <div className="rounded-2xl border bg-background shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Admin Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">{user?.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Role</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold uppercase">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Reload Product Catalogue */}
      <div className="rounded-2xl border bg-background shadow-card p-6">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-2">
          <Database className="h-4 w-4 text-primary" /> Product Catalogue
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Reload the default catalogue of 40 pre-loaded products with real product images.
        </p>
        <button type="button" onClick={handleReseed}
          className="flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 text-warning px-5 py-2.5 text-sm font-semibold hover:bg-warning/20 transition-colors">
          <RefreshCw className="h-4 w-4" /> Reload Default Catalogue (40 Products)
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          ⚠ This replaces all existing products.
        </p>
      </div>
    </div>
  );
};
