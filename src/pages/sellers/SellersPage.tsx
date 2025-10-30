import React, { useState } from 'react';
import { 
  FaChartLine, FaUsers, FaShieldAlt, FaPercentage, FaGlobe, 
  FaTrophy, FaHandHoldingUsd, FaCamera, FaTag, FaShippingFast, 
  FaMobile, FaDesktop, FaQuestionCircle, FaBook, FaVideo, FaHeadset 
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
      title: "Global Audience",
      description: "Access millions of potential buyers from around the world"
    },
    {
      icon: <MdSecurity className="text-3xl mb-4 text-blue-600" />,
      title: "Secure Platform",
      description: "Advanced security measures and fraud protection for all transactions"
    },
    {
      icon: <FaShieldAlt className="text-3xl mb-4 text-blue-600" />,
      title: "Seller Protection",
      description: "Comprehensive seller protection policies and dispute resolution"
    },
    {
      icon: <FaChartLine className="text-3xl mb-4 text-blue-600" />,
      title: "Powerful Tools",
      description: "Analytics and marketing tools to maximize your sales potential"
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
      number: "2.5M+",
      label: "Active Buyers",
      description: "Registered users actively bidding"
    },
    {
      number: "150K+",
      label: "Successful Sellers",
      description: "Sellers earning regular income"
    },
    {
      number: "$500M+",
      label: "Total Sales Volume",
      description: "Processed through our platform"
    },
    {
      number: "99.8%",
      label: "Success Rate",
      description: "Successful transaction completion"
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
                Sell With The World's <span className="text-blue-300">Premier</span> Auction Platform
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join thousands of successful sellers reaching millions of passionate buyers worldwide.
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
        <div className="py-20 bg-white">
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

        {/* How It Works Section */}
        <div className="py-20 bg-gray-50 relative">
  <div className="container mx-auto px-4 relative">
    <div className="text-center mb-16">
      <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
        GET STARTED
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">How Selling Works</h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Getting started is quick and easy. Here's our simple 4-step process:
      </p>
    </div>
    
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-8 md:left-1/2 h-full w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="relative flex items-center">
            <div className="flex-shrink-0 z-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
              1
            </div>
            <div className="ml-8 md:absolute md:w-5/12 bg-white p-6 rounded-lg shadow-md border border-gray-100 md:left-1/2 md:ml-12">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Create Your Seller Account</h3>
              <p className="text-gray-600">Complete our simple registration process in minutes.</p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative flex items-center justify-end">
            <div className="flex-shrink-0 z-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg order-1 md:order-none">
              2
            </div>
            <div className="mr-8 md:absolute md:w-5/12 bg-white p-6 rounded-lg shadow-md border border-gray-100 md:right-1/2 md:mr-12 text-right">
              <h3 className="text-xl font-bold mb-2 text-blue-700">List Your Items</h3>
              <p className="text-gray-600">Add high-quality photos and detailed descriptions.</p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative flex items-center">
            <div className="flex-shrink-0 z-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
              3
            </div>
            <div className="ml-8 md:absolute md:w-5/12 bg-white p-6 rounded-lg shadow-md border border-gray-100 md:left-1/2 md:ml-12">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Set Your Terms</h3>
              <p className="text-gray-600">Choose starting price, auction duration, and shipping options.</p>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="relative flex items-center justify-end">
            <div className="flex-shrink-0 z-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg order-1 md:order-none">
              4
            </div>
            <div className="mr-8 md:absolute md:w-5/12 bg-white p-6 rounded-lg shadow-md border border-gray-100 md:right-1/2 md:mr-12 text-right">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Watch the Bids Roll In</h3>
              <p className="text-gray-600">We'll handle the auction and payment processing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Success Stories */}
        <div className="py-20 bg-white">
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
        </div>

        {/* Seller Tools Section */}
        <div className="py-20 bg-gray-50">
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
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                OUR IMPACT
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join a Thriving Marketplace</h2>
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

        {/* FAQ Section */}
        <div className="py-20 bg-gray-50">
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
        </div>

        {/* CTA Section */}
      <div className="relative bg-gray-100 text-gray-900 overflow-hidden">
  <div className="absolute inset-0 opacity-20">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-transparent w-1/3"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
  </div>
  
  <div className="container mx-auto px-4 py-20 relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Selling?</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto opacity-80">
        Join our community of successful sellers today. It takes just minutes to create your account.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          to="/sellerRegistration" 
          className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:bg-gray-50"
        >
          Register Now
        </Link>
        <button className="border-2 border-gray-900 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-900 hover:text-white transition-all">
          Contact Sales
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