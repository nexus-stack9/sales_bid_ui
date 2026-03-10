import React, { useRef, useEffect, useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

const BTN_GRAD = "linear-gradient(to right, #FF6B3D, #FFB444)";

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
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`, willChange: "opacity,transform" }}>
      {children}
    </div>
  );
};

// ─── Shared Styles ───────────────────────────────────────────────────────────
const inputClasses = "w-full rounded-2xl bg-slate-50 border border-transparent px-6 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-100/50 transition-all duration-300";

const ContactUs: React.FC = () => {
  return (
    // <Layout>
    <div className="bg-white text-gray-900 min-h-screen relative overflow-hidden">
      
      {/* ── AMBIENT BACKGROUND GLOWS ── */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" style={{ background: BTN_GRAD, transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.03] pointer-events-none bg-blue-600" style={{ transform: "translate(-40%, 40%)" }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* ── LEFT COLUMN (Text & Info) ── */}
          <div className="lg:w-5/12 flex flex-col pt-4">
            
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50 mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: BTN_GRAD }} />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Customer Support</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                Contact{" "}
                <span style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Us
                </span>
                <span className="text-orange-500">.</span>
              </h1>
              
              <p className="text-xl text-slate-500 leading-relaxed mb-16 max-w-lg">
                We’re here to help. Reach us through any of the channels below.
              </p>
            </FadeIn>

            {/* Direct Information (Borderless list format) */}
            <div className="space-y-12">
              
              <FadeIn delay={150}>
                <div className="group flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-orange-500 text-xl font-black flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm border border-orange-100/50">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-400 mb-2">Email</h3>
                    <a href="mailto:salesbid9@gmail.com" className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                      salesbid9@gmail.com
                    </a>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={250}>
                <div className="group flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-orange-500 text-xl font-black flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm border border-orange-100/50">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-400 mb-2">Phone</h3>
                    <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                      <p>+91 89195 83205</p>
                      <p>+91 97010 90085</p>
                    </div>
                    <p className="text-sm font-medium text-slate-400 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest mt-1">
                      Call us between 9AM – 6PM
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={350}>
                <div className="group flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-orange-500 text-xl font-black flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm border border-orange-100/50">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-400 mb-2">Address</h3>
                    <p className="text-xl font-bold text-gray-900 leading-snug">
                      Flat 301, Amsri Plaza, SD Road, Ragimental Bazar,<br />
                      Hyderabad, Telangana - 500003
                    </p>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>

          {/* ── RIGHT COLUMN (Massive Form Card) ── */}
          <div className="lg:w-7/12">
            <FadeIn delay={200} className="h-full">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.06)] border border-gray-100 h-full flex flex-col justify-center">
                
                <div className="mb-10">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">Submit a Request</h2>
                  <div className="w-12 h-1.5 rounded-full" style={{ background: BTN_GRAD }} />
                </div>

                <form className="space-y-6">
                  
                  {/* The grid applies to the first two inputs on medium screens and up */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      className={`h-16 ${inputClasses}`}
                      placeholder="Full name"
                    />
                    <input
                      type="email"
                      className={`h-16 ${inputClasses}`}
                      placeholder="Email address"
                    />
                  </div>

                  <input
                    type="text"
                    className={`h-16 ${inputClasses}`}
                    placeholder="Subject"
                  />
                  
                  <textarea
                    className={`min-h-[180px] ${inputClasses}`}
                    placeholder="How can we help?"
                    rows={6}
                  />

                  <div className="pt-6">
                    <button
                      type="button"
                      className="group w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 text-lg font-bold text-white rounded-[1.25rem] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_20px_rgba(255,107,61,0.25)] hover:shadow-[0_12px_30px_rgba(255,107,61,0.35)]"
                      style={{ background: BTN_GRAD }}
                    >
                      <span>Send message</span>
                      <FaLocationArrow className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                  
                </form>

              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </div>
    // </Layout>
  );
};

export default ContactUs;
