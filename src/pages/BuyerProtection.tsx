import Layout from "@/components/layout/Layout";
import React from "react";

const BuyerProtection: React.FC = () => {
  return (
    <Layout>
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Buyer Protection</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Shop with confidence knowing your purchases are protected by our comprehensive security measures and policies.
        </p>
      </div>

      {/* Protection Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
          <p className="text-slate-600">All transactions are encrypted and processed through trusted payment gateways.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Money-Back Guarantee</h3>
          <p className="text-slate-600">Get a full refund if your item doesn't arrive or doesn't match the description.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
          <p className="text-slate-600">Our customer service team is always available to help resolve any issues.</p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">How Our Protection Works</h2>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-start">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 md:mb-0 md:mr-6 flex-shrink-0">1</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Shop Confidently</h3>
              <p className="text-slate-600 mb-3">Browse and purchase from our verified sellers knowing you're protected.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 md:mb-0 md:mr-6 flex-shrink-0">2</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Report Any Issues</h3>
              <p className="text-slate-600 mb-3">If your order doesn't arrive or isn't as described, report it within 30 days of delivery.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 md:mb-0 md:mr-6 flex-shrink-0">3</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">We Investigate</h3>
              <p className="text-slate-600 mb-3">Our team will review your case and work with the seller to find a solution.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 md:mb-0 md:mr-6 flex-shrink-0">4</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Resolution</h3>
              <p className="text-slate-600">Receive a full refund if we determine you're eligible under our protection policy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">What purchases are covered?</h3>
            <p className="text-slate-600">Most physical goods purchased on our platform are covered, provided they meet our eligibility requirements. Digital goods, services, and items prohibited by our policies are not covered.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">How long do I have to file a claim?</h3>
            <p className="text-slate-600">You must report any issues within 30 days of the estimated or actual delivery date, whichever is later.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">What documentation do I need?</h3>
            <p className="text-slate-600">You may need to provide order details, communication with the seller, photos of the item (if applicable), and any other relevant evidence to support your claim.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">How long does the process take?</h3>
            <p className="text-slate-600">Most cases are resolved within 14 business days, though complex cases may take longer. We'll keep you updated throughout the process.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Need Help With an Order?</h2>
        <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
          Our support team is ready to assist you with any questions or concerns about your purchase.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
            Contact Support
          </button>
          <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
            File a Claim
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default BuyerProtection;