import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from "./ProductDetailPage.module.css";
import Tooltip from '@/components/Tooltip/Tooltip';
import Layout from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import fridgeWebp from "@/assets/fridge.webp";
import { FaGavel, FaMapMarkerAlt, FaTag, FaShieldAlt, FaClock } from 'react-icons/fa';
import { Heart, Share2 } from 'lucide-react';
import { addToWishlist, removeFromWishlist, getUserIdFromToken, checkWishlistItem } from "@/services/crudService";
import WebSocketService, { WebSocketMessage } from "@/services/WebsocketService";
import BidModal from "./user/BidModal";
import { useWishlist } from "@/hooks/use-wishlist";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  
  // Product data state
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const webSocketService = React.useMemo(() => WebSocketService, []);
  
  // UI state
  const [activeTab, setActiveTab] = useState("description");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(null);
  const [selectedImage, setSelectedImage] = useState(fridgeWebp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);
  const { triggerWishlistUpdate } = useWishlist();
  const [images, setImages] = useState([]);

  const [showBidModal, setShowBidModal] = useState(false);
  
  // Hide bottom navbar on mobile when BidModal is open
  useEffect(() => {
    if (showBidModal) {
      document.body.classList.add('bid-open');
    } else {
      document.body.classList.remove('bid-open');
    }
    return () => {
      document.body.classList.remove('bid-open');
    };
  }, [showBidModal]);
// Get the API base URL from environment variables and extract the host:port part for WebSocket
// Prefer explicit websocket URL if provided, else derive from API base URL
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL).replace(/^https?:\/\//, '');

  // Static manifest data
  const [manifestData] = useState([
    {
      lotId: "3284U",
      manufacturer: "Mirooka",
      model: "E1ET2/200MV",
      itemNumber: "485104276",
      description: "27 inch electric vertical laundry...",
      quantity: 1,
      unitRetail: 2349.0 * 85,
      unitWeight: "346 lbs",
      condition: "Used Good",
      category: "Electronics"
    },
    {
      lotId: "3284U",
      manufacturer: "Mirooka",
      model: "E1ET2/400MT",
      itemNumber: "485107514",
      description: "27 inch electric vertical laundry...",
      quantity: 1,
      unitRetail: 3049.0 * 85,
      unitWeight: "346 lbs",
      condition: "Used Good",
      category: "Electronics"
    },
  ]);

  useEffect(() => {
    if (productData?.image_path) {
      const imageUrls = productData.image_path.split(',').map(url => url.trim());
      const formattedImages = imageUrls.map((url, index) => ({
        src: url,
        alt: `${productData.name} Image ${index + 1}`
      }));
      
      setImages(formattedImages);
      if (formattedImages.length > 0) {
        setSelectedImage(formattedImages[0].src);
      }
    }
  }, [productData]);

  // Check wishlist status on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId || !productId) {
          setIsCheckingWishlist(false);
          return;
        }

        const isInWishlist = await checkWishlistItem(productId, userId);
        setIsInWishlist(isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      } finally {
        setIsCheckingWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [productId]);

  // WebSocket connection setup with proper cleanup
  useEffect(() => {
    if (!productId) {
      toast.error('Product ID not found');
      navigate('/');
      return;
    }

    const handleWebSocketMessage = (message: WebSocketMessage) => {
      if (message.type === 'product_update' && message.data) {
        setProductData(message.data);
        setLoading(false);
        setConnectionError(false);
      }
    };

    // Connect to WebSocket
    webSocketService.connect(productId, handleWebSocketMessage);

    // Cleanup on component unmount or productId change
    return () => {
      webSocketService.disconnect();
      console.log(`Cleaning up WebSocket for product ${productId}`);
    };
  }, [productId, navigate, webSocketService]);

  // Timer for auction countdown
  useEffect(() => {
    if (!productData?.auction_end) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(productData.auction_end).getTime();
      const difference = endTime - now;
      
      if (difference > 0) {
        setTimeRemaining(Math.floor(difference / 1000));
      } else {
        setTimeRemaining(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, [productData?.auction_end]);

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatCountdown = (seconds: number): JSX.Element => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex flex-col items-center">
          <div className="bg-white text-gray-800 font-bold rounded-lg p-2 min-w-[40px] text-center shadow-sm">
            {days.toString().padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-500 mt-1">Days</span>
        </div>
        <div className="text-gray-500 font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-white text-gray-800 font-bold rounded-lg p-2 min-w-[40px] text-center shadow-sm">
            {hours.toString().padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-500 mt-1">Hours</span>
        </div>
        <div className="text-gray-500 font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-white text-gray-800 font-bold rounded-lg p-2 min-w-[40px] text-center shadow-sm">
            {mins.toString().padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-500 mt-1">Mins</span>
        </div>
        <div className="text-gray-500 font-bold">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-white text-gray-800 font-bold rounded-lg p-2 min-w-[40px] text-center shadow-sm">
            {secs.toString().padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-500 mt-1">Secs</span>
        </div>
      </div>
    );
  };

  const getHighestBid = (bids) => {
    if (!bids || bids.length === 0) return null;
    return Math.max(...bids.map(bid => bid.bid_amount));
  };

  const getBidCount = () => {
    return productData?.bids?.length || 0;
  };

  const getRetailPercentage = () => {
    if (!productData) return 0;
    const highestBid = getHighestBid(productData.bids) || parseFloat(productData.starting_price);
    const retailValue = parseFloat(productData.retail_value);
    return Math.round((highestBid / retailValue) * 100);
  };

  const getCurrentBid = () => {
    if (!productData) return 0;
    return getHighestBid(productData.bids) || parseFloat(productData.starting_price);
  };

  const getMinimumBid = () => {
    const currentBid = getCurrentBid();
    return currentBid + 50;
  };

  // Handle successful bid placement
  const handleBidSuccess = () => {
    setBidAmount(''); // Clear the bid input
    // The WebSocket will automatically update the UI with the new bid
  };

  // Handle bid submission
  const handleBidSubmit = (e) => {
    e.preventDefault();
    
    if (bidAmount === '' || bidAmount <= 0) {
      toast.error('Please enter a valid bid amount', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }

    // Show the bid modal
    setShowBidModal(true);
  };

  const handleQuickBid = (amount) => {
    if (timeRemaining > 0) {
      setBidAmount(amount);
      // Optional: Scroll the bid input into view
      const bidInput = document.querySelector(`.${styles.bidInputGroup} input`);
      if (bidInput) {
        bidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const toggleMobileAccordion = (tab) => {
    setMobileAccordionOpen(mobileAccordionOpen === tab ? null : tab);
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleWishlistToggle = async () => {
    try {
      setIsWishlistLoading(true);
      const userId = getUserIdFromToken();
      
      if (!userId) {
        toast.error('Please log in to manage your wishlist');
        navigate('/login');
        return;
      }

      if (!productId) {
        toast.error('Product not found');
        return;
      }

      if (isInWishlist) {
        await removeFromWishlist(productId, userId);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId, userId);
        toast.success('Added to wishlist');
      }
      
      // Toggle the wishlist status
      setIsInWishlist(!isInWishlist);
      // Trigger wishlist count update in Navbar
      triggerWishlistUpdate();
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/product/${productId}`;
    const shareData = {
      title: productData?.name || 'Product',
      text: `Check out this product: ${productData?.name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Product URL copied to clipboard!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } catch (error) {
      console.error('Error sharing product:', error);
      toast.error('Failed to share product', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Left Column Skeleton */}
            <div className={styles.leftColumn}>
              <div className={styles.imageGallery}>
                <div className={styles.mainImage}>
                  <Skeleton className="w-full h-[360px] md:h-[440px] rounded-lg" />
                </div>
                <div className={styles.thumbnailStrip}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={styles.thumbnail}>
                      <Skeleton className="h-16 w-16 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.desktopPlaceBidCard}>
                <div className={styles.placeBidCard}>
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-11 w-full" />
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className={styles.rightColumn}>
              <div className={styles.productHeader}>
                <Skeleton className="h-8 w-3/4 mb-4" />
                <div className={styles.metaGrid}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={styles.metaItem}>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  ))}
                </div>
                <div className={styles.priceInfo}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={styles.priceItem}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
                <div className={styles.descriptionPreview}>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>

              <div className={styles.topBox}>
                <div className={styles.bidCard}>
                  <Skeleton className="h-5 w-28 mb-3" />
                  <Skeleton className="h-8 w-40 mb-3" />
                  <Skeleton className="h-2 w-full mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className={styles.auctionDetails}>
                  <Skeleton className="h-6 w-40 mb-4" />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={styles.detailItem}>
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab headers skeleton */}
          <div className={styles.tabbedInfoDesktop}>
            <div className={styles.tabHeaders}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 mr-3 inline-block" />
              ))}
            </div>
          </div>

          {connectionError && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p style={{ color: 'red' }}>Connection issue. Trying to reconnect…</p>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  if (!productData) {
    return (
      <Layout>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Product not found</p>
            <button onClick={() => navigate('/')}>Go back to home</button>
          </div>
        </div>
      </Layout>
    );
  }

  // Quick bid options based on current bid
  const currentBid = getCurrentBid();
  const minimumBid = productData && productData.bids && productData.bids.length > 0 
  ? getHighestBid(productData.bids) 
  : productData?.starting_price || 0;

  // Quick bid options - ensure minimum bid is always at least 50 more than current bid
  const quickBidOptions = [
    { amount: Math.max(minimumBid, getCurrentBid() + 50), label: '' },
    { amount: Math.max(minimumBid, getCurrentBid() + 150), label: '' },
    { amount: Math.max(minimumBid + 200, getCurrentBid() + 250), label: '' },
    { amount: Math.max(minimumBid + 450, getCurrentBid() + 500), label: '' },
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Left Column: Image Gallery and Bid Card (Desktop) */}
          <div className={styles.leftColumn}>
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                {selectedImage ? (
                  <img src={selectedImage} alt="Selected Product" />
                ) : (
                  <div className={styles.imagePlaceholder}>No Image Available</div>
                )}
                <div className={styles.buttonContainer}>
                  <button 
                    className={`${styles.wishlistButton} ${isInWishlist ? styles.inWishlist : ''}`}
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={styles.heartIcon} fill={isInWishlist ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    className={styles.wishlistButton}
                    onClick={handleShare}
                    aria-label="Share product"
                  >
                    <Share2 className={styles.shareIcon} />
                  </button>
                </div>
              </div>
              <div className={styles.thumbnailStrip}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${
                      selectedImage === image.src ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>
            </div>

            {/* Place Your Bid Card (Desktop Only) */}
            <div className={styles.desktopPlaceBidCard}>
              <div className={styles.placeBidCard}>
                <div className={styles.bidHeader}>
                  <span className={styles.bidLabel}>Place Your Bid</span>
                  {/* <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Ends in</span>
                    {timeRemaining > 0 ? (
                      <div className={styles.auctionStatus}>
                        {formatCountdown(timeRemaining)}
                      </div>
                    ) : (
                      <span>Auction Ended</span>
                    )}
                  </div> */}
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 mb-2 border border-amber-100">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-amber-800">
                        Next minimum bid: <span className="font-bold">{formatCurrency(getCurrentBid() + 50)}</span>
                      </p>
                      <p className="text-xs text-amber-700 mt-1">Bids must be at least ₹50 higher than current bid</p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleBidSubmit} className={styles.bidForm}>
                  <div className={styles.bidInputGroup}>
                    {/* <label className={styles.inputLabel}>YOUR BID (INR)</label> */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setBidAmount(value === '' ? '' : parseFloat(value));
                        }}
                        min={minimumBid}
                        step={50}
                        placeholder="Enter your bid"
                        required
                        disabled={timeRemaining === 0}
                      />
                    </div>
                    {/* <div className={styles.bidInfo}>
                      <span className={styles.bidRequirement}>
                        <span className={styles.requirementIcon}></span>
                        Minimum bid: {formatCurrency(minimumBid)}
                      </span>
                      <span className={styles.bidIncrement}>
                        +&nbsp;{formatCurrency(50)} increments
                      </span>
                    </div> */}
                  </div>
                  <button 
                    type="submit" 
                    className={styles.placeBidButton}
                    disabled={isSubmitting || timeRemaining === 0}
                  >
                    {isSubmitting ? 'Placing Bid...' : timeRemaining === 0 ? 'Auction Ended' : 'Bid Now'}
                    <FaGavel className={styles.buttonIcon} />
                  </button>
                  <div className={styles.terms}>
                    By placing a bid, you agree to the{" "}
                    <a href="#" className={styles.termsLink}>
                      Terms & Conditions
                    </a>
                  </div>
                </form>
                <div className={styles.quickBidSection}>
                  <h3>Quick Bid Options</h3>
                  <div className={styles.quickBidOptions}>
                    {quickBidOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`${styles.quickBidButton} ${bidAmount === option.amount ? styles.selected : ""}`}
                        onClick={() => handleQuickBid(option.amount)}
                        disabled={timeRemaining === 0}
                      >
                        {formatCurrency(option.amount)}
                        {option.label && <span className={styles.quickBidLabel}>{option.label}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Header and Bid Info */}
          <div className={styles.rightColumn}>
            <div className={styles.productHeader}>
              <div className="flex justify-between items-start w-full">
                <h1 className={styles.productTitle}>{productData.name}</h1>
              </div>
              
              <div className={styles.metaGrid}>
                <div className={`${styles.metaItem} ${styles.categoryItem}`}>
                  <span className={styles.metaLabel}><FaTag className={styles.metaIcon} /> Category</span>
                  <span className={styles.metaValue}>
                    {/* <span className={styles.categoryIcon}><Tag size={14} /></span> */}
                    {productData.category}
                  </span>
                </div>
                <div className={`${styles.metaItem} ${styles.conditionItem}`}>
                  <span className={styles.metaLabel}><FaShieldAlt className={styles.metaIcon} /> Condition</span>
                  <span className={`${styles.metaValue}`}>
                    {/* <span className={styles.conditionIcon}><Award size={14} /></span> */}
                    {productData.condition || 'Used'}
                  </span>
                </div>
                <div className={`${styles.metaItem} ${styles.locationItem}`}>
                  <span className={styles.metaLabel}><FaMapMarkerAlt className={styles.metaIcon} /> Location</span>
                  <div className={styles.metaValue}>
                    {/* <FaMapMarkerAlt className={styles.locationIcon} /> */}
                    <span>{productData.location}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.priceInfo}>
                <div className={styles.priceItem}>
                  {/* <div className={styles.priceIcon}>
                    <DollarSign size={16} />
                  </div> */}
                  <div>
                    <span className={styles.priceLabel}>Floor Price</span>
                    <span className={styles.priceValue}>{formatCurrency(productData.starting_price)}</span>
                  </div>
                </div>
                <div className={styles.priceItem}>
                  {/* <div className={styles.priceIcon} style={{ color: '#10b981' }}>
                    <Award size={16} />
                  </div> */}
                  <div>
                    <span className={styles.priceLabel}>MSRP</span>
                    <span className={styles.priceValue}>{formatCurrency(productData.retail_value)}</span>
                  </div>
                </div>
                <div className={styles.priceItem}>
                  {/* <div className={styles.priceIcon} style={{ color: '#3b82f6' }}>
                    <FaBoxOpen size={16} />
                  </div> */}
                  <div>
                    <span className={styles.priceLabel}>Quantity</span>
                    <span className={styles.priceValue}>
                      {productData.quantity} {productData.quantity === 1 ? 'unit' : 'units'}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.countdownContainer}>
                <div className={styles.countdownLabel}>
                  <FaClock className={styles.clockIcon} />
                  <span className={styles.endsInText}>Time Remaining</span>
                </div>
                {timeRemaining > 0 ? (
                  <div className={styles.auctionStatus}>
                    <div className={styles.timeUnit}>
                      <span className={styles.timeValue}>
                        {Math.floor(timeRemaining / 86400).toString().padStart(2, '0')}
                      </span>
                      <span className={styles.timeLabel}>Days</span>
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.timeUnit}>
                      <span className={styles.timeValue}>
                        {Math.floor((timeRemaining % 86400) / 3600).toString().padStart(2, '0')}
                      </span>
                      <span className={styles.timeLabel}>Hrs</span>
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.timeUnit}>
                      <span className={styles.timeValue}>
                        {Math.floor((timeRemaining % 3600) / 60).toString().padStart(2, '0')}
                      </span>
                      <span className={styles.timeLabel}>Mins</span>
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.timeUnit}>
                      <span className={styles.timeValue}>
                        {(timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                      <span className={styles.timeLabel}>Secs</span>
                    </div>
                  </div>
                ) : (
                  <span className={styles.endsInText}>Auction Ended</span>
                )}
              </div>
              
              <div className={styles.descriptionPreview}>
                <h3>Description</h3>
                <Tooltip content={productData.description}>
                  <p className={styles.descriptionText}>
                    {productData.description}
                  </p>
                </Tooltip>
              </div>
            </div>

            <div className={styles.topBox}>
              <div className={styles.bidCard}>
                <div className={styles.bidHeader}>
                  <span className={styles.bidLabel}>CURRENT BID</span>
                </div>
                <div className={styles.bidAmount}>
                  {formatCurrency(getCurrentBid())}
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${getRetailPercentage()}%` }}></div>
                </div>
                <div className={styles.bidStats}>
                  <div className={styles.bidCount}>
                    <FaGavel className={styles.statIcon} />
                    {getBidCount()} bids
                  </div>
                  <div className={styles.retailPercentage}>
                    {getRetailPercentage()}% of MSRP
                  </div>
                </div>
              </div>
              <div className={styles.auctionDetails}>
                <h3>Auction Details</h3>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Retail Value:</span>
                  <span className={styles.detailValue}>{formatCurrency(productData.retail_value)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Starting Bid:</span>
                  <span className={styles.detailValue}>{formatCurrency(productData.starting_price)}</span>
                </div>
                <div className={`${styles.detailItem} ${styles.hideOnMobile}`}> 
                  <span className={styles.detailLabel}>Min Increment:</span>
                  <span className={styles.detailValue}>+{formatCurrency(50)}</span>
                </div>
                <div className={`${styles.detailItem} ${styles.hideOnMobile}`}> 
                  <span className={styles.detailLabel}>Quantity:</span>
                  <span className={styles.detailValue}>{productData.quantity} units</span>
                </div>
              </div>
            </div>

            {/* Place Your Bid Card (Mobile Only) */}
            <div className={styles.mobilePlaceBidCard}>
              <div className={styles.placeBidCard}>
                <div className={styles.bidHeader}>
                  <span className={styles.bidLabel}>Place Your Bid</span>
                </div>
                <form onSubmit={handleBidSubmit} className={styles.bidForm}>
                  <div className={styles.bidInputGroup}>
                    {/* <label className={styles.inputLabel}>YOUR BID (INR)</label> */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                        min={minimumBid}
                        step={50}
                        required
                        disabled={timeRemaining === 0}
                      />
                    </div>
                    <div className={styles.bidInfo}>
                      <span className={styles.bidRequirement}>
                        <span className={styles.requirementIcon}>🛡️</span>
                        Minimum bid: {formatCurrency(minimumBid)}
                      </span>
                      <span className={styles.bidIncrement}>
                        +{formatCurrency(50)} increments
                      </span>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className={styles.placeBidButton}
                    disabled={isSubmitting || timeRemaining === 0}
                  >
                    {isSubmitting ? 'Placing Bid...' : timeRemaining === 0 ? 'Auction Ended' : 'Place Bid Now'}
                    <FaGavel className={styles.buttonIcon} />
                  </button>
                  <div className={styles.terms}>
                    By placing a bid, you agree to the{" "}
                    <a href="#" className={styles.termsLink}>
                      Terms & Conditions
                    </a>
                  </div>
                </form>
                <div className={styles.quickBidSection}>
                  <h3>Quick Bid Options</h3>
                  <div className={styles.quickBidOptions}>
                    {quickBidOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`${styles.quickBidButton} ${bidAmount === option.amount ? styles.selected : ""}`}
                        onClick={() => handleQuickBid(option.amount)}
                        disabled={timeRemaining === 0}
                      >
                        {formatCurrency(option.amount)}
                        {option.label && <span className={styles.quickBidLabel}>{option.label}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mobileSpacer}></div>

        {/* Tabbed Info Desktop */}
        <div className={styles.tabbedInfoDesktop}>
          <div className={styles.tabHeaders}>
            {[
              "description",
              "shipping",
              "returns",
              "manifest",
              "bid-history",
              "seller",
            ].map((tab) => (
              <button
                key={tab}
                className={`${styles.tabHeader} ${
                  activeTab === tab ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </button>
            ))}
          </div>
          <div className={styles.tabContent}>
            {activeTab === "description" && (
              <div className={styles.description}>
                <p>{productData.description}</p>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className={styles.shippingInfo}>
                <h4>Shipping Information</h4>
                <p>Shipping: {productData.shipping}</p>
                <p>Location: {productData.location}</p>
                <p>Standard Shipping only</p>
                <p>Transport Mode: Firelight - TL</p>
                <p>Number of Shipments: 1</p>
                <p>Packaging Type: Floor Loaded</p>
                <p>Shipment Weight: 10,554 lbs</p>
                <p>Number of Truckloads: 1</p>
              </div>
            )}
            {activeTab === "returns" && (
              <div className={styles.returnsInfo}>
                <h4>Returns Policy</h4>
                <p>
                  All sales are final. Please inspect items upon delivery as
                  returns are not accepted for this auction.
                </p>
              </div>
            )}
            {activeTab === "manifest" && (
              <div className={styles.manifestTable}>
                <div className={styles.tableHeader}>
                  <h3>Full Manifest</h3>
                  <button className={styles.downloadButton}>
                    Download Manifest
                  </button>
                </div>
                <div className={styles.tableWrapper}>
                  <table>
                    <thead>
                      <tr>
                        <th>LOT ID</th>
                        <th>MANUFACTURER</th>
                        <th>MODEL</th>
                        <th>ITEM #</th>
                        <th>ITEM DESCRIPTION</th>
                        <th>QTY</th>
                        <th>UNIT RETAIL</th>
                        <th>UNIT WEIGHT</th>
                        <th>CONDITION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manifestData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.lotId}</td>
                          <td>{item.manufacturer}</td>
                          <td>{item.model}</td>
                          <td>{item.itemNumber}</td>
                          <td>{item.description}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unitRetail)}</td>
                          <td>{item.unitWeight}</td>
                          <td>{item.condition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "bid-history" && (
              <div className={styles.bidHistoryTab}>
                <h3>Bid History</h3>
                <div className={styles.historyTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Bidder</th>
                        <th>Amount</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.bids.map((bid, index) => (
                        <tr key={index}>
                          <td>{bid.user_name}</td>
                          <td>{formatCurrency(bid.bid_amount)}</td>
                          <td>{new Date(bid.bid_time).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "seller" && (
              <div className={styles.sellerInfo}>
                <h3>Seller Information</h3>
                <div className={styles.sellerDetails}>
                  <div className={styles.sellerNameRating}>
                    <span className={styles.sellerName}>{productData.seller}</span>
                    <span className={styles.sellerRating}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < 4 ? styles.starFilled : styles.starEmpty
                          }
                        >
                          ★
                        </span>
                      ))}
                      (4.8)
                    </span>
                  </div>
                  <div className={styles.sellerTerms}>
                    <strong>Terms:</strong> Standard auction terms apply
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Info Mobile */}
        <div className={styles.tabbedInfoMobile}>
          {[
            "description",
            "shipping",
            "returns",
            "manifest",
            "bid-history",
            "seller",
          ].map((tab) => (
            <div key={tab} className={styles.accordionItem}>
              <button
                className={`${styles.accordionHeader} ${
                  mobileAccordionOpen === tab ? styles.active : ""
                }`}
                onClick={() => toggleMobileAccordion(tab)}
              >
                {tab
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                <span className={styles.accordionIcon}>
                  {mobileAccordionOpen === tab ? "−" : "+"}
                </span>
              </button>
              <div
                className={`${styles.accordionContent} ${
                  mobileAccordionOpen === tab ? styles.open : ""
                }`}
              >
                {tab === "description" && (
                  <div className={styles.description}>
                    <p>{productData.description}</p>
                  </div>
                )}
                {tab === "shipping" && (
                  <div className={styles.shippingInfo}>
                    <p>Shipping: {productData.shipping}</p>
                    <p>Location: {productData.location}</p>
                  </div>
                )}
                {tab === "returns" && (
                  <div className={styles.returnsInfo}>
                    <p>All sales are final.</p>
                  </div>
                )}
                {tab === "manifest" && (
                  <div className={styles.mobileManifestContainer}>
                    <div className={styles.scrollableTableContainer}>
                      <table className={styles.fullManifestTable}>
                        <thead>
                          <tr>
                            <th>LOT ID</th>
                            <th>MANUFACTURER</th>
                            <th>MODEL</th>
                            <th>ITEM #</th>
                            <th>DESCRIPTION</th>
                            <th>QTY</th>
                            <th>UNIT RETAIL</th>
                            <th>UNIT WEIGHT</th>
                            <th>CONDITION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {manifestData.slice(0, 2).map((item, index) => (
                            <tr key={index}>
                              <td>{item.lotId}</td>
                              <td>{item.manufacturer}</td>
                              <td>{item.model}</td>
                              <td>{item.itemNumber}</td>
                              <td>{item.description}</td>
                              <td>{item.quantity}</td>
                              <td>{formatCurrency(item.unitRetail)}</td>
                              <td>{item.unitWeight}</td>
                              <td>{item.condition}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button className={styles.downloadButton}>
                      Download Full Manifest
                    </button>
                  </div>
                )}
                {tab === "bid-history" && (
                  <div className={styles.bidHistoryTab}>
                    <div className={styles.historyTable}>
                      <table>
                        <tbody>
                          {productData.bids.slice(0, 3).map((bid, index) => (
                            <tr key={index}>
                              <td>{bid.user_name}</td>
                              <td>{formatCurrency(bid.bid_amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {tab === "seller" && (
                  <div className={styles.sellerInfo}>
                    <div className={styles.sellerDetails}>
                      <div className={styles.sellerNameRating}>
                        <span className={styles.sellerName}>{productData.seller}</span>
                        <span className={styles.sellerRating}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < 4 ? styles.starFilled : styles.starEmpty
                              }
                            >
                              ★
                            </span>
                          ))}
                          (4.8)
                        </span>
                      </div>
                      <div className={styles.sellerTerms}>
                        <strong>Terms:</strong> Standard auction terms apply
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bid Modal */}
      <BidModal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        currentBid={getCurrentBid()}
        productId={parseInt(productId)}
        initialBidAmount={typeof bidAmount === 'number' ? bidAmount : undefined}
        onBidSuccess={handleBidSuccess}
      />
    </Layout>
  );
};

export default ProductDetailPage;
