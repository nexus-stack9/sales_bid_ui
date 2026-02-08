import Layout from "@/components/layout/Layout";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const HelpCenter: React.FC = () => {
  const [q, setQ] = useState("");

  return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Help Center</h1>
          <p className="text-lg text-slate-600">Guides, FAQs, and resources to help you succeed on Sales Bid.</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search help articles, topics, or FAQs..."
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pr-12 text-gray-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌘K</span>
          </div>
          <div className="text-sm text-slate-500 mt-2">Popular: offers, payments, shipping, returns</div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Getting Started",
              desc: "Account creation, profile, and basics",
              to: "/support/faq",
            },
            {
              title: "Offers & Listings",
              desc: "How to submit offers, proxy offers, offer increments",
              to: "/how-it-works",
            },
            {
              title: "Payments",
              desc: "Invoices, methods, and security",
              to: "/buyer-protection",
            },
            {
              title: "Shipping & Logistics",
              desc: "Timelines, carriers, and tracking",
              to: "/support/shipping-logistics",
            },
            {
              title: "Returns & Refunds",
              desc: "Eligibility, timelines, and process",
              to: "/support/returns-refunds",
            },
            {
              title: "Contact Support",
              desc: "Reach our team for assistance",
              to: "/support/contact-us",
            },
          ].map((c) => (
            <Link key={c.title} to={c.to} className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur group-hover:opacity-40 transition" />
              <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-slate-600">{c.desc}</p>
                <div className="mt-4 text-blue-600 font-medium">Explore →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-2 text-gray-900">Offer with confidence</h4>
            <p className="text-slate-600 mb-4">Learn how Buyer Protection keeps your purchases safe.</p>
            <Link to="/buyer-protection" className="text-blue-600 font-medium">Learn more →</Link>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-2 text-gray-900">New to Sales Bid?</h4>
            <p className="text-slate-600 mb-4">Start with our quick guide and best practices.</p>
            <Link to="/how-it-works" className="text-emerald-700 font-medium">Start here →</Link>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-2 text-gray-900">Need human help?</h4>
            <p className="text-slate-600 mb-4">Our support team is available Mon–Fri, 9am–6pm.</p>
            <Link to="/support/contact-us" className="text-orange-700 font-medium">Contact us →</Link>
          </div>
        </div>
      </div>
  );
};

export default HelpCenter;