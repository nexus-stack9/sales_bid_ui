import React, { useState } from 'react';
import { FaGavel, FaShieldAlt, FaShippingFast, FaRegHeart, FaHeart, FaRegCreditCard, FaSearch, FaHandshake, FaLock } from 'react-icons/fa';
import { RiAuctionFill } from 'react-icons/ri';
import { MdVerified, MdOutlineSupportAgent } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const BTN_GRAD = 'linear-gradient(to right, #FF6B3D, #FFB444)';
const STEP_ACCENT = 'linear-gradient(to right, #FF6B3D, #FFB444)';

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
  role: string;
  initials: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  notifications: boolean;
}



const stats = [
  { value: '10,000+', label: 'Active Buyers' },
  { value: '500+',    label: 'Verified Sellers' },
  { value: '₹50Cr+', label: 'Transacted' },
  { value: '98%',     label: 'Satisfaction Rate' },
];

const BuyersPage = () => {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', password: '', agreeTerms: false, notifications: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegisterModal(false);
  };

  const handleCategoryClick = (id: number) => navigate('/auctions', { state: { categoryId: id } });

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const benefits: Benefit[] = [
    { icon: <FaGavel />,               title: 'Exclusive Listings',  description: 'Access bulk inventory and rare lots unavailable in any other B2B market.' },
    { icon: <FaShieldAlt />,           title: 'Buyer Protection',    description: 'Every transaction is escrow-backed with a full money-back guarantee.' },
    { icon: <FaShippingFast />,        title: 'Pan-India Shipping',  description: 'Reliable logistics partners ensure on-time bulk delivery across all states.' },
    { icon: <MdVerified />,            title: 'Verified Sellers',    description: 'Every seller passes strict KYC verification before listing on our platform.' },
    { icon: <FaRegCreditCard />,       title: 'Flexible Payments',   description: 'Bank transfer, UPI, or credit — choose what works for your business cycle.' },
    { icon: <MdOutlineSupportAgent />, title: 'Dedicated Support',   description: 'Sourcing specialists available to guide every step of the procurement process.' },
  ];

  const allCategories: Category[] = [
    { id: 1, name: 'Fine Art',       count: '1,240+ items', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Luxury Watches', count: '850+ items',   image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Collectibles',   count: '3,560+ items', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Jewelry',        count: '2,130+ items', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Antiques',       count: '1,780+ items', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80' },
    { id: 6, name: 'Vintage Cars',   count: '320+ items',   image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=800&q=80' },
    { id: 7, name: 'Electronics',    count: '2,450+ items', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
    { id: 8, name: 'Fashion',        count: '3,210+ items', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80' },
    { id: 9, name: 'Home Decor',     count: '1,870+ items', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  ];

  const displayed = showAllCategories ? allCategories : allCategories.slice(0, 6);

  const testimonials: Testimonial[] = [
    { quote: 'I found a rare vintage watch I had been searching for years. The authentication process gave me complete peace of mind.', author: 'David R.', role: 'Watch Collector', initials: 'DR' },
    { quote: 'As a first-time bidder I was nervous, but the platform made it effortless. Won my first auction at a fantastic price.', author: 'Sophia K.', role: 'New Buyer', initials: 'SK' },
    { quote: "Buyer protection saved me when an item wasn't as described. The team handled everything professionally and promptly.", author: 'Michael T.', role: 'Frequent Bidder', initials: 'MT' },
  ];

  const steps = [
    { num: '01', icon: <FaSearch />,      title: 'Register',    desc: 'Create your free account with quick KYC verification.' },
    { num: '02', icon: <RiAuctionFill />, title: 'Browse',      desc: 'Explore verified listings across categories and bulk lots.' },
    { num: '03', icon: <FaHandshake />,   title: 'Place Offer', desc: 'Submit competitive bids or use Buy Now for instant procurement.' },
    { num: '04', icon: <FaLock />,        title: 'Win & Pay',   desc: 'Secure inventory and complete payment via our escrow system.' },
  ];

  return (
    <div className="bg-white text-gray-900">

      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-10 md:py-14">
          <div className="max-w-3xl mx-auto text-center">

            {/* Overline label */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-6 bg-gray-200" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">
                India's B2B Liquidation Marketplace
              </span>
              <span className="h-px w-6 bg-gray-200" />
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-gray-900 mb-4">
              Source Wholesale Inventory{' '}
              <span style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                with Confidence
              </span>
            </h1>

            <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto mb-8">
              Connect with verified sellers. Source surplus, salvage, and returned inventory from India's top retailers — at competitive prices.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-7 py-3 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
                style={{ background: BTN_GRAD }}
              >
                Start Buying Free
              </button>
              <button
                onClick={() => navigate('/auctions')}
                className="px-7 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
              >
                Browse Listings
              </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {stats.map((s, i) => (
                <div key={i} className="bg-gray-50 px-5 py-4 text-center">
                  <div className="text-lg font-semibold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-5 bg-gray-200" />
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Why Choose Us</p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Built for serious buyers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col items-start gap-4 h-full">
                {/* Gradient Icon Square */}
                <div className="w-10 h-10 flex items-center justify-center rounded-xl text-white text-lg" style={{ background: BTN_GRAD }}>
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{b.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-5 bg-gray-300" />
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Categories</p>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Browse by category</h2>
            </div>
            <button
              onClick={() => navigate('/auctions')}
              className="hidden md:block text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-4"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((cat) => (
              <div
                key={cat.id}
                className="group relative overflow-hidden rounded-xl h-52 cursor-pointer bg-gray-100"
                onClick={() => handleCategoryClick(cat.id)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                    {/* Pill count with brand gradient underline */}
                    <p className="text-white/50 text-xs mt-1">{cat.count}</p>
                  </div>
                  <button
                    className="text-white/60 hover:text-red-400 transition-colors duration-200 p-1"
                    onClick={(e) => toggleFavorite(e, cat.id)}
                  >
                    {favorites.has(cat.id) ? <FaHeart className="text-red-400 text-sm" /> : <FaRegHeart className="text-sm" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors duration-200"
            >
              {showAllCategories ? 'Show less' : 'Show all categories'}
            </button>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-5 bg-gray-200" />
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Process</p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">How buying works</h2>
            <p className="text-gray-400 text-sm mt-2">Start sourcing in four simple steps — no experience required.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Ambient connecting line (desktop) */}
            <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-px bg-gray-100" />

            {steps.map((step, i) => (
              <div key={i} className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] h-full">
                {/* Gradient left accent line for visual structure */}
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg opacity-50" style={{ background: BTN_GRAD }} />
                
                <div className="flex items-center gap-4 mb-4 relative z-10 pl-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0" style={{ background: BTN_GRAD }}>
                    {step.icon}
                  </div>
                  <span className="text-sm font-bold tracking-widest text-gray-200">
                    {step.num}
                  </span>
                </div>
                
                <div className="pl-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-5 bg-gray-200" />
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">Testimonials</p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Trusted by buyers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-shadow duration-200 flex flex-col">
                {/* Quote accent */}
                <div className="w-5 h-0.5 mb-4 rounded-full bg-gray-200" />
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-[#1a4b8c]/10 flex items-center justify-center text-[#1a4b8c] text-xs font-semibold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Decorative gradient line */}
            <div className="w-10 h-0.5 mx-auto mb-6 rounded-full bg-gray-200" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Ready to start sourcing?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Join thousands of businesses finding quality bulk inventory at competitive prices across India.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-7 py-3 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
                style={{ background: BTN_GRAD }}
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate('/auctions')}
                className="px-7 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
              >
                Browse Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Registration Modal ─── */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            {/* Gradient top bar */}
            <div className="h-1 w-full bg-[#1a4b8c]" />

            <div className="px-7 pt-6 pb-7">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RiAuctionFill className="text-[#FF6B3D] text-base" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">SalesBid</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Create your buyer account</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Free to join — no credit card required</p>
                </div>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="text-gray-300 hover:text-gray-600 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Full Name',      name: 'name',     type: 'text',     placeholder: 'Rahul Sharma' },
                  { label: 'Email Address',  name: 'email',    type: 'email',    placeholder: 'you@company.com' },
                  { label: 'Password',       name: 'password', type: 'password', placeholder: 'Min. 8 characters' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {field.label} *
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof FormData] as string}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B3D] outline-none transition-all"
                      required
                    />
                  </div>
                ))}

                <div className="space-y-3 pt-1">
                  {[
                    { id: 'notifications', name: 'notifications', checked: formData.notifications, label: 'Receive listing alerts and market updates', required: false },
                    { id: 'agreeTerms',    name: 'agreeTerms',    checked: formData.agreeTerms,    label: 'I agree to the Terms of Service and Privacy Policy *', required: true },
                  ].map((cb) => (
                    <div key={cb.id} className="flex items-start gap-3">
                      <input
                        id={cb.id} name={cb.name} type="checkbox"
                        checked={cb.checked} onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                        required={cb.required}
                      />
                      <label htmlFor={cb.id} className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                        {cb.label}
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: BTN_GRAD }}
                >
                  Create Account
                </button>

                <p className="text-center text-xs text-gray-400">
                  Already have an account?{' '}
                  <a href="#" className="font-semibold text-[#1a4b8c] hover:underline">Sign In</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyersPage;