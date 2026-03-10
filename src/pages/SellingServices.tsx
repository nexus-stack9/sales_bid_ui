import Layout from "@/components/layout/Layout";
import React, { useRef, useEffect, useState } from "react";

const BTN_GRAD = "linear-gradient(to right, #FF6B3D, #FFB444)";
const DARK_BG  = "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)";

// ─── Scroll fade-in (no library) ─────────────────────────────────────────────
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, distance = 14, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : `translateY(${distance}px)`,
        transition: `opacity 580ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                     transform 580ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const SellingServices: React.FC = () => {
  return (
    // <Layout>
    <div className="bg-white text-gray-900">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-10 md:py-14 max-w-5xl">
          <FadeIn className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-5 bg-gray-200" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-gray-400">Selling Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-4">
              Selling{" "}
              <span style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Services
              </span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-7 max-w-xl">
              Maximize returns and efficiently liquidate inventory through our specialized
              liquidation marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="px-7 py-3 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{ background: BTN_GRAD }}
              >
                Request a Consultation
              </button>
              <button className="px-7 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:border-orange-200 hover:text-gray-800 transition-all duration-200">
                Download Seller Guide
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ VALUE PROPOSITIONS — alternating split rows ═══════════════════════
           Each prop is a horizontal row: icon+title left, description right.
           Rows alternate white / gray-50 background for rhythm.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl py-8">
          <FadeIn className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-5 bg-gray-300" />
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Why SalesBid</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Built for Sellers</h2>
          </FadeIn>

          {[
            {
              icon: (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Maximize Returns",
              body: "Competitive bidding ensures you get the best possible price for your inventory, often above wholesale value.",
              // stat: "40%",
              // statLabel: "Higher returns avg.",
            },
            {
              icon: (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Fast Liquidation",
              body: "Turn slow-moving inventory into cash quickly with our streamlined listing process and extensive buyer network.",
              // stat: "72h",
              // statLabel: "Avg. first offer",
            },
            {
              icon: (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              ),
              title: "National Reach",
              body: "Access thousands of qualified buyers across the country without the overhead of traditional sales channels.",
              // stat: "10k+",
              // statLabel: "Verified buyers",
            },
          ].map((vp, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 px-0 py-6 ${
                  i < 2 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: BTN_GRAD }}
                >
                  {vp.icon}
                </div>

                {/* Title + body */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{vp.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{vp.body}</p>
                </div>

                {/* Stat pill */}
                <div className="flex-shrink-0 text-right">
                  {/* <p
                    className="text-2xl font-black leading-none"
                    style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    {vp.stat}
                  </p> */}
                  {/* <p className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">{vp.statLabel}</p> */}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══ SELLING PROCESS — stepped numbered flow ════════════════════════════
           Three steps as a unified dark panel with numbered accent circles
           and a gradient connecting trail.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">

          <FadeIn className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-5 bg-gray-300" />
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Process</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Selling Process</h2>
          </FadeIn>

          {/* 3 steps in a row on desktop, stacked on mobile */}
          <div className="relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden md:block absolute top-[22px] h-px"
              style={{
                left: "calc(16.66% + 20px)",
                right: "calc(16.66% + 20px)",
                background: "linear-gradient(to right, #FF6B3D44, #FFB44444)",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: 1,
                  cls: "bg-blue-100 text-blue-800",
                  title: "Consultation & Evaluation",
                  body: "Our experts analyze your inventory and market conditions to develop an optimal selling strategy.",
                },
                {
                  num: 2,
                  cls: "bg-purple-100 text-purple-800",
                  title: "Cataloging & Marketing",
                  body: "We professionally photograph, describe, and promote your items to our extensive buyer network.",
                },
                {
                  num: 3,
                  cls: "bg-green-100 text-green-800",
                  title: "Listing Management",
                  body: "Our team handles all aspects of listing management from offers to payment collection.",
                },
              ].map((step, i) => (
                <FadeIn key={i} delay={i * 90} distance={12}>
                  <div className="flex flex-col items-start">
                    {/* Numbered node */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm mb-5 shadow-md ring-4 ring-gray-50 z-10 relative"
                      style={{ background: BTN_GRAD }}
                    >
                      {step.num}
                    </div>

                    {/* Card below */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full hover:border-orange-100 hover:shadow-[0_4px_20px_-4px_rgba(255,107,61,0.07)] transition-all duration-300">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">{step.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ INDUSTRIES — 2×2 icon grid on white ══ */}
      <section className="py-5 border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">

          <FadeIn className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-5 bg-gray-300" />
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Industries</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Industries We Serve</h2>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Retail",
                icon: <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
              },
              {
                label: "Manufacturing",
                icon: <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
              },
              {
                label: "Warehousing",
                icon: <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
              },
              {
                label: "E-commerce",
                icon: <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
              },
            ].map((ind, i) => (
              <FadeIn key={i} delay={i * 60} distance={10}>
                <div className="group bg-white rounded-2xl border border-gray-100 px-5 py-5 flex flex-col items-start gap-4 relative overflow-hidden hover:border-orange-100 hover:shadow-[0_4px_16px_-4px_rgba(255,107,61,0.07)] transition-all duration-300">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                    style={{ background: BTN_GRAD }}
                  >
                    {ind.icon}
                  </div>
                  {/* Label */}
                  <p className="text-sm font-bold text-gray-900">{ind.label}</p>
                  {/* Bottom accent bar — grows on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                    style={{ background: BTN_GRAD }}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <FadeIn>
            <div className="relative rounded-2xl overflow-hidden" style={{ background: DARK_BG }}>
              <div className="absolute top-0 inset-x-0 h-px opacity-30" style={{ background: BTN_GRAD }} />
              <div className="absolute top-0 right-1/3 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: BTN_GRAD }} />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-8 gap-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    Ready to Liquidate Your Inventory?
                  </h2>
                  <p className="text-white/45 text-xs max-w-sm leading-relaxed">
                    Connect with our sales team to discuss how we can help you maximize returns
                    on your excess inventory.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <button
                    className="px-7 py-3 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 whitespace-nowrap"
                    style={{ background: BTN_GRAD }}
                  >
                    Request a Consultation
                  </button>
                  <button className="px-7 py-3 text-sm font-semibold border border-white/15 text-white/75 rounded-xl hover:bg-white/10 hover:border-white/25 transition-all duration-200 whitespace-nowrap">
                    Download Seller Guide
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
    // </Layout>
  );
};

export default SellingServices;