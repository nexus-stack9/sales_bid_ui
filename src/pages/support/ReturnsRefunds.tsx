// import Layout from "@/components/layout/Layout";
import React from "react";

const ReturnsRefunds: React.FC = () => {
  return (
    // <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Returns & Refunds</h1>
          <p className="text-lg text-slate-600">Learn about eligibility, process, and refund timelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Eligibility</h3>
            <p className="text-slate-600">New/unused items and DOA cases may qualify within 7 days of delivery. See product page for specifics.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Process</h3>
            <ol className="list-decimal ml-5 space-y-2 text-slate-600">
              <li>Open a case via the order details page</li>
              <li>Provide photos/videos and description</li>
              <li>Receive RMA label and ship back</li>
            </ol>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Refund Timing</h3>
            <p className="text-slate-600">Most refunds are processed 3–5 business days after inspection.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            <li>Items sold “as-is” or marked final sale</li>
            <li>Customized or perishable goods</li>
            <li>Digital goods once accessed or downloaded</li>
          </ul>
        </div>
      </div>
    // </Layout>
  );
};

export default ReturnsRefunds;