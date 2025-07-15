import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const SellersPage = () => {
  return (
    <Layout>
      <div className="sellers-page font-sans bg-white">
      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-r from-blue-900 to-blue-700 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h2 className="text-xl md:text-2xl font-light text-blue-200 mb-4 tracking-wider">
            ONLINE LIQUIDATION AUCTIONS CONNECTING BUYERS WITH SELLERS OF
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            EXCESS, RETURNED, REFURBISHED <br className="hidden md:block" />AND LIQUIDATION INVENTORY
          </h1>
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg px-6 py-4 mb-8 border border-white border-opacity-20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome to the World's Largest
              </h3>
              <h3 className="text-2xl md:text-3xl font-bold text-orange-400">
                B2B Recommerce Marketplace
              </h3>
            </div>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Where hundreds of thousands of business buyers come to<br className="hidden md:block" />
              source excess inventory from leading brands & retailers
            </p>
          </div>
        </div>
      </section>

      {/* Business Type Selector */}
      <section className="business-type bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white rounded-lg shadow-md px-6 py-3 mb-8">
            <h3 className="text-xl font-semibold text-gray-800">What kind of business are you?</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              I'm a Small Business
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-8 rounded-lg text-lg border-2 border-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              More than $250M in annual revenue
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-8 rounded-lg text-lg border-2 border-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              Less than $250M in annual revenue
            </button>
          </div>
          <p className="text-blue-600 font-medium hover:text-blue-700 transition duration-300">
            Are You a European Seller? <Link to="/europe" className="underline hover:no-underline">Click Here</Link>
          </p>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-prop bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block border-b-4 border-orange-500 pb-2 px-8">
              <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                B-Stock helps sellers achieve higher recovery on their surplus by streamlining resale operations through a B2B marketplace and a suite of flexible solutions that:
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Boost Buyer Demand",
                description: "Access to thousands of pre-qualified business buyers actively bidding on inventory.",
                icon: "👥"
              },
              {
                title: "Enhance Operational Efficiency",
                description: "Streamlined processes from listing to payment with minimal effort required from your team.",
                icon: "⚙️"
              },
              {
                title: "Provide Actionable Data Insights",
                description: "Comprehensive analytics to track performance and optimize your liquidation strategy.",
                icon: "📊"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-blue-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inventory Solutions Section */}
      <section className="solutions bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
              Whether you need to resell a few pallets per month or several truckloads per week, B-Stock enables you to move out inventory with velocity and predictability while securing competitive prices.
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">1</div>
                <h3 className="text-xl font-bold text-blue-800">Flexible Solutions</h3>
              </div>
              <p className="text-gray-600 pl-16 leading-relaxed">
                Exclusive business relationships and binding contracts guarantee significant warehouse space cleared regularly & quickly
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">2</div>
                <h3 className="text-xl font-bold text-blue-800">Hours, Not Weeks</h3>
              </div>
              <p className="text-gray-600 pl-16 leading-relaxed">
                Your excess goods can move in as little as 24-48 hours, accelerating your operations whether you're moving out just a few lots per month or dozens
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">3</div>
                <h3 className="text-xl font-bold text-blue-800">High Speed to Cash</h3>
              </div>
              <p className="text-gray-600 pl-16 leading-relaxed">
                With payment appearing in your account just days after receipt, your goods' cash value is realized significantly faster than with traditional approaches
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">4</div>
                <h3 className="text-xl font-bold text-blue-800">We Do the Work</h3>
              </div>
              <p className="text-gray-600 pl-16 leading-relaxed">
                B-Stock handles both strategic & administrative obstacles to velocity—including generating demand, fielding buyer questions, mediating disputes, etc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="trusted-brands bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Join the World's Largest
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
              Brands & Retailers
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
          </div>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Industry-leading retailers and household brands rely on B-Stock to reach more buyers, improve operational efficiency, cut down cycle times, and deliver great financial outcomes.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center mb-12">
            {['Walmart', 'Target', 'DICK\'S SPORTING GOODS', 'Advance Auto Parts'].map((brand, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition duration-300">
                <div className="h-20 w-20 flex items-center justify-center mb-4 bg-white rounded-full shadow-sm">
                  {/* Placeholder for brand logo - replace with actual logo components */}
                  <span className="text-xl font-bold text-gray-700">{brand.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{brand}</p>
              </div>
            ))}
          </div>
          
          {/* Special brand treatments */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 p-8 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition duration-300">
              <h3 className="text-xl font-bold text-blue-800 mb-2">Walmart Liquidation Auctions</h3>
              <p className="text-gray-600">Official partner for Walmart's liquidation needs</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-gray-500 hover:shadow-md transition duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Target WHOLESALE</h3>
              <p className="text-gray-600">Premium wholesale solutions for Target inventory</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-8 mb-8 border border-white border-opacity-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Start Selling Your Excess Inventory?</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
              Join hundreds of the world's largest retailers and manufacturers who trust B-Stock to maximize recovery on their excess inventory.
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Contact Our Sales Team
            </Link>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default SellersPage;