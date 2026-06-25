import React from "react";
import { Target, Compass, Award } from "lucide-react";

export const About: React.FC = () => {
  const storyTimeline = [
    {
      year: "2014",
      title: "Founded",
      desc: "Sri Srinivasa Medicals & Fancy Store opened its doors at Hanuman Junction, Eluru Road — with a commitment to serving the local community."
    },
    {
      year: "2019",
      title: "Growing trust",
      desc: "Expanded our product range to include fancy goods, personal care, baby care and medical equipment alongside our core medicines."
    },
    {
      year: "2026",
      title: "Online presence",
      desc: "Launched digital ordering so our loyal customers can shop conveniently, with the same trusted service they've always known."
    }

  ];

  const certifications = [
    { title: "Drug License", desc: "AP-RP-2010-7731" },
    { title: "GST Registered", desc: "Compliant business" },
    { title: "Genuine Products", desc: "Authorised distributors" },
    { title: "FSSAI Approved", desc: "Nutrition & supplements" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <section className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Us</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl text-foreground">
            Sri Srinivasa Medicals & Fancy Store
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Your neighbourhood pharmacy and fancy store at Hanuman Junction, Eluru Road, Pasuvula Santha.
            We've been serving families in our community with genuine medicines, personal care products,
            and fancy goods — with honesty and care.
          </p>
        </div>
      </section>

      {/* Owner Info */}
      <section className="mx-auto max-w-7xl px-4 py-16 w-full">
        <div className="rounded-2xl border bg-card p-8 shadow-card">
          <h2 className="text-2xl font-bold text-foreground mb-6">Store Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store Name</p>
                <p className="mt-1 text-foreground font-semibold text-lg">Sri Srinivasa Medicals & Fancy Store</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</p>
                <p className="mt-1 text-foreground leading-relaxed">
                  Hanuman Junction, Eluru Road,<br />
                  Pasuvula Santha,<br />
                  Opp. Boypati Complex, Ground Floor
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mobile</p>
                <a href="tel:+919666930275" className="mt-1 text-foreground font-semibold text-lg hover:text-primary transition-colors block">
                  +91 96669 30275
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                <a href="mailto:Kumarsaikumar177@gmail.com" className="mt-1 text-foreground font-semibold hover:text-primary transition-colors block break-all">
                  Kumarsaikumar177@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hours</p>
                <p className="mt-1 text-foreground">Monday – Sunday · 8:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 pb-16 w-full">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8 shadow-card flex flex-col items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Our mission</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              To provide genuine, affordable medicines and quality fancy products to every family in our community — with warmth and personal service.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-8 shadow-card flex flex-col items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Our vision</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              A trusted store where every customer is treated like family — delivering quality, authenticity and a smile with every purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 w-full">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Our story</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {storyTimeline.map((item) => (
              <div key={item.year} className="rounded-2xl border bg-card p-6 shadow-card flex flex-col">
                <p className="text-3xl font-bold text-primary">{item.year}</p>
                <h3 className="mt-3 font-semibold text-foreground text-lg">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mx-auto max-w-7xl px-4 py-16 w-full">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Certifications & licenses</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert) => (
            <div key={cert.title} className="rounded-2xl border bg-card p-6 shadow-card flex flex-col items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                <Award className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold text-foreground text-base">{cert.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{cert.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
