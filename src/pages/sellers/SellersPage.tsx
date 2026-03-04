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

const BTN_GRAD = 'linear-gradient(to right, #FF6B3D, #FFB444)';

const SellersPage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
  }

  const benefits = [
    {
      icon: <FaUsers />,
      title: "Reach Verified B2B Buyers",
      description: "Connect with 10,000+ registered businesses actively sourcing bulk inventory."
    },
    {
      icon: <MdSecurity />,
      title: "Secure Transactions",
      description: "All payments are handled through trusted gateways with bank-level protection."
    },
    {
      icon: <FaShieldAlt />,
      title: "Flexible Selling Options",
      description: "Choose to Sell Now (Fixed Price) or Accept Offers for faster liquidation."
    },
    {
      icon: <FaChartLine />,
      title: "Commission-Based Platform",
      description: "No hidden fees — pay only a small commission on successful sales."
    }
  ];

  const sellerTools = [
    {
      icon: <FaCamera />,
      title: "Professional Photography",
      description: "AI-powered photo enhancement and background removal tools"
    },
    {
      icon: <MdAnalytics />,
      title: "Advanced Analytics",
      description: "Track views, offers, and performance metrics in real-time"
    },
    {
      icon: <FaTag />,
      title: "Smart Pricing",
      description: "AI-suggested starting prices based on market data"
    },
    {
      icon: <MdInventory />,
      title: "Inventory Management",
      description: "Organize and track all your listings in one place"
    }
  ];

  const marketplaceStats = [
    { number: "70+", label: "Verified Sellers", description: "Selling nationwide" },
    { number: "32+", label: "Cities covered", description: "Active Buyers and Sellers" },
    { number: "10L+", label: "Units Sold", description: "Through verified transactions" },
    { number: "1.5%", label: "Transaction charges", description: "Among India's lowest" }
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
      <div className="bg-white text-gray-900">
        {/* ─── Hero ─── */}
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto px-6 py-10 md:py-14 lg:py-16">
            <div className="max-w-3xl mx-auto text-center">
              {/* Overline label */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-px w-6 bg-gray-200" />
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">
                  For Verified Sellers
                </span>
                <span className="h-px w-6 bg-gray-200" />
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-gray-900 mb-4">
                Sell Your Inventory{' '}
                <span style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Direct to Buyers
                </span>
              </h1>

              <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto mb-8">
                Turn your unsold, returned, or excess stock into cash. SalesBid connects you with thousands of verified B2B buyers across India.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                <Link to="/sellerRegistration" className="px-7 py-3 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90" style={{ background: BTN_GRAD }}>
                  Start Selling Today
                </Link>
                <button className="px-7 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Why Choose Us ─── */}
        <section className="py-8 border-b border-gray-100 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-px w-5 bg-gray-300" />
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Why Choose Us</p>
                <span className="h-px w-5 bg-gray-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">The Ultimate Platform for Sellers</h2>
              <p className="text-gray-500 text-sm">We've built the most seller-friendly auction platform with features designed to help you succeed.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto">
              {/* Card 1: Spans 8 cols */}
              <div className="md:col-span-8 bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col items-start relative overflow-hidden group hover:border-orange-100 transition-colors min-h-[280px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110" />
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl text-white text-2xl mb-6 relative z-10 shadow-sm" style={{ background: BTN_GRAD }}>
                  {benefits[0].icon}
                </div>
                <div className="relative z-10 max-w-sm mt-auto">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefits[0].title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefits[0].description}</p>
                </div>
              </div>

              {/* Card 2: Spans 4 cols */}
              <div className="md:col-span-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col items-start relative overflow-hidden group hover:border-orange-100 transition-colors min-h-[280px]">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl text-white text-xl mb-6 relative z-10 shadow-sm" style={{ background: BTN_GRAD }}>
                  {benefits[1].icon}
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefits[1].title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefits[1].description}</p>
                </div>
              </div>

              {/* Card 3: Spans 4 cols */}
              <div className="md:col-span-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col items-start relative overflow-hidden group hover:border-orange-100 transition-colors min-h-[280px]">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl text-white text-xl mb-6 relative z-10 shadow-sm" style={{ background: BTN_GRAD }}>
                  {benefits[2].icon}
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefits[2].title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefits[2].description}</p>
                </div>
              </div>

              {/* Card 4: Spans 8 cols */}
              <div className="md:col-span-8 bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col items-start relative overflow-hidden group hover:border-orange-100 transition-colors min-h-[280px]">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-700 group-hover:scale-110" />
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl text-white text-2xl mb-6 relative z-10 shadow-sm md:ml-auto" style={{ background: BTN_GRAD }}>
                  {benefits[3].icon}
                </div>
                <div className="relative z-10 max-w-sm mt-auto md:ml-auto md:text-right">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefits[3].title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefits[3].description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── What Can You Sell (Compact) ─── */}
        <section className="py-8 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-px w-5 bg-gray-200" />
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Inventory Types</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">What Can You Sell on SalesBid</h2>
              </div>
              <p className="text-gray-500 text-sm max-w-sm text-right hidden md:block">
                We support every type of B2B inventory — from brand-new stock to decommissioned assets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { icon: <FaBox />, title: 'New Stock (Factory Fresh)', desc: 'Brand new, unused products from manufacturers.', ideal: 'Manufacturers, OEMs' },
                { icon: <FaWarehouse />, title: 'Excess or Overstock', desc: 'Unsold inventory sitting in warehouses.', ideal: 'Distributors, Wholesalers' },
                { icon: <FaRecycle />, title: 'Customer Returns', desc: 'Tested, working, and graded returned products.', ideal: 'Retailers, E-commerce Sellers' },
                { icon: <FaTools />, title: 'Refurbished Products', desc: 'Professionally repaired and restored items.', ideal: 'Refurbishers, Service Centers' },
                { icon: <FaBoxOpen />, title: 'Open-Box or Unboxed', desc: 'Unused but open packaging products.', ideal: 'E-commerce Returns, Sellers' },
                { icon: <FaIndustry />, title: 'Used Assets', desc: 'Used IT, industrial, or office equipment.', ideal: 'Corporates, Institutions' },
                { icon: <FaPallet />, title: 'Bulk & Pallet Lots', desc: 'Mixed products sold in large lots for resale.', ideal: 'Traders, Bulk Buyers' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-[1.25rem] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4 items-start group hover:border-orange-100 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)] transition-all h-full">
                  <div className="w-12 h-12 flex items-center justify-center rounded-[10px] text-white text-xl flex-shrink-0 shadow-sm transition-transform group-hover:scale-105" style={{ background: BTN_GRAD }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 flex flex-col w-full h-full">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1.5">{item.title}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4 flex-1">{item.desc}</p>
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none bg-gray-50 px-2.5 py-1.5 rounded-md inline-block">{item.ideal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How Selling Works (Compact Horizontal Steps) ─── */}
        <section className="py-8 border-b border-gray-100 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-8 block">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-5 bg-gray-300" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Process</p>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How Selling Works</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 relative">
              {/* Optional background connective line for horizontal row */}
              <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0" />

              {[
                { num: '01', icon: <FaUsers />, title: 'Register as a Seller', desc: 'Fill out a short form and complete KYC.' },
                { num: '02', icon: <FaBox />, title: 'List Your Stock', desc: 'Upload product details, images, and condition.' },
                { num: '03', icon: <FaChartLine />, title: 'Choose Method', desc: 'Set a fixed price or allow buyers to make offers.' },
                { num: '04', icon: <MdPayment />, title: 'Get Paid Securely', desc: 'We release funds to you securely after delivery.' },
              ].map((step, i) => (
                <div key={i} className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] relative z-10 group hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl text-white text-lg shadow-sm" style={{ background: BTN_GRAD }}>
                      {step.icon}
                    </div>
                    <span className="text-xl font-bold text-gray-100 tracking-tighter">Step {step.num}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Eligibility ─── */}
        <section className="py-8 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-5 bg-gray-200" />
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Eligibility</p>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Who Can Sell on SalesBid</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Manufacturers & OEMs',
                'Distributors & Wholesalers',
                'Retailers & E-commerce Sellers',
                'Liquidators & Stock Clearance Agents',
                'Service Centers & Refurbishers',
                'Corporates with Decommissioned Assets'
              ].map((role, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                    <FaCheckCircle className="text-[#FF6B3D] text-sm" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{role}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        {/* ─── Seller Tools ─── */}
        <section className="py-10 border-b border-gray-100 bg-gray-50 relative overflow-hidden">
          {/* Subtle background circle */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-50 rounded-l-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Sticky Left */}
              <div className="lg:w-1/3 lg:sticky lg:top-32">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="h-px w-5 bg-gray-300" />
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Seller Tools</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">Everything You Need to Succeed</h2>
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  Create compelling listings, manage inventory efficiently, and connect with serious buyers using our suite of professional seller tools.
                </p>
                <div className="hidden lg:flex items-center gap-3 text-sm font-semibold text-gray-900">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100">
                    <FaChartLine className="text-[#FF6B3D]" />
                  </div>
                  <span>Built for Scale</span>
                </div>
              </div>

              {/* Scrolling Right */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellerTools.map((tool, index) => (
                  <div key={index} className={`bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col items-start gap-5 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] ${index % 2 === 1 ? 'md:mt-12' : ''}`}>
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl text-white text-xl shadow-sm" style={{ background: BTN_GRAD }}>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Our Impact ─── */}
        <section className="py-10 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-px w-5 bg-gray-200" />
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Our Impact</p>
                <span className="h-px w-5 bg-gray-200" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Why Businesses Love SalesBid</h2>
              <p className="text-gray-500 text-base">Join the fastest growing B2B liquidation network in India.</p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-12 max-w-5xl mx-auto relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent before:h-px before:top-1/2 before:-translate-y-1/2 before:w-full before:hidden lg:before:block">
              {marketplaceStats.map((stat, index) => (
                <div key={index} className="text-center flex-1 relative z-10 bg-white lg:bg-transparent px-2 group">
                  <div className="text-6xl md:text-7xl font-bold mb-4 tracking-tighter opacity-90 group-hover:scale-105 transition-transform duration-500" style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {stat.number}
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-1 tracking-wide uppercase">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Trusted Partner ─── */}
        <section className="py-10 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <span className="h-px w-5 bg-gray-300" />
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Partnership</p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
                    Your Trusted <br/>Selling Partner
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-6">
                    We're not just a platform — we're your partner in turning stock into revenue.
                    Our verified network, transparent process, and live streaming feature help you sell confidently and grow faster.
                  </p>
                </div>

                <div className="flex-[1.2] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl text-white flex-shrink-0" style={{ background: BTN_GRAD }}>
                       <FaNetworkWired />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Verified Network</h3>
                      <p className="text-xs text-gray-500">Thousands of active B2B buyers globally.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl text-white flex-shrink-0" style={{ background: BTN_GRAD }}>
                       <FaChartBar />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Transparent</h3>
                      <p className="text-xs text-gray-500">Full visibility & real-time tracking.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex items-start gap-4 sm:col-span-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl text-white flex-shrink-0" style={{ background: BTN_GRAD }}>
                       <FaStream />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Live Streaming</h3>
                      <p className="text-xs text-gray-500">Showcase products in real-time to active buyers seamlessly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="bg-white py-10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center border border-gray-100 rounded-3xl p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-gray-50 relative overflow-hidden">
              {/* Subtle top glare */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">Ready to Start Selling?</h2>
              <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
                Register as a Seller — It's free and takes less than 2 minutes. Our team will verify your details and help you start liquidating inventory immediately.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/sellerRegistration" className="px-8 py-3.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5" style={{ background: BTN_GRAD }}>
                  Register Now — It's Free
                </Link>
                <button className="px-8 py-3.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-300 hover:bg-white transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>

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