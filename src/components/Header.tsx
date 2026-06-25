import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Cross, Menu, X, User, LogOut, LayoutDashboard, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/");
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  const navLinks = [
    { to: "/products",           label: "Medicines" },
    { to: "/categories",         label: "Categories" },
    { to: "/online-delivery",    label: "Online Delivery", icon: Truck },
    { to: "/prescription",       label: "Prescription" },
    { to: "/prescription-status",label: "Rx Status" },
    { to: "/about",              label: "About" },
    { to: "/contact",            label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 h-16 gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold shrink-0"
          onClick={() => setMobileMenuOpen(false)}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-card shrink-0">
            <Cross className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base tracking-tight font-bold leading-tight hidden sm:block">
            Sri Srinivasa <span className="text-primary">Medicals</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.icon
                ? <span className="flex items-center gap-1">{link.label}</span>
                : link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors"
              >
                {user?.name.charAt(0).toUpperCase()}
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-11 z-20 w-52 rounded-2xl border bg-background shadow-elevated py-1">
                    <div className="px-4 py-2.5 border-b">
                      <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    {isAdmin ? (
                      <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-primary" /> Admin Panel
                      </Link>
                    ) : (
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <User className="h-4 w-4 text-primary" /> My Profile
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                Login
              </Link>
              <Link to="/register"
                className="inline-flex items-center rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
                Register
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t pt-2 mt-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/profile"}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAdmin ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {isAdmin ? "Admin Panel" : "My Profile"}
                </Link>
                <button onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register"
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-primary bg-primary/10"
                  onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
