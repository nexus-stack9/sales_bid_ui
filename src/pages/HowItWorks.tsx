import Layout from "@/components/layout/Layout";
import React, { useRef, useEffect, useState } from "react";
import {
  FaSearch, FaFileAlt, FaCommentDollar, FaCheckDouble,
  FaWallet, FaBalanceScale, FaReceipt,
} from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";

const BTN_GRAD = "linear-gradient(to right, #FF6B3D, #FFB444)";

// ─── Scroll animation helper ────────────────────────────────────────────────
// Pure React, no library. Fades + lifts element on first viewport entry.

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;           // ms
  distance?: number;        // px upward lift
  duration?: number;        // ms
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  distance = 14,
  duration = 580,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                     transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────

const processSteps = [
  {
    icon: <FaSearch />,
    title: "Browse Listings",
    description:
      "Explore our curated selection of live and upcoming listings across various categories.",
  },
  {
    icon: <FaFileAlt />,
    title: "Review Details",
    description:
      "Examine product descriptions, condition reports, and supplier terms before submitting an offer.",
  },
  {
    icon: <FaCommentDollar />,
    title: "Request Quote or Buy Directly",
    description:
      "Submit offers, request quotes from suppliers, or Buy Directly and track listing status in real-time.",
  },
  {
    icon: <FaCheckDouble />,
    title: "Complete Purchase",
    description:
      "Securely complete purchases and arrange shipping, pickup, or invoicing according to your procurement terms.",
  },
];

const tips = [
  {
    icon: <FaWallet />,
    title: "Define Purchase Budget",
    description:
      "Set your procurement budget and purchasing limits to ensure predictable spend.",
  },
  {
    icon: <FaBalanceScale />,
    title: "Validate Market Pricing",
    description:
      "Inspect comparable pricing and supplier terms to inform your sourcing decisions.",
  },
  {
    icon: <FaReceipt />,
    title: "Understand Terms & Fees",
    description:
      "Review payment terms, taxes, and shipping costs when calculating total landed cost.",
  },
];

const faqs = [
  {
    q: "How do I register to buy?",
    a: 'Registration is simple! Click the "Register" button in the top navigation, provide your company details, and verify your account. Most registrations are approved within one business day.',
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit cards, bank transfers, and invoice/PO terms for approved businesses. Payment terms may vary depending on seller agreements.",
  },
  {
    q: "Can I inspect items before purchase?",
    a: "Yes! We encourage purchasers to participate in preview events, either in-person or via virtual tours scheduled before listings close.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const HowItWorks: React.FC = () => {
  return (
    // <Layout>
    <div className="bg-white text-gray-900">

      {/* ── HERO ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-8 md:py-10">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-gray-200" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">How It Works</span>
              <span className="h-px w-8 bg-gray-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-gray-900 mb-4">
              Your Seamless{" "}
              <span style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Procurement Process
              </span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
              Discover, source, and purchase with our seamless procurement process.
              Here's everything you need to know to get started.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── PROCESS STEPS ── */}
      <section className="py-7 border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">

          <FadeIn className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-5 bg-gray-300" />
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Process</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">4 Simple Steps</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {processSteps.map((step, i) => (
              <FadeIn key={i} delay={i * 90} className="h-full">
                <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange-100 hover:shadow-[0_6px_24px_-4px_rgba(255,107,61,0.09)] transition-shadow duration-300 group h-full">
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all duration-300 rounded-r-full"
                    style={{ background: BTN_GRAD }}
                  />
                  {/* Watermark number */}
                  <span className="absolute -bottom-4 -right-2 text-[8rem] font-black leading-none select-none pointer-events-none text-gray-100">
                    {i + 1}
                  </span>
                  <div className="pl-6 pr-6 pt-6 pb-7 flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[9px] font-black tracking-[0.22em] uppercase px-2.5 py-1 rounded-md text-white"
                        style={{ background: BTN_GRAD }}
                      >
                        Step 0{i + 1}
                      </span>
                      <div
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-white text-base shadow-sm"
                        style={{ background: BTN_GRAD }}
                      >
                        {step.icon}
                      </div>
                    </div>
                    <div className="w-8 h-px bg-gray-100" />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">{step.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCUREMENT TIPS ── */}
      <section className="py-7 border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">

          <FadeIn className="flex flex-col md:flex-row items-end justify-between mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-5 bg-gray-200" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Tips</p>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Procurement Tips &amp; Best Practices</h2>
            </div>
            <p className="text-gray-400 text-xs max-w-xs text-right hidden md:block">
              Follow these practices to get the best value from every sourcing decision.
            </p>
          </FadeIn>

          {/* Unified panel */}
          <FadeIn delay={60}>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {tips.map((tip, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-5 px-6 py-5 hover:bg-orange-50/40 transition-colors duration-200"
                  style={{
                    opacity: 1,
                    // stagger via CSS animation-delay inside the unified panel
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <div
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl text-white text-lg shadow-sm"
                    style={{ background: BTN_GRAD }}
                  >
                    {tip.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">{tip.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-7 border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

            {/* Left sticky title */}
            <FadeIn className="lg:w-2/5 lg:sticky lg:top-28">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-5 bg-gray-300" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">FAQ</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Can't find what you're looking for? Reach out to our support team anytime.
              </p>
              <div className="inline-flex items-center gap-2.5 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                <RiAuctionFill className="text-base flex-shrink-0" style={{ color: "#FF6B3D" }} />
                <span className="text-xs font-semibold text-gray-600">SalesBid Support</span>
              </div>
            </FadeIn>

            {/* FAQ cards — staggered */}
            <div className="lg:w-3/5 w-full space-y-3">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 90} distance={10}>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex">
                    <div className="w-1 flex-shrink-0" style={{ background: BTN_GRAD }} />
                    <div className="px-6 py-5 flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center mt-0.5"
                          style={{ background: BTN_GRAD }}
                        >
                          {i + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{faq.q}</h3>
                      </div>
                      <div className="w-full h-px bg-gray-50 mb-3 ml-8" />
                      <p className="text-sm text-gray-500 leading-relaxed ml-8">{faq.a}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-7">
        <div className="container mx-auto px-6 max-w-4xl">
          <FadeIn>
            <div
              className="relative overflow-hidden rounded-3xl px-10 py-12 text-center"
              style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)" }}
            >
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: BTN_GRAD }} />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "linear-gradient(to right, #FFB444, #FF6B3D)" }} />
              <div className="absolute top-0 inset-x-0 h-px opacity-30" style={{ background: BTN_GRAD }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="h-px w-6 bg-white/20" />
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50">Get Started</span>
                  <span className="h-px w-6 bg-white/20" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Ready to Start Sourcing?</h2>
                <p className="text-white/50 text-sm mb-7 max-w-lg mx-auto leading-relaxed">
                  Join thousands of businesses sourcing high-quality inventory through SalesBid.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    className="px-8 py-3.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    style={{ background: BTN_GRAD }}
                  >
                    Browse Catalog
                  </button>
                  <button className="px-8 py-3.5 border border-white/15 text-white/80 text-sm font-semibold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-200">
                    Create Account
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

export default HowItWorks;