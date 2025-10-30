import React, { useState, useEffect } from 'react';
import { FaSearch, FaRegHeart, FaHeart, FaFilter, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdVerified, MdBusiness, MdEmail, MdPhone, MdDateRange } from 'react-icons/md';
import { HiOutlineCube, HiOutlineShoppingCart, HiOutlineCheckCircle } from 'react-icons/hi';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

import axios from 'axios';
import sellerService from '@/services/sellerService';

interface Seller {
  vendor_id: number;
  vendor_name: string;
  email: string;
  phone_number: string;
  business_type: string;
  business_name: string;
  profile_picture: string | null;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  product_count: number;
  sold_products: number;
  vendor_active: boolean;
  active_products: number;
  inactive_products: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Seller[];
  message?: string;
  error?: string;
}

interface Filters {
  businessType: string;
  status: string;
  searchQuery: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const AllSellersPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    businessType: '',
    status: '',
    searchQuery: ''
  });
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        setError(null);
        debugger
        
        const response = await sellerService.getAllSellers();
        
        if (response.success) {
          setSellers(response.data);
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.count,
            totalPages: Math.ceil(response.data.count / prev.itemsPerPage)
          }));
        } else {
          throw new Error(response.data.message || 'Failed to fetch sellers');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const toggleFavorite = (sellerId: number) => {
    setFavorites(prev => 
      prev.includes(sellerId) 
        ? prev.filter(id => id !== sellerId) 
        : [...prev, sellerId]
    );
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      businessType: '',
      status: '',
      searchQuery: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const businessTypes = [
    { value: '', label: 'All Types' },
    { value: 'Individual', label: 'Individual' },
    { value: 'Business', label: 'Business' },
    { value: 'Dealer', label: 'Dealer' },
    { value: 'Gallery', label: 'Gallery' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'suspended': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter sellers based on search query and filters
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = filters.searchQuery 
      ? seller.vendor_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
        (seller.business_name && seller.business_name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      : true;
      
    const matchesBusinessType = filters.businessType 
      ? seller.business_type === filters.businessType 
      : true;
      
    const matchesStatus = filters.status 
      ? seller.status === filters.status 
      : true;
      
    return matchesSearch && matchesBusinessType && matchesStatus;
  });

  // Apply pagination to filtered results
  const paginatedSellers = filteredSellers.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  // Update total pages when filters change
  useEffect(() => {
    const filtered = sellers.filter(seller => {
      const matchesSearch = filters.searchQuery 
        ? seller.vendor_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
          (seller.business_name && seller.business_name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
        : true;
        
      const matchesBusinessType = filters.businessType 
        ? seller.business_type === filters.businessType 
        : true;
        
      const matchesStatus = filters.status 
        ? seller.status === filters.status 
        : true;
        
      return matchesSearch && matchesBusinessType && matchesStatus;
    });

    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(filtered.length / prev.itemsPerPage),
      totalItems: filtered.length
    }));
  }, [sellers, filters, pagination.itemsPerPage]);

  if (loading) {
    return (
      // <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-purple-100 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-purple-100 rounded"></div>
                  <div className="h-4 bg-purple-100 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      // </Layout>
    );
  }

  if (error) {
    return (
      // <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-rose-700">Error loading sellers: {error}</p>
              </div>
            </div>
          </div>
        </div>
      // </Layout>
    );
  }

  return (
    // <Layout>
      <div className="bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search by seller name or business..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 transition"
              >
                <FaFilter className="text-purple-500" />
                <span className="text-gray-700">Filters</span>
                {showFilters ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">Business Type</label>
                    <select
                      name="businessType"
                      value={filters.businessType}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                    >
                      {businessTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end justify-end">
                    <button 
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.currentPage * pagination.itemsPerPage, filteredSellers.length)}</span> of{' '}
              <span className="font-medium">{filteredSellers.length}</span> sellers
            </p>
          </div>

          {/* Sellers List */}
          <div className="space-y-3">
            {paginatedSellers.length > 0 ? (
              paginatedSellers.map((seller) => (
                <div
                  key={seller.vendor_id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition flex items-center p-3"
                >
                  {/* Logo / Avatar */}
                  <div className="flex-shrink-0">
                    {seller.profile_picture ? (
                      <img
                        src={seller.profile_picture}
                        alt={seller.business_name || seller.vendor_name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
                        {seller.business_name
                          ? seller.business_name.charAt(0).toUpperCase()
                          : seller.vendor_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 ml-3">
                    {/* Top Row: Name + Status */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {seller.business_name || seller.vendor_name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          seller.vendor_active === true
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {seller.vendor_active === true ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Vendor Name */}
                    <p className="text-xs text-gray-500">
                      Vendor:{" "}
                      <span className="font-medium text-gray-700">
                        {seller.vendor_name}
                      </span>
                    </p>

                    {/* Stats inline + View Auctions */}
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <HiOutlineCube className="text-purple-500 text-sm" />
                          {seller.total} total
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineShoppingCart className="text-emerald-500 text-sm" />
                          {seller.active_products} active
                        </span>
                        {/* <span className="flex items-center gap-1">
                          <HiOutlineCheckCircle className="text-blue-500 text-sm" />
                          {seller.sold_products} sold
                        </span> */}
                      </div>

                      {/* View Auctions Button at the end */}
                      <Link
                        to={`/auctions?vendor_id=${seller.vendor_id}`}
                        className="inline-flex items-center gap-2 text-slate-400 transition hover:text-sky-400"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        view auctions
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                <h3 className="text-sm font-medium text-gray-900">No sellers found</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <div className="mt-4">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredSellers.length > pagination.itemsPerPage && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-sm" />
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  const totalPages = pagination.totalPages;

                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-1 rounded border text-sm font-medium transition ${
                        pagination.currentPage === pageNum
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {pagination.totalPages > 5 &&
                  pagination.currentPage < pagination.totalPages - 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}

                {pagination.totalPages > 5 &&
                  pagination.currentPage < pagination.totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className={`px-4 py-1 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition ${
                      pagination.currentPage === pagination.totalPages
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : ''
                    }`}
                  >
                    {pagination.totalPages}
                  </button>
                )}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </nav>
            </div>
          )}
        </main>
      </div>
    // </Layout>
  );
};

export default AllSellersPage;