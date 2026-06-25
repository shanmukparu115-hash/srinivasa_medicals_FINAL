import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE } from "../lib/api";

/**
 * Exact shop location — extracted from Google Maps Street View URL:
 * https://www.google.com/maps/@16.6364842,80.9771309,...
 *
 * Name    : శ్రీనివాస మెడికల్స్ (Sri Srinivasa Medicals)
 * Plus Code: JXPG+HR5
 * Address : Hanuman Junction Main Rd, Hanuman Junction,
 *           Appanaveedu, Tallamudi, Andhra Pradesh 521105
 *
 * Coordinates: 16.6364842 N, 80.9771309 E
 */
const SHOP_LAT = 16.6364842;
const SHOP_LNG = 80.9771309;

// Google Maps embed — pinned to exact lat/lng from the URL
const GMAPS_EMBED =
  `https://maps.google.com/maps?q=${SHOP_LAT},${SHOP_LNG}&z=18&output=embed&hl=en`;

// Opens the exact pin on Google Maps
const GMAPS_OPEN =
  `https://www.google.com/maps?q=${SHOP_LAT},${SHOP_LNG}&z=18`;

// Turn-by-turn navigation to the exact pin
const GMAPS_DIR =
  `https://www.google.com/maps/dir/?api=1&destination=${SHOP_LAT},${SHOP_LNG}`;

export const Contact: React.FC = () => {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message.");
      }

      toast.success("Message sent! We'll reply shortly.");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Page Header */}
      <section className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
            Get in touch
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            We're here every day, 8 AM – 10 PM. Walk in or reach out — a real person will respond.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_420px] w-full">

        {/* LEFT — Contact form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 shadow-card h-fit">
          <h2 className="text-lg font-semibold text-foreground">Send us a message</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="cname">Name</label>
              <input id="cname" type="text" required value={name}
                onChange={e => setName(e.target.value)} placeholder="Your name"
                className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="cemail">Email</label>
              <input id="cemail" type="email" required value={email}
                onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="csubj">Subject</label>
              <input id="csubj" type="text" required value={subject}
                onChange={e => setSubject(e.target.value)} placeholder="How can we help?"
                className="mt-1.5 flex h-10 w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="cmsg">Message</label>
              <textarea id="cmsg" rows={6} required value={message}
                onChange={e => setMessage(e.target.value)} placeholder="Tell us more…"
                className="mt-1.5 flex w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground shadow hover:bg-primary/90 px-6 text-sm font-semibold mt-6 disabled:opacity-60 transition-colors">
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>

        {/* RIGHT — Info cards + map */}
        <aside className="space-y-4">

          {/* Address */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Visit us</p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  Hanuman Junction Main Rd,<br />
                  Hanuman Junction, Appanaveedu,<br />
                  Tallamudi, Andhra Pradesh 521105
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Plus Code: JXPG+HR5
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <a href={GMAPS_OPEN} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                    <ExternalLink className="h-3 w-3" /> View on Maps
                  </a>
                  <span className="text-muted-foreground/40">·</span>
                  <a href={GMAPS_DIR} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                    <Navigation className="h-3 w-3" /> Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Call us</p>
                <a href="tel:+919666930275"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium mt-0.5 block">
                  +91 96669 30275
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Email</p>
                <a href="mailto:Kumarsaikumar177@gmail.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors break-all mt-0.5 block">
                  Kumarsaikumar177@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Hours</p>
                <p className="text-sm text-muted-foreground mt-0.5">Mon – Sun · 8:00 AM – 10:00 PM</p>
                <span className="inline-block mt-1 text-xs font-semibold text-success bg-success/15 rounded-full px-2 py-0.5">
                  Open every day
                </span>
              </div>
            </div>
          </div>

          {/* Embedded Map — exact pin at 16.6364842, 80.9771309 */}
          <div className="rounded-2xl border shadow-card overflow-hidden">

            {/* Map toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  శ్రీనివాస మెడికల్స్
                </span>
              </div>
              <a href={GMAPS_DIR} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors">
                <Navigation className="h-3 w-3" /> Get Directions
              </a>
            </div>

            {/*
              Google Maps iframe — exact coordinates 16.6364842, 80.9771309
              Extracted directly from the Street View URL provided.
              zoom=18 = building-level view with pin clearly visible.
            */}
            <iframe
              title="శ్రీనివాస మెడికల్స్ — Hanuman Junction, Andhra Pradesh"
              src={GMAPS_EMBED}
              className="h-80 w-full border-0 block"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Address strip */}
            <div className="px-4 py-3 bg-card border-t">
              <p className="text-xs text-muted-foreground leading-relaxed">
                📍 JXPG+HR5, Hanuman Junction Main Rd,<br />
                Hanuman Junction, Appanaveedu,<br />
                Tallamudi, Andhra Pradesh 521105
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                16.6364842° N, 80.9771309° E
              </p>
              <div className="flex items-center gap-3 mt-2">
                <a href={GMAPS_OPEN} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                  <ExternalLink className="h-3 w-3" /> Open in Google Maps
                </a>
                <span className="text-muted-foreground/40">·</span>
                <a href={GMAPS_DIR} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                  <Navigation className="h-3 w-3" /> Navigate Here
                </a>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};
