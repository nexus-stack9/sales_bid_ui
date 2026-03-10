import Layout from "@/components/layout/Layout";
import React, { useRef, useEffect, useState } from "react";
import { RiAuctionFill } from "react-icons/ri";

const BTN_GRAD = "linear-gradient(to right, #FF6B3D, #FFB444)";
const DARK_BG  = "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)";

// ─── Scroll fade-in ──────────────────────────────────────────────────────────
interface FadeInProps { children: React.ReactNode; delay?: number; distance?: number; className?: string; }
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, distance = 14, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity 580ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 580ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`, willChange: "opacity,transform" }}>
      {children}
    </div>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────
const faqs = [
  { q: "How do I register to submit offers?",             a: "Click Sign Up, complete verification, and you can submit offers once approved.",                category: "Account"  },
  { q: "What payment methods are supported?",              a: "All major cards and bank transfer. Payment due within 48 hours.",                               category: "Payments" },
  { q: "Can I inspect items before submitting an offer?",  a: "Yes, through preview events or virtual tours prior to listings.",                               category: "Listings" },
  { q: "When will my order ship?",                        a: "Typically 1–3 business days after payment is received.",                                        category: "Shipping" },
  { q: "How do refunds work?",                            a: "Eligible returns are inspected, then refunds are processed in 3–5 business days.",              category: "Payments" },
];

// ─── Component ───────────────────────────────────────────────────────────────
const FAQ: React.FC = () => (
  <div className="bg-white text-gray-900">

    {/* ── DARK HERO BANNER ──────────────────────────────────────────────── */}
    <section className="relative overflow-hidden" style={{ background: DARK_BG }}>
      {/* Top hairline */}
      <div className="absolute top-0 inset-x-0 h-px opacity-30" style={{ background: BTN_GRAD }} />
      {/* Orb */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: BTN_GRAD }} />

      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-14 max-w-4xl relative z-10">
        <FadeIn>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-5 bg-white/20" />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/40">Support</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Frequently Asked{" "}
              <span style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Questions
              </span>
            </h1>
            <p className="text-white/40 text-sm max-w-xs sm:text-right leading-relaxed flex-shrink-0">
              Answers to common questions about offers, payments, and shipping.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>

    {/* ── FAQ LIST ──────────────────────────────────────────────────────── */}
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 70} distance={10}>
              <div className={`flex flex-col sm:flex-row gap-0 ${i < faqs.length - 1 ? "border-b border-gray-100" : ""}`}>

                {/* Left: number column */}
                <div className="sm:w-20 flex-shrink-0 flex sm:flex-col items-center sm:items-start pt-7 sm:pt-8 pb-2 sm:pb-8 pr-0 sm:pr-4">
                  <span
                    className="text-3xl sm:text-4xl font-black leading-none select-none"
                    style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Thin vertical line below number on desktop */}
                  <div className="hidden sm:block w-px flex-1 mt-3 bg-gradient-to-b from-gray-200 to-transparent" />
                </div>

                {/* Right: Q + A */}
                <div className="flex-1 py-7 sm:border-l sm:border-gray-100 sm:pl-8">
                  {/* Category tag */}
                  <span
                    className="inline-block text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded text-white mb-3"
                    style={{ background: BTN_GRAD }}
                  >
                    {faq.category}
                  </span>

                  {/* Question */}
                  <h2 className="text-sm md:text-base font-bold text-gray-900 mb-3 leading-snug">
                    {faq.q}
                  </h2>

                  {/* Thin divider */}
                  <div className="w-8 h-px bg-gray-200 mb-3" />

                  {/* Answer */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA FOOTER ────────────────────────────────────────────────────── */}
    <section className="py-6 bg-white border-t border-gray-100">
      <FadeIn className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-0.5">Still have a question?</p>
            <p className="text-xs text-gray-400">Our support team is here to help you.</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-2.5 shadow-sm">
            <RiAuctionFill className="text-sm flex-shrink-0" style={{ color: "#FF6B3D" }} />
            <span className="text-xs font-semibold text-gray-600">SalesBid Support</span>
          </div>
        </div>
      </FadeIn>
    </section>

  </div>
);

export default FAQ;