// import Layout from "@/components/layout/Layout";
import React from "react";

const ShippingLogistics: React.FC = () => {
  return (
    // <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Shipping & Logistics</h1>
          <p className="text-lg text-slate-600">Understand delivery options, timelines, and tracking your orders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Carriers</h3>
            <p className="text-slate-600">We partner with reliable carriers: DHL, FedEx, UPS, and regional freight services.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Timelines</h3>
            <p className="text-slate-600">Domestic: 3–7 business days. International: 7–14 business days depending on customs.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tracking</h3>
            <p className="text-slate-600">A tracking number is provided once your order ships. Use the carrier’s portal for real-time updates.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Freight & Bulk Shipments</h2>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            <li>Freight class and palletization determined by item size and weight.</li>
            <li>Dock appointment scheduling available for business addresses.</li>
            <li>Liftgate and inside delivery options can be added at checkout.</li>
          </ul>
        </div>
      </div>
    // </Layout>
  );
};

export default ShippingLogistics;