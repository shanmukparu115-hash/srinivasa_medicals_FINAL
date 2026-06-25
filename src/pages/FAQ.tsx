import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const faqData: FAQItem[] = [
    { 
      q: "How do I order prescription medicines?", 
      a: "Upload a clear photo or PDF of your doctor's prescription on the Upload Rx page. Our licensed pharmacist will call you within 30 minutes to verify and confirm pricing." 
    },
    { 
      q: "Are all medicines genuine?", 
      a: "Yes. We source only from authorised distributors and store every batch with full traceability to the manufacturer. Cold-chain items are shipped with temperature monitoring." 
    },
    { 
      q: "What are your delivery timelines?", 
      a: "Same-day dispatch in 35+ cities for orders placed before 6pm. Most metro deliveries arrive within 4–6 hours. Other locations are next-day or 2-day." 
    },
    { 
      q: "Is there a minimum order value?", 
      a: "No minimum order. Delivery is free above ₹499; otherwise a flat ₹49 fee applies." 
    },
    { 
      q: "Can I return medicines?", 
      a: "Unopened, non-temperature-sensitive items can be returned within 7 days. For prescription items, returns are accepted only in case of pharmacist error or damaged packaging." 
    },
    { 
      q: "Do you accept insurance?", 
      a: "We accept reimbursement claims with itemised invoices. Direct insurer settlement is not yet supported." 
    },
    { 
      q: "How do I track my order?", 
      a: "Use the order ID from your confirmation email on the Track Order page, or check your dashboard if you have an account." 
    },
    { 
      q: "Is my prescription data secure?", 
      a: "Absolutely. Uploads are encrypted in transit and at rest, and viewed only by licensed pharmacists handling your order." 
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <section className="border-b bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
            Frequently asked questions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Everything you need to know about ordering with Sri Srinivasa Medicals & Fancy Store.
          </p>
        </div>
      </section>

      {/* Accordion List */}
      <div className="mx-auto max-w-3xl px-4 py-12 w-full">
        <div className="divide-y border-y">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between text-left font-medium text-foreground py-2 hover:text-primary transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{item.q}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`} 
                  />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
