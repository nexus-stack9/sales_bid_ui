import React, { useState } from 'react';
import { FaSearch, FaStar, FaRegStar, FaRegHeart, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { RiAuctionFill } from 'react-icons/ri';
import { MdVerified, MdLocationOn } from 'react-icons/md';
import Layout from '@/components/layout/Layout';


const AllSellersPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    rating: null,
    location: '',
    verifiedOnly: false
  });
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (sellerId) => {
    if (favorites.includes(sellerId)) {
      setFavorites(favorites.filter(id => id !== sellerId));
    } else {
      setFavorites([...favorites, sellerId]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      rating: null,
      location: '',
      verifiedOnly: false
    });
  };

  // Mock seller data
  const sellers = [
    {
      id: 1,
      name: "Elite Collectibles",
      verified: true,
      rating: 4.8,
      reviewCount: 247,
      location: "New York, USA",
      categories: ["Art", "Antiques", "Collectibles"],
      itemsListed: 142,
      joinedDate: "2015",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Timepiece Treasures",
      verified: true,
      rating: 4.9,
      reviewCount: 183,
      location: "Geneva, Switzerland",
      categories: ["Watches", "Jewelry"],
      itemsListed: 89,
      joinedDate: "2017",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Vintage Motors",
      verified: false,
      rating: 4.5,
      reviewCount: 112,
      location: "Los Angeles, USA",
      categories: ["Automobiles", "Memorabilia"],
      itemsListed: 56,
      joinedDate: "2019",
      image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      name: "Artisan Gallery",
      verified: true,
      rating: 4.7,
      reviewCount: 98,
      location: "Paris, France",
      categories: ["Art", "Sculptures"],
      itemsListed: 203,
      joinedDate: "2014",
      image: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 5,
      name: "Jewel Box",
      verified: true,
      rating: 4.6,
      reviewCount: 156,
      location: "London, UK",
      categories: ["Jewelry", "Luxury"],
      itemsListed: 178,
      joinedDate: "2016",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 6,
      name: "Sports Legends",
      verified: false,
      rating: 4.3,
      reviewCount: 67,
      location: "Chicago, USA",
      categories: ["Sports Memorabilia"],
      itemsListed: 42,
      joinedDate: "2020",
      image: "https://images.unsplash.com/photo-1543357486-c250e88b4d16?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const categories = [
    "All Categories",
    "Art",
    "Antiques",
    "Collectibles",
    "Watches",
    "Jewelry",
    "Automobiles",
    "Memorabilia",
    "Sculptures",
    "Luxury",
    "Sports Memorabilia"
  ];

  const locations = [
    "All Locations",
    "North America",
    "Europe",
    "Asia",
    "Australia",
    "Africa",
    "South America"
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <Layout>
    <div className="all-sellers-page bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <RiAuctionFill className="text-3xl" />
              <h1 className="text-2xl font-bold">BidMaster Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-purple-200 transition">
                For Buyers
              </button>
              <button className="text-white hover:text-purple-200 transition">
                For Sellers
              </button>
              <button className="bg-white text-purple-700 px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse All Sellers</h1>
          <p className="text-gray-600">
            Discover trusted sellers from around the world offering unique items
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search sellers by name or specialty..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
            >
              <FaFilter />
              <span>Filters</span>
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Minimum Rating</label>
                  <select
                    name="rating"
                    value={filters.rating || ''}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Location</label>
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="verifiedOnly"
                      checked={filters.verifiedOnly}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Verified Only</span>
                  </label>
                  <button 
                    onClick={resetFilters}
                    className="ml-auto text-purple-600 hover:text-purple-800 text-sm"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map(seller => (
            <div key={seller.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative">
                <div className="h-40 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                <div className="absolute -bottom-12 left-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden">
                    <img 
                      src={seller.image} 
                      alt={seller.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => toggleFavorite(seller.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${favorites.includes(seller.id) ? 'text-red-500 bg-white' : 'text-gray-400 bg-white'}`}
                >
                  <FaRegHeart className={favorites.includes(seller.id) ? 'fill-current' : ''} />
                </button>
              </div>
              
              <div className="pt-14 px-4 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold flex items-center">
                    {seller.name}
                    {seller.verified && <MdVerified className="text-blue-500 ml-1" />}
                  </h2>
                  <div className="flex items-center">
                    {renderStars(seller.rating)}
                    <span className="ml-1 text-gray-600 text-sm">{seller.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MdLocationOn className="mr-1" />
                  <span>{seller.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {seller.categories.map((category, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
                  <span>{seller.itemsListed} items listed</span>
                  <span>Member since {seller.joinedDate}</span>
                </div>
                
                <div className="mt-4">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
                    View Seller's Items
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-purple-600 text-white">
              1
            </button>
            <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100">
              3
            </button>
            <span className="px-2">...</span>
            <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100">
              8
            </button>
            <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100">
              Next
            </button>
          </nav>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <RiAuctionFill className="text-2xl" />
                <h3 className="text-xl font-bold">BidMaster Pro</h3>
              </div>
              <p className="text-gray-400">
                The world's premier online auction platform connecting buyers and sellers of unique items.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">How to Buy</a></li>
                <li><a href="#" className="hover:text-white transition">Buyer Protection</a></li>
                <li><a href="#" className="hover:text-white transition">Bidding Tips</a></li>
                <li><a href="#" className="hover:text-white transition">Payment Options</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">How to Sell</a></li>
                <li><a href="#" className="hover:text-white transition">Seller Fees</a></li>
                <li><a href="#" className="hover:text-white transition">Seller Tools</a></li>
                <li><a href="#" className="hover:text-white transition">Seller Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>© 2023 BidMaster Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </Layout>
  );
};

export default AllSellersPage;