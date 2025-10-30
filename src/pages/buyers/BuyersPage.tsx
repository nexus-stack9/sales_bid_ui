import React, { useState } from 'react';
import { FaGavel, FaShieldAlt, FaShippingFast, FaRegHeart, FaRegCreditCard } from 'react-icons/fa';
import { RiAuctionFill } from 'react-icons/ri';
import { MdVerified, MdOutlineSupportAgent } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

interface Category {
  id: number;
  name: string;
  count: string;
  image: string;
}

interface Benefit {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  author: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  notifications: boolean;
}

const BuyersPage = () => {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
    notifications: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowRegisterModal(false);
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate('/auctions', { state: { categoryId } });
  };

  const toggleViewAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleFavoriteClick = (e: React.MouseEvent, categoryId: number) => {
    e.stopPropagation();
    console.log('Favorite clicked for category:', categoryId);
    // Add your favorite logic here
  };


  const benefits: Benefit[] = [
    {
      icon: <FaGavel className="text-3xl mb-4 text-blue-600" />,
      title: "Exclusive Auctions",
      description: "Access rare and unique items you won't find anywhere else"
    },
    {
      icon: <FaShieldAlt className="text-3xl mb-4 text-blue-600" />,
      title: "Buyer Protection",
      description: "Secure transactions with our money-back guarantee"
    },
    {
      icon: <FaShippingFast className="text-3xl mb-4 text-blue-600" />,
      title: "Global Shipping",
      description: "Items delivered worldwide from trusted sellers"
    },
    {
      icon: <MdVerified className="text-3xl mb-4 text-blue-600" />,
      title: "Verified Sellers",
      description: "Shop with confidence from our vetted community"
    },
    {
      icon: <FaRegCreditCard className="text-3xl mb-4 text-blue-600" />,
      title: "Flexible Payments",
      description: "Multiple payment options including installment plans"
    },
    {
      icon: <MdOutlineSupportAgent className="text-3xl mb-4 text-blue-600" />,
      title: "Dedicated Support",
      description: "24/7 assistance for all your bidding needs"
    }
  ];

 
  const allCategories: Category[] = [
    { id: 1, name: "Fine Art", count: "1,240+ items", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Luxury Watches", count: "850+ items", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Collectibles", count: "3,560+ items", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Jewelry", count: "2,130+ items", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Antiques", count: "1,780+ items", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Vintage Cars", count: "320+ items", image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 7, name: "Electronics", count: "2,450+ items", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 8, name: "Fashion", count: "3,210+ items", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 9, name: "Home Decor", count: "1,870+ items", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
  ];

  const featuredCategories = allCategories.slice(0, 6);
  const displayedCategories = showAllCategories ? allCategories : featuredCategories;

  const testimonials: Testimonial[] = [
    {
      quote: "I found a rare vintage watch I'd been searching for years. The authentication process gave me complete peace of mind.",
      author: "David R., Watch Collector"
    },
    {
      quote: "As a first-time bidder, I was nervous but the platform made it so easy. Won my first auction and got a fantastic deal!",
      author: "Sophia K., New Buyer"
    },
    {
      quote: "The buyer protection saved me when an item wasn't as described. The team handled everything professionally.",
      author: "Michael T., Frequent Bidder"
    }
  ];

  return (
    // <Layout>
      <div className="buyers-page bg-gray-50">
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
                Discover <span className="text-blue-300">Extraordinary</span> Finds at Auction
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join millions of buyers in the world's most exciting online auctions. 
                From rare collectibles to luxury items, find exactly what you're looking for.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-white text-blue-700 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition"
                >
                  Join Free
                </button>
                <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white hover:bg-opacity-10 transition">
                  How It Works
                </button>
              </div>
            </div>
          </div>
          

        </div>

        {/* Benefits Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                WHY CHOOSE US
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Buy at Auction?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Our platform offers unique advantages you won't find in traditional marketplaces
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-md transition">
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

        {/* Categories Section */}
              <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                BROWSE CATEGORIES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Browse thousands of items across our most popular categories
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="relative overflow-hidden rounded-2xl shadow-md h-64 cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <p>{category.count} available</p>
                  </div>
                  <button 
                    className="absolute top-4 right-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition"
                    onClick={(e) => handleFavoriteClick(e, category.id)}
                  >
                    <FaRegHeart />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <button 
                className={`border-2 border-blue-600 font-bold py-3 px-8 rounded-full transition ${
                  showAllCategories 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
                onClick={toggleViewAllCategories}
              >
                {showAllCategories ? 'Show Less Categories' : 'View All Categories'}
              </button>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                GET STARTED
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Buying Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Getting started is easy. Follow these simple steps to begin bidding
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">1</div>
                  <h3 className="text-xl font-bold mb-3">Register</h3>
                  <p className="text-gray-600">Create your free account in minutes</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">2</div>
                  <h3 className="text-xl font-bold mb-3">Browse</h3>
                  <p className="text-gray-600">Find items you love across categories</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">3</div>
                  <h3 className="text-xl font-bold mb-3">Bid</h3>
                  <p className="text-gray-600">Place your bids or use Buy It Now</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">4</div>
                  <h3 className="text-xl font-bold mb-3">Win & Pay</h3>
                  <p className="text-gray-600">Secure your item and complete payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Buyers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Hear from our community of satisfied buyers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-md transition">
                  <div className="text-blue-600 mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                  <p className="font-medium text-gray-700">— {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gray-100 text-gray-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-transparent w-1/3"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Bidding?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-80">
              Join millions of buyers finding extraordinary items at amazing prices
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-lg transition border border-gray-200 hover:bg-gray-50"
              >
                Register Free
              </button>
              <button className="border-2 border-gray-900 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-900 hover:text-white transition">
                Browse Auctions
              </button>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Create Your Buyer Account</h3>
                  <button 
                    onClick={() => setShowRegisterModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Create Password*</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications"
                          name="notifications"
                          type="checkbox"
                          checked={formData.notifications}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications" className="font-medium text-gray-700">
                          Receive auction notifications and updates
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                          I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>*
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
                    >
                      Create Account
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center text-sm">
                    <p>Already have an account? <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Sign In</a></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    // </Layout>
  );
};

export default BuyersPage;