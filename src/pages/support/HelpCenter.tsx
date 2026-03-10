import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaChevronRight, FaRegLifeRing, FaShieldAlt, FaBookOpen } from "react-icons/fa";
import { MdOutlineTopic, MdPayments, MdOutlineLocalShipping, MdOutlineReplay, MdMailOutline } from "react-icons/md";

const BTN_GRAD = 'linear-gradient(to right, #FF6B3D, #FFB444)';

const HelpCenter: React.FC = () => {
  const [q, setQ] = useState("");

  const categories = [
    { title: "Getting Started", desc: "Account creation, profile, and basics", to: "/support/faq", icon: <FaBookOpen /> },
    { title: "Offers & Listings", desc: "How to submit offers, proxy offers, offer increments", to: "/how-it-works", icon: <MdOutlineTopic /> },
    { title: "Payments", desc: "Invoices, methods, and security", to: "/buyer-protection", icon: <MdPayments /> },
    { title: "Shipping & Logistics", desc: "Timelines, carriers, and tracking", to: "/support/shipping-logistics", icon: <MdOutlineLocalShipping /> },
    { title: "Returns & Refunds", desc: "Eligibility, timelines, and process", to: "/support/returns-refunds", icon: <MdOutlineReplay /> },
    { title: "Contact Support", desc: "Reach our team for assistance", to: "/support/contact-us", icon: <MdMailOutline /> },
  ];

  return (
    <div className="bg-white text-gray-900 font-sans pb-10">
      
      {/* ─── Hero ─── */}
      <section className="bg-white pt-8 pb-8 md:pt-10 md:pb-10 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-gray-200" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
              Support Center
            </span>
            <span className="h-px w-6 bg-gray-200" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            How can we <br className="md:hidden" />
            <span style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              help you today?
            </span>
          </h1>
          
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Guides, FAQs, and specialized resources designed to help you succeed on Sales Bid.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200 flex items-center group relative overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-[#FF6B3D]">
              <div className="pl-4 pr-3 text-gray-400 group-focus-within:text-[#FF6B3D] transition-colors">
                <FaSearch className="text-lg" />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search help articles, topics, or FAQs..."
                className="w-full h-12 bg-transparent text-gray-900 text-base placeholder:text-gray-400 focus:outline-none"
              />
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 text-xs font-bold mr-1">
                ⌘K
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-gray-500">
              <span className="uppercase tracking-widest text-gray-400 mr-2">Popular:</span>
              <span className="space-x-3">
                <span className="hover:text-[#FF6B3D] cursor-pointer transition-colors">Offers</span>
                <span className="text-gray-300">•</span>
                <span className="hover:text-[#FF6B3D] cursor-pointer transition-colors">Payments</span>
                <span className="text-gray-300">•</span>
                <span className="hover:text-[#FF6B3D] cursor-pointer transition-colors">Shipping</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Collection ─── */}
      <section className="py-8 md:py-10 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
               <span className="h-px w-5 bg-gray-300" />
               <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Categories</p>
               <span className="h-px w-5 bg-gray-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Browse by topic</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, idx) => (
              <Link key={idx} to={c.to} className="group flex flex-col items-start gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.05)] hover:border-orange-100 transition-all duration-300 h-full">
                {/* Gradient Icon Square */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl text-white text-xl shadow-sm group-hover:scale-105 transition-transform duration-300" style={{ background: BTN_GRAD }}>
                  {c.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-[#FF6B3D] transition-colors">{c.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quick Links ─── */}
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="relative bg-gradient-to-br from-orange-50/80 to-white p-8 md:p-10 rounded-[2rem] border border-orange-100/50 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
              <FaShieldAlt className="absolute -right-6 -bottom-6 text-[120px] text-orange-500/5 transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
              <div className="relative z-10 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#FF6B3D] shadow-[0_4px_12px_-4px_rgba(255,107,61,0.2)] border border-orange-50 text-xl">
                  <FaShieldAlt />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Offer with Confidence</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 relative z-10">Learn how Buyer Protection safely handles your transactions and purchases.</p>
              <Link to="/buyer-protection" className="mt-auto inline-flex items-center text-sm font-bold uppercase tracking-wider text-[#FF6B3D] hover:text-orange-500 transition-colors group/link relative z-10 w-max">
                Learn more <FaChevronRight className="ml-2 text-[10px] transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative bg-gradient-to-br from-blue-50/80 to-white p-8 md:p-10 rounded-[2rem] border border-blue-100/50 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
              <FaBookOpen className="absolute -right-6 -bottom-6 text-[120px] text-blue-500/5 transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
              <div className="relative z-10 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-[0_4px_12px_-4px_rgba(59,130,246,0.2)] border border-blue-50 text-xl">
                  <FaBookOpen />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">New to Sales Bid?</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 relative z-10">Start with our quick guide to learn the best bidding practices.</p>
              <Link to="/how-it-works" className="mt-auto inline-flex items-center text-sm font-bold uppercase tracking-wider text-blue-500 hover:text-blue-600 transition-colors group/link relative z-10 w-max">
                Start here <FaChevronRight className="ml-2 text-[10px] transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-50/80 to-white p-8 md:p-10 rounded-[2rem] border border-emerald-100/50 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
              <MdMailOutline className="absolute -right-6 -bottom-6 text-[120px] text-emerald-500/5 transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
              <div className="relative z-10 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.2)] border border-emerald-50 text-xl">
                  <MdMailOutline />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Need Human Help?</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 relative z-10">Our specialized support team is available Mon–Fri, 9am–6pm EST.</p>
              <Link to="/support/contact-us" className="mt-auto inline-flex items-center text-sm font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-600 transition-colors group/link relative z-10 w-max">
                Contact us <FaChevronRight className="ml-2 text-[10px] transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HelpCenter;