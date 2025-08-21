 import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import styles from "./ProductDetailPage.module.css";
import Tooltip from '@/components/Tooltip/Tooltip';
import Layout from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import fridgeWebp from "@/assets/fridge.webp";
import { FaGavel, FaMapMarkerAlt, FaTag, FaShieldAlt, FaClock, FaShoppingCart } from 'react-icons/fa';
import { Heart, Share2 } from 'lucide-react';
import { addToWishlist, removeFromWishlist, getUserIdFromToken, checkWishlistItem } from "@/services/crudService";
import WebSocketService, { WebSocketMessage } from "@/services/WebsocketService";
import BidModal from "./user/BidModal";
import { useWishlist } from "@/hooks/use-wishlist";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const webSocketService = React.useMemo(() => WebSocketService, []);
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRef = useRef(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Calculate per unit price
  const getPerUnitPrice = (price) => {
    if (!productData?.quantity || price === 0) return 0;
    return price / productData.quantity;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getHighestBid = (bids) => {
    if (!bids || bids.length === 0) return null;
    return Math.max(...bids.map(bid => bid.bid_amount));
  };

  const getCurrentBid = () => {
    if (!productData) return 0;
    return getHighestBid(productData.bids) || parseFloat(productData.starting_price);
  };

  // Check if buy option is available
  const hasBuyOption = () => {
    return productData?.buy_option === 1 && productData?.sale_price;
  };

  // Handle Buy Now action
  const handleBuyNow = async () => {
    try {
      const userId = getUserIdFromToken();
      
      if (!userId) {
        toast({
          variant: 'default',
          title: 'Sign in required',
          description: 'Please sign in to purchase this item',
          className: 'bg-white border border-gray-200 text-foreground shadow-lg'
        });
        return;
      }

      // Add your buy now logic here
      // This could redirect to a checkout page or open a purchase modal
      toast({
        title: 'Redirecting to checkout',
        description: 'Processing your purchase request...',
        className: 'bg-white border border-green-200 text-foreground shadow-lg'
      });

      // Example: navigate to checkout page
      // navigate(`/checkout/${productId}?type=buy-now&price=${productData.sale_price}`);
      
    } catch (error) {
      console.error('Error processing buy now:', error);
      toast({
        variant: 'default',
        title: 'Error',
        description: 'Failed to process purchase',
        className: 'bg-white border border-red-200 text-foreground shadow-lg'
      });
    }
  };

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

  useEffect(() => {
    if (!productId) {
      toast({
        variant: 'default',
        title: 'Error',
        description: 'Product ID not found',
        className: 'bg-white border border-red-200 text-foreground shadow-lg'
      });
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

    webSocketService.connect(productId, handleWebSocketMessage);
    return () => {
      webSocketService.disconnect();
    };
  }, [productId, navigate, webSocketService]);

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

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextImage();
    }
    if (touchStart - touchEnd < -50) {
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % images.length;
      setSelectedImage(images[newIndex].src);
      return newIndex;
    });
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + images.length) % images.length;
      setSelectedImage(images[newIndex].src);
      return newIndex;
    });
  };

  const handleBidSuccess = () => {
    setBidAmount('');
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (bidAmount === '' || bidAmount <= 0) {
      toast({
        variant: 'default',
        title: 'Error',
        description: 'Please enter a valid bid amount',
        className: 'bg-white border border-red-200 text-foreground shadow-lg'
      });
      return;
    }
    setShowBidModal(true);
  };
  const handleQuickBid = (amount) => {
    if (timeRemaining > 0) {
      setBidAmount(amount);
      const bidInput = document.querySelector(`.${styles.bidInputGroup} input`);
      if (bidInput) {
        bidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const toggleMobileAccordion = (tab) => {
    setMobileAccordionOpen(mobileAccordionOpen === tab ? null : tab);
  };

  const handleImageClick = (imageSrc, index) => {
    setSelectedImage(imageSrc);
    setCurrentImageIndex(index);
  };

  const handleWishlistToggle = async () => {
    try {
      setIsWishlistLoading(true);
      const userId = getUserIdFromToken();
      
      if (!userId) {
        toast({
          variant: 'default',
          title: 'Sign in required',
          description: 'Please sign in to add to wishlist',
          className: 'bg-white border border-gray-200 text-foreground shadow-lg'
        });
        return;
      }

      if (!productId) {
        toast({
          variant: 'default',
          title: 'Error',
          description: 'Product not found',
          className: 'bg-white border border-red-200 text-foreground shadow-lg'
        });
        return;
      }

      if (isInWishlist) {
        await removeFromWishlist(productId, userId);
        setIsInWishlist(false);
        await triggerWishlistUpdate();
        toast({
          title: 'Success',
          description: 'Removed from wishlist',
          className: 'bg-white border border-green-200 text-foreground shadow-lg'
        });
      } else {
        await addToWishlist(productId, userId);
        setIsInWishlist(true);
        await triggerWishlistUpdate();
        toast({
          title: 'Success',
          description: 'Added to wishlist',
          className: 'bg-white border border-green-200 text-foreground shadow-lg'
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        variant: 'default',
        title: 'Error',
        description: error.message || 'Failed to update wishlist',
        className: 'bg-white border border-red-200 text-foreground shadow-lg'
      });
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
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          console.log('Share was not completed', err);
        }
      }
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: 'Success',
            description: 'Product link copied to clipboard!',
            className: 'bg-white border border-green-200 text-foreground shadow-lg'
          });
          return;
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
        }
      }
      alert(`Share this product: ${shareUrl}`);
    } catch (error) {
      console.error('Error sharing product:', error);
      toast({
        variant: 'default',
        title: 'Error',
        description: 'Failed to share product',
        className: 'bg-white border border-red-200 text-foreground shadow-lg'
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
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

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            <div className={styles.imageGallery}>
              <div 
                className={styles.mainImage}
                ref={imageRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
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
              <div className={`${styles.thumbnailStrip} ${styles.desktopThumbnails}`}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${
                      selectedImage === image.src ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => handleImageClick(image.src, index)}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>
              <div className={`${styles.dotsIndicator} ${styles.mobileDots}`}>
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.dot} ${
                      currentImageIndex === index ? styles.activeDot : ""
                    }`}
                    onClick={() => {
                      setSelectedImage(images[index].src);
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className={styles.desktopPlaceBidCard}>
              <div className={styles.placeBidCard}>
                <div className={styles.bidHeader}>
                  <span className={styles.bidLabel}>Place Your Bid</span>
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
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setBidAmount(value === '' ? '' : parseFloat(value));
                        }}
                        min={getCurrentBid() + 50}
                        step={50}
                        placeholder="Enter your bid"
                        required
                        disabled={timeRemaining === 0}
                      />
                    </div>
                  </div>
                  <div className={styles.bidButtonContainer}>
                    <button 
                      type="submit" 
                      className={styles.placeBidButton}
                      disabled={isSubmitting || timeRemaining === 0}
                    >
                      {isSubmitting ? 'Placing Bid...' : timeRemaining === 0 ? 'Auction Ended' : 'Bid Now'}
                      <FaGavel className={styles.buttonIcon} />
                    </button>
                    {productData.buy_option === 1 && getCurrentBid() < parseFloat(productData.sale_price) && (
                      <button 
                        type="button" 
                        className={`${styles.placeBidButton} ${styles.buyNowButton}`}
                        disabled={timeRemaining === 0}
                        onClick={() => {
                          navigate('/checkout/address', {
                            state: {
                              product: {
                                id: productData.id,
                                name: productData.name,
                                image: productData.images?.[0] || '',
                                price: parseFloat(productData.sale_price),
                                quantity: 1,
                                sellerId: productData.seller_id
                              }
                            }
                          });
                        }}
                      >
                        Buy for {formatCurrency(productData.sale_price)}
                      </button>
                    )}
                  </div>
                </form>
                <div className={styles.quickBidSection}>
                  <h3>Quick Bid Options</h3>
                  <div className={styles.quickBidOptions}>
                    {[
                      { amount: getCurrentBid() + 50, label: '' },
                      { amount: getCurrentBid() + 150, label: '' },
                      { amount: getCurrentBid() + 250, label: '' },
                      { amount: getCurrentBid() + 500, label: '' },
                    ].map((option, index) => (
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
          <div className={styles.rightColumn}>
            <div className={styles.productHeader}>
              <div className="flex justify-between items-start w-full">
                <h1 className={styles.productTitle}>{productData.name}</h1>
              </div>
              <div className={styles.metaGrid}>
                <div className={`${styles.metaItem} ${styles.categoryItem}`}>
                  <span className={styles.metaLabel}><FaTag className={styles.metaIcon} /> Category</span>
                  <span className={styles.metaValue}>
                    {productData.category}
                  </span>
                </div>
                <div className={`${styles.metaItem} ${styles.conditionItem}`}>
                  <span className={styles.metaLabel}><FaShieldAlt className={styles.metaIcon} /> Condition</span>
                  <span className={`${styles.metaValue}`}>
                    {productData.condition || 'Used'}
                  </span>
                </div>
                <div className={`${styles.metaItem} ${styles.locationItem}`}>
                  <span className={styles.metaLabel}><FaMapMarkerAlt className={styles.metaIcon} /> Location</span>
                  <div className={styles.metaValue}>
                    <span>{productData.location}</span>
                  </div>
                </div>
              </div>
              <div className={styles.priceInfo}>
                <div className={styles.priceItem}>
                  <div>
                    <span className={styles.priceLabel}>Current Bid</span>
                    <span className={styles.priceValue}>{formatCurrency(getCurrentBid())}</span>
                  </div>
                </div>
                <div className={styles.priceItem}>
                  <div>
                    <span className={styles.priceLabel}>MSRP</span>
                    <span className={styles.priceValue}>{formatCurrency(productData.retail_value)}</span>
                  </div>
                </div>
                <div className={styles.priceItem}>
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

            {/* New Mobile Bid Card */}
            <div className={styles.mobileBidCard}>
              <div className={styles.mobileBidAmount}>
              Current Bid: {formatCurrency(getCurrentBid())} / {formatCurrency(getPerUnitPrice(getCurrentBid()))} per unit
              </div>
              <div className={styles.retailPercentage}>
                    {Math.round((getCurrentBid() / productData.retail_value) * 100)}% of MSRP
                  </div>
              <div className={styles.mobileRetailValue}>
                MSRP: {formatCurrency(productData.retail_value)} / {formatCurrency(getPerUnitPrice(productData.retail_value))} per unit
              </div>
              <div className={styles.mobileBidForm}>
                <div className={styles.mobileBidLabel}>Place a new max bid</div>
                <input
                  type="number"
                  className={styles.mobileBidInput}
                  placeholder={`Enter max bid (${formatCurrency(getCurrentBid() + 50)}+)`}
                  min={getCurrentBid() + 50}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                />
                <div className={styles.mobileButtonContainer}>
                  <button 
                    className={styles.mobileBidButton}
                    onClick={handleBidSubmit}
                    disabled={isSubmitting || timeRemaining === 0}
                  >
                    Bid Now
                  </button>
                  {productData.buy_option === 1 && getCurrentBid() < parseFloat(productData.sale_price) && (
                    <button 
                      className={`${styles.mobileBidButton} ${styles.mobileBuyNowButton}`}
                      disabled={timeRemaining === 0}
                      onClick={() => {
                        navigate('/checkout/address', {
                          state: {
                            product: {
                              id: productData.id,
                              name: productData.name,
                              image: productData.images?.[0] || '',
                              price: parseFloat(productData.sale_price),
                              quantity: 1,
                              sellerId: productData.seller_id
                            }
                          }
                        });
                      }}
                    >
                      Buy for {formatCurrency(productData.sale_price)}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={`${styles.topBox} ${styles.hideOnMobile}`}>
              <div className={styles.bidCard}>
                <div className={styles.bidHeader}>
                  <span className={styles.bidLabel}>CURRENT BID</span>
                </div>
                <div className={styles.bidAmount}>
                {formatCurrency(getCurrentBid())} / {formatCurrency(getPerUnitPrice(getCurrentBid()))} per unit
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(getCurrentBid() / productData.retail_value) * 100}%` }}></div>
                </div>
                <div className={styles.bidStats}>
                  <div className={styles.bidCount}>
                    <FaGavel className={styles.statIcon} />
                    {productData.bids?.length || 0} bids
                  </div>
                  <div className={styles.retailPercentage}>
                    {Math.round((getCurrentBid() / productData.retail_value) * 100)}% of MSRP
                  </div>
                </div>
              </div>
              <div className={styles.auctionDetails}>
                <h3>Auction Details</h3>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>MSRP:</span>
                  <span className={styles.detailValue}>
                  {formatCurrency(productData.retail_value)} / {formatCurrency(getPerUnitPrice(productData.retail_value))} per unit
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Starting Bid:</span>
                  <span className={styles.detailValue}>{formatCurrency(productData.starting_price)}</span>
                </div>
                {/* <div className={`${styles.detailItem} ${styles.hideOnMobile}`}> 
                  <span className={styles.detailLabel}>Min Increment:</span>
                  <span className={styles.detailValue}>+{formatCurrency(50)}</span>
                </div>
                <div className={`${styles.detailItem} ${styles.hideOnMobile}`}> 
                  <span className={styles.detailLabel}>Quantity:</span>
                  <span className={styles.detailValue}>{productData.quantity} units</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mobileSpacer}></div>
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
                      {[
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
                      ].map((item, index) => (
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
                      {productData.bids?.map((bid, index) => (
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
                <div className={styles.sellerDetails}>
                  <div className={styles.sellerNameRating}>
                    <span className={styles.sellerName}>{productData.seller}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
                          {[
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
                            },
                          ].slice(0, 2).map((item, index) => (
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
                          {productData.bids?.slice(0, 3).map((bid, index) => (
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