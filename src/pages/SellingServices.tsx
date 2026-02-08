import Layout from "@/components/layout/Layout";
import React from "react";

const SellingServices: React.FC = () => {
  return (
    // <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Selling Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Maximize returns and efficiently liquidate inventory through our specialized liquidation marketplace.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Maximize Returns</h3>
            <p className="text-slate-600">
              Competitive bidding ensures you get the best possible price for your inventory, often above wholesale value.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
            <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast Liquidation</h3>
            <p className="text-slate-600">
              Turn slow-moving inventory into cash quickly with our streamlined listing process and extensive buyer network.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
            <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">National Reach</h3>
            <p className="text-slate-600">
              Access thousands of qualified buyers across the country without the overhead of traditional sales channels.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Selling Process</h2>
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Consultation & Evaluation</h3>
                  <p className="text-slate-600">
                    Our experts analyze your inventory and market conditions to develop an optimal selling strategy.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="bg-purple-100 text-purple-800 rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Cataloging & Marketing</h3>
                  <p className="text-slate-600">
                    We professionally photograph, describe, and promote your items to our extensive buyer network.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="bg-green-100 text-green-800 rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Listing Management</h3>
                  <p className="text-slate-600">
                    Our team handles all aspects of listing management from offers to payment collection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Served */}
        <div className="bg-gray-50 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Industries We Serve</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Retail</h3>
            </div>
            <div className="bg-white p-5 rounded-lg text-center shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Manufacturing</h3>
            </div>
            <div className="bg-white p-5 rounded-lg text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Warehousing</h3>
            </div>
            <div className="bg-white p-5 rounded-lg text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">E-commerce</h3>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-center text-white mb-16">
          <div className="max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl italic mb-6">
              "We liquidated $250,000 of excess inventory through their marketplace and achieved 40% higher returns than traditional liquidators. The process was seamless from start to finish."
            </p>
            <div>
              <p className="font-semibold">Jennifer Wilson</p>
              <p className="text-blue-200">COO, Retail Solutions Inc.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Liquidate Your Inventory?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with our sales team to discuss how we can help you maximize returns on your excess inventory.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Request a Consultation
            </button>
            <button className="bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors">
              Download Seller Guide
            </button>
          </div>
        </div>
      </div>
    // </Layout>
  );
};

export default SellingServices;