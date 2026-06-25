import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cross, Search, ArrowRight, BadgeCheck, ShieldCheck,
  MapPin, Phone, MessageSquare, Star,
} from "lucide-react";
import { CATEGORIES } from "../data/products";
import { productService } from "../services/productService";
import { ProductCard } from "../components/ProductCard";
import { feedbackService } from "../services/feedbackService";
import type { Feedback, Product } from "../types";
import { useAuth } from "../context/AuthContext";

export const Home: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prods = await productService.getAll();
        setProducts(prods);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
      try {
        const allFb = await feedbackService.getAll();
        setRecentFeedback(allFb.filter(f => f.rating >= 4).slice(0, 3));
      } catch (err) {
        console.error("Failed to load feedback:", err);
      }
    };
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    else navigate("/products");
  };

  const features = [
    { icon: ShieldCheck, title: "100% Genuine",    desc: "Sourced from authorised distributors only." },
    { icon: MapPin,      title: "Hanuman Junction", desc: "Eluru Road, Pasuvula Santha, Opp. Boypati Complex." },
    { icon: BadgeCheck,  title: "Expert Advice",   desc: "Qualified pharmacist on-site every day." },
    { icon: Phone,       title: "Call Us Anytime", desc: "+91 96669 30275 · Open daily 8 AM – 10 PM." },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur mb-4">
              <Cross className="h-3.5 w-3.5" /> Trusted neighbourhood pharmacy
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Sri Srinivasa<br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Medicals & Fancy Store
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              Check medicine availability, browse our catalogue, and upload
              prescriptions — visit us at Hanuman Junction for same-day pickup.
            </p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                Hanuman Junction Main Rd, Appanaveedu, Tallamudi, AP 521105
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+919666930275" className="hover:text-primary transition-colors">
                  +91 96669 30275
                </a>
              </span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearchSubmit}
              className="mt-6 flex max-w-lg gap-2 rounded-xl border bg-background p-1.5 shadow-card">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex h-9 w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  placeholder="Search medicines, brands…"
                />
              </div>
              <button type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
                Search
              </button>
            </form>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Link to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                Browse Medicines <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-3xl bg-gradient-hero shadow-2xl">
              <Cross className="h-32 w-32 text-white opacity-90" />
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-background border shadow-card px-4 py-3">
                <p className="text-xs text-muted-foreground">Open Today</p>
                <p className="font-bold text-foreground text-sm">8:00 AM – 10:00 PM</p>
              </div>
              <div className="absolute -top-4 -left-4 rounded-2xl bg-background border shadow-card px-4 py-3">
                <p className="text-xs text-muted-foreground">Call us</p>
                <p className="font-bold text-primary text-sm">9666930275</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-14 w-full">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <div key={f.title}
              className="flex flex-col items-start rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Product Categories
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Browse by medicine type
              </p>
            </div>
            <Link to="/categories"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/products?cat=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border bg-card shadow-card hover:shadow-md transition-shadow"
              >
                <div className={`h-24 w-full bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="h-10 w-10 text-white" />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-foreground leading-tight">{cat.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                  <p className="text-xs text-primary mt-1 font-medium">
                    {cat.showStock ? "Shows stock quantity" : "Shows availability"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products section */}
      <section className="mx-auto max-w-7xl px-4 py-14 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Our Products
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              {products.length > 0
                ? `${products.length} products available — search and check availability`
                : "Search and check medicine availability"}
            </p>
          </div>
          <Link to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products.length > 8 && (
              <div className="mt-8 text-center">
                <Link to="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors shadow">
                  View All {products.length} Products <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Cross className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Products coming soon</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Our catalogue is being updated. Please call us directly.
            </p>
            {isAdmin ? (
              <Link to="/admin/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                Add Products (Admin)
              </Link>
            ) : (
              <a href="tel:+919666930275"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                📞 Call Us: 9666930275
              </a>
            )}
          </div>
        )}
      </section>

      {/* Customer Feedback */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                What customers say
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Real feedback from our customers
              </p>
            </div>
            <Link to="/feedback"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
              <MessageSquare className="h-4 w-4" /> Give Feedback
            </Link>
          </div>
          {recentFeedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card py-16 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-semibold text-foreground">No feedback yet</p>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                Be the first to share your experience!
              </p>
              <Link to="/feedback"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
                Write a Review
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {recentFeedback.map(fb => (
                <div key={fb.id} className="rounded-2xl border bg-card p-6 shadow-card flex flex-col">
                  <div className="flex gap-0.5 text-amber-400 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= fb.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    "{fb.message}"
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{fb.customerName}</p>
                      <p className="text-xs text-muted-foreground">{fb.category}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(fb.createdAt).toLocaleDateString("en-IN", {
                        month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/feedback"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Share your experience <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-gradient-hero text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Need help? Call us directly.</h2>
            <p className="mt-1 text-white/80 text-sm">
              Hanuman Junction, Appanaveedu, Tallamudi — Open 8 AM to 10 PM daily.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="tel:+919666930275"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-primary px-6 py-3 text-sm font-bold shadow hover:bg-white/90 transition-colors">
              <Phone className="h-4 w-4" /> +91 96669 30275
            </a>
            <Link to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              Send a message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
