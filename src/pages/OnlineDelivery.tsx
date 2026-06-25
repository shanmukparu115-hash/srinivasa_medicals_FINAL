import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, Bell, Phone, ArrowRight } from "lucide-react";

export const OnlineDelivery: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <section className="border-b bg-gradient-soft">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Online Delivery
        </h1>
        <p className="mt-2 text-muted-foreground">Sri Srinivasa Medicals</p>
      </div>
    </section>

    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg w-full text-center">

        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <Truck className="h-12 w-12" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-foreground">
          Online Delivery Service
        </h2>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-warning/15 border border-warning/30 px-4 py-1.5">
          <Clock className="h-4 w-4 text-warning" />
          <span className="text-sm font-semibold text-warning">Coming Soon</span>
        </div>

        <p className="mt-6 text-muted-foreground leading-relaxed text-base">
          We are working on providing online delivery services in the future.
          Stay tuned — doorstep delivery of medicines will be available soon.
        </p>

        {/* Info tiles */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          {[
            { icon: Truck,  title: "Home Delivery",   desc: "Medicines delivered to your doorstep" },
            { icon: Clock,  title: "Fast Dispatch",   desc: "Same-day dispatch for urgent orders" },
            { icon: Bell,   title: "Notifications",   desc: "We'll notify you when it's live" },
            { icon: Phone,  title: "Order by Phone",  desc: "Call us now to place an order" },
          ].map(item => (
            <div key={item.title}
              className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <p className="font-semibold text-foreground text-sm">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Call CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-hero text-white p-6">
          <p className="font-semibold text-base">Need medicines urgently?</p>
          <p className="text-white/80 text-sm mt-1 mb-4">
            Call us and we'll have your order ready for walk-in pickup.
          </p>
          <a href="tel:+919666930275"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-primary px-5 py-2.5 text-sm font-bold hover:bg-white/90 transition-colors">
            <Phone className="h-4 w-4" /> +91 96669 30275
          </a>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact"
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  </div>
);
