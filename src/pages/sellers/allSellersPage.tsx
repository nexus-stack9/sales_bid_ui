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

const BTN_GRAD = 'linear-gradient(to right, #FF6B3D, #FFB444)';

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-full bg-gray-100" />
      <div className="flex-1">
        <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
        <div className="h-3 w-24 bg-gray-50 rounded" />
      </div>
    </div>
    <div className="flex gap-4 mb-6">
      <div className="flex-1 h-14 bg-gray-50 rounded-xl" />
      <div className="flex-1 h-14 bg-gray-50 rounded-xl" />
    </div>
    <div className="h-10 bg-gray-100 rounded-lg" />
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
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="h-8 w-48 bg-gray-100 rounded mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-gray-50 rounded mb-10 animate-pulse" />
          <div className="h-12 bg-white rounded-xl border border-gray-100 mb-10 animate-pulse shadow-sm" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-sm mx-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100">
            <svg className="h-8 w-8 text-[#FF6B3D]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
            style={{ background: BTN_GRAD }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">

        {/* ── Header ── */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2">Verified Sellers</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Browse our network of trusted, KYC-verified liquidators, businesses, and galleries across India.
          </p>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder="Search by seller or business name..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B3D] transition-all outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-colors ${
              showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaFilter className={`text-xs ${showFilters ? 'text-white' : 'text-gray-400'}`} />
            Filters
            {showFilters ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Business Type</label>
                <select name="businessType" value={filters.businessType} onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B3D] outline-none transition">
                  {businessTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Account Status</label>
                <select name="status" value={filters.status} onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B3D] outline-none transition">
                  {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={resetFilters} className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-gray-900 border-l-2 pl-3" style={{ borderColor: '#FF6B3D' }}>
            {filteredSellers.length} verified seller{filteredSellers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Cards Grid ── */}
        {paginatedSellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSellers.map(seller => (
              <div
                key={seller.vendor_id}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 group"
              >
                {/* Top: avatar + name + status */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {seller.profile_picture ? (
                      <img
                        src={seller.profile_picture}
                        alt={seller.business_name || seller.vendor_name}
                        className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-400 tracking-wider flex items-center justify-center">
                          {getInitials(seller)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Name & subtitle */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate mb-0.5">
                      {seller.business_name || seller.vendor_name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {seller.business_name ? seller.vendor_name : seller.business_type || 'Seller'}
                    </p>
                  </div>
                  {/* Status badge */}
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      seller.vendor_active
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${seller.vendor_active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    {seller.vendor_active ? 'Verifed' : 'Offline'}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-3 mb-6">
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 flex flex-col justify-center border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <HiOutlineCube className="text-[#FF6B3D] text-sm" />
                      Listed
                    </p>
                    <p className="text-xl font-bold text-gray-900 leading-none">{seller.total}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 flex flex-col justify-center border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <HiOutlineShoppingCart className="text-[#FF6B3D] text-sm" />
                      Active
                    </p>
                    <p className="text-xl font-bold text-gray-900 leading-none">{seller.active_products}</p>
                  </div>
                </div>

                {/* Footer: member since + CTA */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <p className="text-[11px] font-medium text-gray-400">
                    Joined {seller.created_at ? formatDate(seller.created_at) : 'Recently'}
                  </p>
                  <Link
                    to={`/auctions?vendor_id=${seller.vendor_id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                    style={{ background: BTN_GRAD }}
                  >
                    View Lots
                    <FaChevronRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 border border-gray-100 bg-gray-50/50 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
              <HiOutlineCube className="text-2xl text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Verified Sellers Found</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-sm leading-relaxed">
              We couldn't find any sellers matching your current filters or search terms.
            </p>
            <button 
              onClick={resetFilters} 
              className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ background: BTN_GRAD }}
            >
              Clear Filters
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