import React, { useState } from 'react';
import { FaCheck, FaChartLine, FaUsers, FaShieldAlt, FaPercentage, FaGlobe, FaTrophy, FaHandHoldingUsd, FaCamera, FaTag, FaShippingFast, FaMobile, FaDesktop, FaQuestionCircle, FaBook, FaVideo, FaHeadset } from 'react-icons/fa';
import { RiAuctionFill } from 'react-icons/ri';
import { MdAnalytics, MdInventory, MdPayment, MdSecurity } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const SellersPage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

 const [formData, setFormData] = useState({
  // Personal Information
  name: '',
  email: '',
  phone: '',
  dob: '',
  
  // Business Information
  businessType: 'individual',
  businessName: '',
  gstNumber: '',
  
  // Product Information
  itemsCategory: '',
  businessDescription: '',
  
  // KYC Verification
  panNumber: '',
  aadhaarNumber: '',
  panCard: null,
  aadhaarFront: null,
  aadhaarBack: null,
  
  // Bank Details
  accountHolderName: '',
  accountNumber: '',
  bankName: '',
  ifscCode: '',
  bankProof: null,
  
  // Terms
  agreeTerms: false
});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowRegistration(false);
    // Typically you would send this data to your backend
  };

  const benefits = [
    {
      icon: <FaUsers className="text-3xl mb-4 text-purple-600" />,
      title: "Global Audience",
      description: "Access millions of potential buyers from around the world"
    },
    {
      icon: <MdSecurity className="text-3xl mb-4 text-purple-600" />,
      title: "Secure Platform",
      description: "Advanced security measures and fraud protection for all transactions"
    },
    {
      icon: <FaShieldAlt className="text-3xl mb-4 text-purple-600" />,
      title: "Seller Protection",
      description: "Comprehensive seller protection policies and dispute resolution"
    },
    {
      icon: <FaChartLine className="text-3xl mb-4 text-purple-600" />,
      title: "Powerful Tools",
      description: "Analytics and marketing tools to maximize your sales potential"
    },
    {
      icon: <FaGlobe className="text-3xl mb-4 text-purple-600" />,
      title: "24/7 Support",
      description: "Dedicated support team available anytime you need assistance"
    },
    {
      icon: <FaHandHoldingUsd className="text-3xl mb-4 text-purple-600" />,
      title: "Fast Payouts",
      description: "Get paid quickly with multiple secure withdrawal options"
    },
    {
      icon: <FaTrophy className="text-3xl mb-4 text-purple-600" />,
      title: "Success Guarantee",
      description: "Proven track record with thousands of successful sellers"
    },
    {
      icon: <MdPayment className="text-3xl mb-4 text-purple-600" />,
      title: "Flexible Payments",
      description: "Accept multiple payment methods from buyers worldwide"
    },
    {
      icon: <FaDesktop className="text-3xl mb-4 text-purple-600" />,
      title: "Multi-Platform",
      description: "Manage your auctions from desktop, mobile, or tablet devices"
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
    },
    {
      quote: "The mobile app makes it so easy to manage my auctions while I'm traveling for business.",
      author: "David R., Electronics Seller",
      rating: 5
    },
    {
      quote: "Customer support is incredible - they helped me resolve a complex shipping issue in minutes.",
      author: "Emma K., Fashion Boutique Owner",
      rating: 5
    },
    {
      quote: "The analytics dashboard gives me insights I never had before. My sales strategy is now data-driven.",
      author: "James P., Sports Memorabilia Dealer",
      rating: 5
    }
  ];

  const categories = [
    "Art & Collectibles",
    "Jewelry & Watches",
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports Memorabilia",
    "Antiques",
    "Vehicles",
    "Toys & Games",
    "Other"
  ];

  const sellerTools = [
    {
      icon: <FaCamera className="text-3xl mb-4 text-purple-600" />,
      title: "Professional Photography",
      description: "AI-powered photo enhancement and background removal tools"
    },
    {
      icon: <MdAnalytics className="text-3xl mb-4 text-purple-600" />,
      title: "Advanced Analytics",
      description: "Track views, bids, and performance metrics in real-time"
    },
    {
      icon: <FaTag className="text-3xl mb-4 text-purple-600" />,
      title: "Smart Pricing",
      description: "AI-suggested starting prices based on market data"
    },
    {
      icon: <MdInventory className="text-3xl mb-4 text-purple-600" />,
      title: "Inventory Management",
      description: "Organize and track all your listings in one place"
    },
    {
      icon: <FaShippingFast className="text-3xl mb-4 text-purple-600" />,
      title: "Shipping Integration",
      description: "Connect with major carriers for automated shipping labels"
    },
    {
      icon: <FaMobile className="text-3xl mb-4 text-purple-600" />,
      title: "Mobile App",
      description: "Manage your auctions on-the-go with our mobile app"
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

  const sellerResources = [
    {
      icon: <FaBook className="text-3xl mb-4 text-purple-600" />,
      title: "Seller Handbook",
      description: "Comprehensive guide to maximizing your auction success"
    },
    {
      icon: <FaVideo className="text-3xl mb-4 text-purple-600" />,
      title: "Video Tutorials",
      description: "Step-by-step video guides for all platform features"
    },
    {
      icon: <FaHeadset className="text-3xl mb-4 text-purple-600" />,
      title: "Live Chat Support",
      description: "Get instant help from our seller success team"
    },
    {
      icon: <FaUsers className="text-3xl mb-4 text-purple-600" />,
      title: "Seller Community",
      description: "Connect with other sellers and share best practices"
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
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer 24/7 customer support, dedicated seller success managers, comprehensive guides, video tutorials, and an active seller community forum."
    },
    {
      question: "Can I sell internationally?",
      answer: "Yes! Our platform supports international selling with built-in currency conversion, international shipping options, and localized buyer experiences."
    }
  ];

  return (
     <Layout>
    <div className="seller-page bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <RiAuctionFill className="text-5xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sell With The World's Premier Auction Platform</h1>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful sellers reaching millions of passionate buyers worldwide.
              Whether you're a business or individual, we provide the tools and audience you need to maximize your profits.
            </p>
            <button 
              onClick={() => setShowRegistration(true)}
              className="bg-white text-purple-700 hover:bg-purple-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300"
            >
              Start Selling Today
            </button>
          </div>
        </div>
      </div>

      {/* Why Sell With Us Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've built the most seller-friendly auction platform with features designed to help you succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition">
                <div className="flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Selling Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started is quick and easy. Here's our simple 4-step process:
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-start mb-8">
                  <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create Your Seller Account</h3>
                    <p className="text-gray-600">Complete our simple registration process in minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-8">
                  <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Set Your Terms</h3>
                    <p className="text-gray-600">Choose starting price, auction duration, and shipping options.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start mb-8">
                  <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">List Your Items</h3>
                    <p className="text-gray-600">Add high-quality photos and detailed descriptions.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Watch the Bids Roll In</h3>
                    <p className="text-gray-600">We'll handle the auction and payment processing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Seller Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from sellers who've transformed their businesses with our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic mb-4">"{story.quote}"</p>
                <p className="font-medium text-gray-700">— {story.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller Tools Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Seller Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create compelling listings and manage your auctions efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellerTools.map((tool, index) => (
              <div key={index} className="bg-white p-8 rounded-xl text-center hover:shadow-lg transition">
                <div className="flex justify-center">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketplace Statistics */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Join a Thriving Marketplace</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects you with millions of buyers worldwide, creating endless opportunities for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketplaceStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller Resources */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Seller Resources & Support</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to your success with comprehensive resources and dedicated support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellerResources.map((resource, index) => (
              <div key={index} className="bg-white p-8 rounded-xl text-center hover:shadow-lg transition">
                <div className="flex justify-center">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                <p className="text-gray-600">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about selling on our platform.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start">
                    <FaQuestionCircle className="text-purple-600 mt-1 mr-4 flex-shrink-0" />
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
      <div className="py-16 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of successful sellers today. It takes just minutes to create your account and list your first item.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setShowRegistration(true)}
              className="bg-white text-purple-700 hover:bg-purple-100 font-bold py-3 px-8 rounded-full text-lg transition"
            >
              Register Now
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 font-bold py-3 px-8 rounded-full text-lg transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Seller Registration Modal */}
      {showRegistration && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Become a Seller</h3>
        <button 
          onClick={() => setShowRegistration(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Personal Information Section */}
          <div className="border-b pb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-1">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date of Birth*</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Type Section */}
          <div className="border-b pb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Business Information</h4>
            <div>
              <label className="block text-gray-700 mb-1">I am a*</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="individual"
                    checked={formData.businessType === 'individual'}
                    onChange={handleChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Individual Seller</span>
                </label>
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="business"
                    checked={formData.businessType === 'business'}
                    onChange={handleChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Business Account</span>
                </label>
              </div>
            </div>

            {formData.businessType === 'business' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Business Name*</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required={formData.businessType === 'business'}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="border-b pb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Product Information</h4>
            <div>
              <label className="block text-gray-700 mb-1">What types of items will you be selling?*</label>
              <select
                name="itemsCategory"
                value={formData.itemsCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Business Description*</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                placeholder="Describe your business and products..."
              />
            </div>
          </div>

          {/* KYC Verification Section */}
       <div>
  <label className="block text-gray-700 mb-1">PAN Number*</label>
  <input
    type="text"
    name="panNumber"
    value={formData.panNumber}
    onChange={handleChange}
    // className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
    //   errors.panNumber ? 'border-red-500' : ''
    // }`}
    placeholder="ABCDE1234F"
    required
  />
  {/* {errors.panNumber && (
    <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>
  )} */}
</div>

          {/* Bank Details Section */}
          <div className="border-b pb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Bank Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Account Holder Name*</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Account Number*</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-1">Bank Name*</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">IFSC Code*</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Cancelled Cheque/Passbook*</label>
              <input
                type="file"
                name="bankProof"
                // onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                accept="image/*,.pdf"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                I agree to the <a href="#" className="text-purple-600 hover:text-purple-500">Terms of Service</a>, 
                <a href="#" className="text-purple-600 hover:text-purple-500"> Seller Agreement</a>, and 
                <a href="#" className="text-purple-600 hover:text-purple-500"> Privacy Policy</a>*
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
      )}
    </div>
    </Layout>
  );
};

export default SellersPage;