import React from "react";
import { Link } from "react-router-dom";
import { Cross } from "lucide-react";

export const Footer: React.FC = () => (
  <footer className="border-t bg-background mt-auto">
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">

        {/* Brand */}
        <div className="space-y-4">
          <Link to="/home" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-card">
              <Cross className="h-5 w-5" />
            </span>
            <span className="text-base tracking-tight font-bold leading-tight">
              Sri Srinivasa <span className="text-primary">Medicals</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your trusted neighbourhood pharmacy at Hanuman Junction.
            Genuine medicines, surgical supplies &amp; personal care.
          </p>
        </div>

        {/* Browse */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            Browse
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/products",        label: "All Medicines" },
              { to: "/categories",      label: "Categories" },
              { to: "/online-delivery", label: "Online Delivery" },
              { to: "/prescription",    label: "Upload Prescription" },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to}
                  className="text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            Help
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/faq",                  label: "FAQ" },
              { to: "/contact",              label: "Contact Us" },
              { to: "/about",                label: "About" },
              { to: "/prescription-status",  label: "Rx Status" },
              { to: "/feedback",             label: "Feedback" },
              { to: "/login",                label: "Sign in" },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to}
                  className="text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            Reach us
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="leading-relaxed">
              Hanuman Junction Main Rd,<br />
              Appanaveedu, Tallamudi,<br />
              Andhra Pradesh 521105
            </li>
            <li>
              <a href="tel:+919666930275"
                className="hover:text-primary transition-colors font-medium">
                +91 96669 30275
              </a>
            </li>
            <li>
              <a href="mailto:Kumarsaikumar177@gmail.com"
                className="hover:text-primary transition-colors break-all">
                Kumarsaikumar177@gmail.com
              </a>
            </li>
            <li>Open daily · 8 AM – 10 PM</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t pt-8 text-center text-xs text-muted-foreground">
        <p>© 2025 Sri Srinivasa Medicals &amp; Fancy Store. All rights reserved.</p>
        <p className="mt-1">
          Hanuman Junction, Appanaveedu, Tallamudi, AP 521105 ·
          <a href="tel:+919666930275" className="ml-1 hover:text-primary">
            +91 96669 30275
          </a>
        </p>
      </div>
    </div>
  </footer>
);
