import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiOutlineCube, HiOutlineShoppingCart } from 'react-icons/hi';
import { Link } from 'react-router-dom';
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

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200/60 p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-full bg-gray-100" />
      <div className="flex-1">
        <div className="h-4 w-28 bg-gray-100 rounded mb-1.5" />
        <div className="h-3 w-20 bg-gray-50 rounded" />
      </div>
    </div>
    <div className="flex gap-4 mb-5">
      <div className="flex-1 h-14 bg-gray-50 rounded-lg" />
      <div className="flex-1 h-14 bg-gray-50 rounded-lg" />
    </div>
    <div className="h-9 bg-gray-100 rounded-lg" />
  </div>
);

const AllSellersPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({ businessType: '', status: '', searchQuery: '' });
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 12
  });

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        setError(null);
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const resetFilters = () => {
    setFilters({ businessType: '', status: '', searchQuery: '' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (p: number) => {
    if (p > 0 && p <= pagination.totalPages) setPagination(prev => ({ ...prev, currentPage: p }));
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

  const filteredSellers = sellers.filter(s => {
    const q = filters.searchQuery.toLowerCase();
    const matchSearch = !q || s.vendor_name.toLowerCase().includes(q) || (s.business_name && s.business_name.toLowerCase().includes(q));
    const matchBiz = !filters.businessType || s.business_type === filters.businessType;
    const matchStatus = !filters.status || s.status === filters.status;
    return matchSearch && matchBiz && matchStatus;
  });

  const paginatedSellers = filteredSellers.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalPages: Math.max(1, Math.ceil(filteredSellers.length / prev.itemsPerPage)),
      totalItems: filteredSellers.length
    }));
  }, [filteredSellers.length, pagination.itemsPerPage]);

  const getInitials = (s: Seller) =>
    (s.business_name || s.vendor_name).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f7]" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="h-6 w-36 bg-gray-200 rounded mb-1 animate-pulse" />
          <div className="h-4 w-56 bg-gray-100 rounded mb-8 animate-pulse" />
          <div className="h-10 bg-white rounded-lg border border-gray-200/60 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="text-center max-w-sm mx-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Something went wrong</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 text-xs font-bold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sellers</h1>
          <p className="text-gray-400 text-xs mt-0.5">Browse trusted vendors and their products</p>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]" />
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder="Search sellers..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-600 transition"
          >
            <FaFilter className="text-[10px] text-gray-400" />
            Filters
            {showFilters ? <FaChevronUp className="text-[9px] text-gray-400" /> : <FaChevronDown className="text-[9px] text-gray-400" />}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                <select name="businessType" value={filters.businessType} onChange={handleFilterChange}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 outline-none transition">
                  {businessTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                <select name="status" value={filters.status} onChange={handleFilterChange}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 outline-none transition">
                  {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={resetFilters} className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition">
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Results Count ── */}
        <p className="text-xs text-gray-400 mb-4">
          {filteredSellers.length} seller{filteredSellers.length !== 1 ? 's' : ''}
        </p>

        {/* ── Cards Grid ── */}
        {paginatedSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedSellers.map(seller => (
              <div
                key={seller.vendor_id}
                className="bg-white rounded-xl border border-gray-200/60 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-5 flex flex-col"
              >
                {/* Top: avatar + name + status */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {seller.profile_picture ? (
                      <img
                        src={seller.profile_picture}
                        alt={seller.business_name || seller.vendor_name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500">{getInitials(seller)}</span>
                      </div>
                    )}
                  </div>
                  {/* Name & subtitle */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">
                      {seller.business_name || seller.vendor_name}
                    </h3>
                    <p className="text-[11px] text-gray-400 truncate">
                      {seller.business_name ? seller.vendor_name : seller.business_type || 'Seller'}
                    </p>
                  </div>
                  {/* Status badge */}
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      seller.vendor_active
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${seller.vendor_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {seller.vendor_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-[#f8f9fa] rounded-lg px-3 py-2.5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                      <HiOutlineCube className="text-[11px]" />
                      Total
                    </p>
                    <p className="text-lg font-extrabold text-gray-900 leading-none">{seller.total}</p>
                  </div>
                  <div className="flex-1 bg-[#f8f9fa] rounded-lg px-3 py-2.5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                      <HiOutlineShoppingCart className="text-[11px]" />
                      Active
                    </p>
                    <p className="text-lg font-extrabold text-emerald-600 leading-none">{seller.active_products}</p>
                  </div>
                </div>

                {/* Footer: member since + CTA */}
                <div className="mt-auto">
                  {seller.created_at && (
                    <p className="text-[10px] text-gray-400 mb-3">
                      Joined {formatDate(seller.created_at)}
                    </p>
                  )}
                  <Link
                    to={`/auctions?vendor_id=${seller.vendor_id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-900 hover:text-white transition-all duration-200"
                  >
                    View Products
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <HiOutlineCube className="text-2xl text-gray-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">No sellers found</h3>
            <p className="text-xs text-gray-400 mb-4 text-center max-w-xs">
              Try adjusting your search or filters.
            </p>
            <button onClick={resetFilters} className="px-4 py-2 text-xs font-bold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">
              Reset filters
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {filteredSellers.length > pagination.itemsPerPage && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:border hover:border-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                const tp = pagination.totalPages;
                if (tp <= 5) pageNum = i + 1;
                else if (pagination.currentPage <= 3) pageNum = i + 1;
                else if (pagination.currentPage >= tp - 2) pageNum = tp - 4 + i;
                else pageNum = pagination.currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition ${
                      pagination.currentPage === pageNum
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:bg-white hover:border hover:border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                <>
                  <span className="text-gray-400 text-xs px-0.5">…</span>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold text-gray-500 hover:bg-white hover:border hover:border-gray-200 transition"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:border hover:border-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellersPage;