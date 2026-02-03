import Layout from "@/components/layout/Layout";
import React from "react";

const HowItWorks: React.FC = () => {
  return (
    // <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover, browse, and buy with our seamless purchasing process. Here's everything you need to know to get started.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Step 1 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-md h-full border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Browse Auctions</h3>
              <p className="text-slate-600">
                Explore our curated selection of live and upcoming auctions across various categories.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-md h-full border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Review Details</h3>
              <p className="text-slate-600">
                Examine product descriptions, condition reports, and purchase terms before buying.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-md h-full border border-gray-100">
              <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Buy directly or place an offer</h3>
              <p className="text-slate-600">
                Use Buy It Now or place an offer and track progress in real-time.

              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-md h-full border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Complete Purchase</h3>
              <p className="text-slate-600">
                Securely pay for your purchases and arrange shipping or pickup of your items.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Shopping Tips & Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Set a Budget</h3>
              <p className="text-slate-600">
                Determine your budget beforehand to avoid overspending in the heat of the moment.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-purple-600">Research Values</h3>
              <p className="text-slate-600">
                Investigate recent sale prices for similar items to inform your purchasing decisions.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-pink-600">Understand Fees</h3>
              <p className="text-slate-600">
                Factor in buyer's premiums, taxes, and shipping costs when calculating your total price.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">How do I register to buy?</h3>
              <p className="text-slate-600">
                Registration is simple! Click the "Register" button in the top navigation, provide your details, and verify your identity. Most registrations are approved within one business day.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">What payment methods do you accept?</h3>
              <p className="text-slate-600">
                We accept all major credit cards, bank transfers, and certified checks. Payment is due within 48 hours of the auction closing.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Can I inspect items before purchase?</h3>
              <p className="text-slate-600">
                Yes! We encourage all buyers to participate in our preview events, either in-person or through virtual tours scheduled before purchase.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Start Shopping?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied buyers who have discovered unique items through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center">
              Browse Products
            </Link>
            <button className="bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors">
              Create Account
            </button>
          </div>
        </div>
      </div>
    // </Layout>
  );
};

export default HowItWorks;