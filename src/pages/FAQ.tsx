import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const faqData: FAQItem[] = [
    { 
      q: "Can I buy medicines directly from the website?", 
      a: "Currently, our website is designed to help you browse our catalogue and check medicine availability. To purchase, please visit our store in Hanuman Junction or call us to reserve your items for pickup." 
    },
    { 
      q: "Where is Sri Srinivasa Medicals located?", 
      a: "We are located at Hanuman Junction Main Rd, Appanaveedu, Tallamudi, AP 521105 (Eluru Road, Pasuvula Santha, Opp. Boypati Complex)." 
    },
    { 
      q: "What are your store timings?", 
      a: "Our physical store is open every day from 8:00 AM to 10:00 PM." 
    },
    { 
      q: "How do I know if a medicine is in stock?", 
      a: "You can search for the medicine on our website to see its availability status. For real-time confirmation or to reserve stock before you arrive, please call us at +91 96669 30275." 
    },
    { 
      q: "Are all the medicines and products genuine?", 
      a: "Absolutely. As a trusted neighbourhood pharmacy, all our medicines and products are 100% genuine and sourced directly from authorised distributors." 
    },
    { 
      q: "Do you have a pharmacist available for advice?", 
      a: "Yes! We have a qualified pharmacist on-site every day who can provide expert advice and guidance regarding your prescriptions and health." 
    },
    { 
      q: "Can I send my prescription online?", 
      a: "Yes, you can securely upload a photo or PDF of your doctor's prescription through our Upload Rx page. Our pharmacist will review it, and we will contact you to confirm availability for pickup." 
    },
    { 
      q: "What else do you sell besides medicines?", 
      a: "Along with ethical and generic medicines, we stock surgical items, personal care, baby care products, and various fancy store items." 
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
