import Layout from "@/components/layout/Layout";
import React from "react";
import { Link } from "react-router-dom";

const UpcomingAuctions: React.FC = () => {
  const placeholder = [
    { id: 1, title: "Electronics Clearance", date: "Sep 15, 2025", lots: 120 },
    { id: 2, title: "Home & Kitchen", date: "Sep 18, 2025", lots: 80 },
    { id: 3, title: "Apparel Mega Lot", date: "Sep 21, 2025", lots: 200 },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Upcoming Auctions</h1>
          <p className="text-lg text-slate-600">Plan ahead and bookmark auctions you don’t want to miss.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholder.map(a => (
            <div key={a.id} className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur group-hover:opacity-40 transition" />
              <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
                <div className="text-sm text-slate-500 mb-2">{a.date}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-slate-600 mb-4">{a.lots} lots</p>
                <Link to={`/auctions`} className="text-blue-600 font-medium">View details →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default UpcomingAuctions;