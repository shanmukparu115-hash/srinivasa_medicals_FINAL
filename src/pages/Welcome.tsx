import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Cross, MapPin, Phone, Clock, ShieldCheck, Package, Star } from "lucide-react";

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    else navigate("/products");
  };

  const features = [
    { icon: ShieldCheck, title: "Genuine Medicines",   desc: "100% authentic, sourced from authorised distributors" },
    { icon: Package,     title: "Wide Range",          desc: "Ethical, Generic, Surgical, Baby Care & more" },
    { icon: Star,        title: "Expert Guidance",     desc: "Qualified pharmacist on-site every day" },
    { icon: Clock,       title: "Open Daily",          desc: "8:00 AM – 10:00 PM, 365 days a year" },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col bg-background transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-4 py-1.5 text-sm font-semibold backdrop-blur mb-6">
            <Cross className="h-4 w-4" /> Sri Srinivasa Medicals
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Your Trusted<br />
            <span className="text-blue-200">Neighbourhood</span><br />
            Pharmacy
          </h1>

          <p className="mt-6 text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Serving the Hanuman Junction community with genuine medicines,
            surgical supplies, baby care and personal care products — with warmth and expertise.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch}
            className="mt-10 mx-auto max-w-xl flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-2xl">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search medicines, brands, products…"
                className="flex-1 bg-transparent text-foreground text-sm py-2 focus:outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
            <button type="submit"
              className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
              Search
            </button>
          </form>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary px-8 py-3 text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Enter Website →
            </button>
            <a href="tel:+919666930275"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 text-white px-8 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              <Phone className="h-4 w-4" /> Call Us
            </a>
          </div>

          {/* Location pill */}
          <div className="mt-8 inline-flex items-center gap-1.5 text-blue-200 text-xs">
            <MapPin className="h-3.5 w-3.5" />
            Hanuman Junction Main Rd, Appanaveedu, Tallamudi, AP 521105
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-foreground mb-8">Why choose us?</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {features.map(f => (
            <div key={f.title}
              className="flex flex-col items-center text-center p-5 rounded-2xl border bg-card shadow-card hover:shadow-elevated transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <f.icon className="h-6 w-6" />
              </div>
              <p className="font-semibold text-foreground text-sm">{f.title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories preview ───────────────────────────────── */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-foreground mb-2">We stock</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Browse our complete range of pharmaceutical and healthcare products
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Ethical / Brand", "Generic", "Paediatric", "Paediatrician",
              "Surgical", "Personal Care", "Baby Care",
            ].map(cat => (
              <span key={cat}
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                {cat}
              </span>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors shadow">
              Browse All Products →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer strip ─────────────────────────────────────── */}
      <footer className="border-t bg-background py-6 text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground text-sm mb-1">Sri Srinivasa Medicals</p>
        <p>JXPG+HR5, Hanuman Junction Main Rd, Appanaveedu, Tallamudi, AP 521105</p>
        <p className="mt-1">
          <a href="tel:+919666930275" className="text-primary hover:underline">+91 96669 30275</a>
          &nbsp;·&nbsp; Mon–Sun 8AM–10PM
        </p>
      </footer>
    </div>
  );
};
