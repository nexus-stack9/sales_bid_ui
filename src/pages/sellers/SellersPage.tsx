import React, { useState } from 'react';
import { 
  FaChartLine, FaUsers, FaShieldAlt, FaPercentage, FaGlobe, 
  FaTrophy, FaHandHoldingUsd, FaCamera, FaTag, FaShippingFast, 
  FaMobile, FaDesktop, FaQuestionCircle, FaBook, FaVideo, FaHeadset,
  FaBox, FaWarehouse, FaRecycle, FaTools, FaBoxOpen, FaIndustry, FaPallet,
  FaCheckCircle, FaHandshake, FaNetworkWired, FaStream, FaChartBar 
} from 'react-icons/fa';
import { RiAuctionFill } from 'react-icons/ri';
import { MdAnalytics, MdInventory, MdPayment, MdSecurity } from 'react-icons/md';
import Layout from '@/components/layout/Layout';
import SellerRegistrationForm from '@/pages/sellers/SellerRegistrationForm';
import { Link } from "react-router-dom";

const SellersPage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
  }

  const benefits = [
    {
      icon: <FaUsers className="text-3xl mb-4 text-blue-600" />,
      title: "Reach Verified B2B Buyers",
      description: "Connect with 10,000+ registered businesses actively sourcing bulk inventory."
    },
    {
      icon: <MdSecurity className="text-3xl mb-4 text-blue-600" />,
      title: "Secure Transactions",
      description: "All payments are handled through trusted gateways with bank-level protection."
    },
    {
      icon: <FaShieldAlt className="text-3xl mb-4 text-blue-600" />,
      title: "Flexible Selling Options",
      description: "Choose to Sell Now (Fixed Price) or Accept Offers for faster liquidation."
    },
    {
      icon: <FaChartLine className="text-3xl mb-4 text-blue-600" />,
      title: "Commission-Based Platform",
      description: "No hidden fees — pay only a small commission on successful sales."
    }
  ];

  const successStories = [
    {
      quote: "My antique furniture business doubled its revenue within 3 months of joining this platform.",
      author: "Sarah J., Antique Dealer",
      rating: 5
    },
    {
      quote: "As a small collector, I was able to reach buyers I never could have accessed on my own.",
      author: "Michael T., Collectibles Seller",
      rating: 5
    },
    {
      quote: "The seller tools helped me optimize my listings and get 40% more bids per item.",
      author: "Lisa M., Jewelry Seller",
      rating: 5
    }
  ];

  const sellerTools = [
    {
      icon: <FaCamera className="text-3xl mb-4 text-blue-600" />,
      title: "Professional Photography",
      description: "AI-powered photo enhancement and background removal tools"
    },
    {
      icon: <MdAnalytics className="text-3xl mb-4 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Track views, bids, and performance metrics in real-time"
    },
    {
      icon: <FaTag className="text-3xl mb-4 text-blue-600" />,
      title: "Smart Pricing",
      description: "AI-suggested starting prices based on market data"
    },
    {
      icon: <MdInventory className="text-3xl mb-4 text-blue-600" />,
      title: "Inventory Management",
      description: "Organize and track all your listings in one place"
    }
  ];

  const marketplaceStats = [
    {
      number: "70+",
      label: "Verified Sellers",
      description: "Selling nationwide"
    },
    {
      number: "32+",
      label: "Cities covered",
      description: "Active Buyers and Sellers"
    },
    {
      number: "10,00,000+",
      label: "Units Sold",
      description: "Through verified transactions"
    },
    {
      number: "1.5%",
      label: "Transaction charges",
      description: "Among India's lowest"
    }
  ];

  const faqData = [
    {
      question: "How do I get started as a seller?",
      answer: "Simply click 'Start Selling Today' to create your seller account. The process takes just a few minutes and you can start listing items immediately after verification."
    },
    {
      question: "What fees do you charge?",
      answer: "We charge a competitive final value fee only when your item sells. There are no listing fees, monthly fees, or hidden charges. You only pay when you make money."
    },
    {
      question: "How do I get paid?",
      answer: "Payments are processed automatically after successful auctions. You can choose from multiple payout methods including bank transfer, PayPal, or digital wallets."
    }
  ];

  return (
    // <Layout>
      <div className="seller-page bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent w-1/3"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          </div>
          
          <div className="container mx-auto px-4 py-28 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <RiAuctionFill className="text-5xl text-blue-300" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Sell on <span className="text-blue-300">SalesBid </span> – India’s Trusted B2B Liquidation & Bulk Sales Marketplace

              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
Turn Your Unsold, Returned, or New Stock into Cash — Fast & Secure.
              </p>
              <p  className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                SalesBid helps manufacturers, distributors, wholesalers, and retailers liquidate or sell their stock directly to verified business buyers across India.
 Whether it’s new, excess, returned, refurbished, or used, we help you recover maximum value quickly — with zero middlemen.

              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/sellerRegistration" className="bg-white text-blue-700 font-bold py-4 px-8 rounded-full text-lg shadow-lg">
                  Start Selling Today
                </Link>
                <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          
         
        </div>

        {/* Why Sell With Us Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                WHY CHOOSE US
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Ultimate Platform for Sellers</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                We've built the most seller-friendly auction platform with features designed to help you succeed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">{benefit.title}</h3>
                  <p className="text-gray-600 text-center">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What Can You Sell Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider mb-4">
                Inventory Types
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                What Can You Sell on SalesBid
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-base">
                We support every type of B2B inventory — from brand-new stock to decommissioned assets.
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {/* New Stock */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FaBox className="text-xl text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">New Stock (Factory Fresh)</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Brand new, unused products from manufacturers or distributors.
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Ideal For:</span>
                    <span className="text-sm text-gray-600">Manufacturers, OEMs</span>
                  </div>
                </div>

                {/* Excess or Overstock */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FaWarehouse className="text-xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Excess or Overstock</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Unsold inventory sitting in warehouses or retail stores.
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Ideal For:</span>
                    <span className="text-sm text-gray-600">Distributors, Wholesalers</span>
                  </div>
                </div>

                {/* Customer Returns */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FaRecycle className="text-xl text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Customer Returns (Grade A/B/C)</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Tested, working, and graded returned products ready for resale.
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Ideal For:</span>
                    <span className="text-sm text-gray-600">Retailers, E-commerce Sellers</span>
                  </div>
                </div>

                {/* Refurbished Products */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FaTools className="text-xl text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Refurbished Products</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Professionally repaired and restored items.
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Ideal For:</span>
                    <span className="text-sm text-gray-600">Refurbishers, Service Centers</span>
                  </div>
                </div>

                {/* Open-Box or Unboxed */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FaBoxOpen className="text-xl text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Open-Box or Unboxed</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Unused but open packaging products.
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Ideal For:</span>
                    <span className="text-sm text-gray-600">E-commerce Returns, Sellers</span>
                  </div>
                </div>

                {/* Decommissioned / Used Assets */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FaIndustry className="text-xl text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Decommissioned / Used Assets</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Used IT, industrial, or office equipment.
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Ideal For:</span>
                    <span className="text-sm text-gray-600">Corporates, Institutions</span>
                  </div>
                </div>

                {/* Bulk & Pallet Lots */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FaPallet className="text-xl text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Bulk & Pallet Lots</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Mixed products sold in large lots for B2B resale.
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Ideal For:</span>
                    <span className="text-sm text-gray-600">Traders, Bulk Buyers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-12 bg-white relative">
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider mb-4">
                Get Started
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How Selling Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base">
                Getting started is quick and easy. Here's our simple 4-step process:
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {/* Step 1 */}
              <div className="flex gap-6 pb-10 relative">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-blue-600 to-blue-300 mt-2"></div>
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Register as a Seller</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Fill out a short form and complete KYC to become a verified seller.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-6 pb-10 relative">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-blue-600 to-blue-300 mt-2"></div>
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">List Your Stock</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Upload product details, images, quantity, and condition (New, Refurbished, etc.).
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex gap-6 pb-10 relative">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-blue-600 to-blue-300 mt-2"></div>
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Selling Method</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Set a fixed price (Direct Buy) or allow buyers to make offers (Price Discovery).
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Get Paid Securely</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Once a buyer pays, we release funds to you after confirmation of pickup or delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Who Can Sell Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider mb-4">
                Eligibility
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Who Can Sell on SalesBid
              </h2>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Manufacturers & OEMs */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Manufacturers & OEMs</h3>
                    </div>
                  </div>
                </div>

                {/* Distributors & Wholesalers */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Distributors & Wholesalers</h3>
                    </div>
                  </div>
                </div>

                {/* Retailers & E-commerce Sellers */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Retailers & E-commerce Sellers</h3>
                    </div>
                  </div>
                </div>

                {/* Liquidators & Stock Clearance Agents */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Liquidators & Stock Clearance Agents</h3>
                    </div>
                  </div>
                </div>

                {/* Service Centers & Refurbishers */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Service Centers & Refurbishers</h3>
                    </div>
                  </div>
                </div>

                {/* Corporates with Used or Decommissioned Assets */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">Corporates with Used or Decommissioned Assets</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        {/* <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                SUCCESS STORIES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Sellers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Hear from sellers who've transformed their businesses with our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                  <div className="flex items-center mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg italic mb-6">"{story.quote}"</p>
                  <p className="font-medium text-gray-700">— {story.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Seller Tools Section */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                SELLER TOOLS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Seller Tools</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Everything you need to create compelling listings and manage your auctions efficiently.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sellerTools.map((tool, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                      {tool.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">{tool.title}</h3>
                  <p className="text-gray-600 text-center">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marketplace Statistics */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                OUR IMPACT
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Businesses Love SalesBid</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Our platform connects you with millions of buyers worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {marketplaceStats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-xl font-semibold mb-2">{stat.label}</div>
                  <div className="text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted Selling Partner Section */}
        <div className="py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Icon and Title */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                    <FaHandshake className="text-5xl text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Your Trusted Selling Partner
                  </h2>
                  <p className="text-xl md:text-2xl leading-relaxed text-white/90">
                    We're not just a platform — we're your partner in turning stock into revenue.
                    Our verified network, transparent process, and live streaming feature help you sell confidently and grow faster.
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <FaNetworkWired className="text-2xl text-blue-300" />
                    <h3 className="text-lg font-bold">Verified Network</h3>
                  </div>
                  <p className="text-sm text-white/80">Thousands of active B2B buyers</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <FaChartBar className="text-2xl text-green-300" />
                    <h3 className="text-lg font-bold">Transparent Process</h3>
                  </div>
                  <p className="text-sm text-white/80">Full visibility & real-time tracking</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <FaStream className="text-2xl text-purple-300" />
                    <h3 className="text-lg font-bold">Live Streaming</h3>
                  </div>
                  <p className="text-sm text-white/80">Showcase products in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                FAQs
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Get answers to common questions about selling on our platform.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-4">
                        <FaQuestionCircle className="text-lg" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Start Selling Today</h2>
              <p className="text-lg text-gray-600 mb-3">
                Ready to list your stock and reach verified business buyers?
              </p>
              <p className="text-base text-gray-700 mb-6">
                Register as a Seller – It's free and takes less than 2 minutes.
                Our team will verify your details and help you start selling your inventory immediately.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/sellerRegistration" 
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-base shadow-sm hover:bg-blue-700 transition-all"
                >
                  Register Now - It's Free
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg text-base hover:border-gray-400 hover:bg-gray-50 transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Registration Modal */}
        {showRegistration && (
          <SellerRegistrationForm 
            onClose={() => setShowRegistration(false)}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </div>
    // </Layout>
  );
};

export default SellersPage;