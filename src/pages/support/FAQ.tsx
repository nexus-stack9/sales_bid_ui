import Layout from "@/components/layout/Layout";
import React, { useState } from "react";

const faqs = [
  {
    q: "How do I register to bid?",
    a: "Click Sign Up, complete verification, and you can bid once approved.",
  },
  {
    q: "What payment methods are supported?",
    a: "All major cards and bank transfer. Payment due within 48 hours.",
  },
  {
    q: "Can I inspect items before bidding?",
    a: "Yes, through preview events or virtual tours prior to auctions.",
  },
  {
    q: "When will my order ship?",
    a: "Typically 1–3 business days after payment is received.",
  },
  {
    q: "How do refunds work?",
    a: "Eligible returns are inspected, then refunds are processed in 3–5 business days.",
  },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">Answers to common questions about bidding, payments, and shipping.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <div key={item.q} className="bg-white border border-gray-100 rounded-xl shadow-sm">
              <button
                className="w-full text-left px-4 py-4 flex items-center justify-between"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="font-medium text-gray-900">{item.q}</span>
                <span className="text-slate-500">{open === idx ? "−" : "+"}</span>
              </button>
              {open === idx && (
                <div className="px-4 pb-4 text-slate-600">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;