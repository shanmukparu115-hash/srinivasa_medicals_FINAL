import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Cross } from "lucide-react";
import toast from "react-hot-toast";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("If an account exists, a reset link has been sent.");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 w-full min-h-[60vh] justify-center">
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-md">
          <Cross className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-foreground">Reset your password</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="femail">Email</label>
            <input 
              id="femail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          <button 
            type="submit"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-lg px-6 text-sm w-full"
          >
            Send reset link
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered it? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
