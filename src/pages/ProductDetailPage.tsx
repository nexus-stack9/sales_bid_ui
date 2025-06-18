import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from "./ProductDetailPage.module.css";
import Layout from "@/components/layout/Layout";
import fridgeWebp from "@/assets/fridge.webp";
import fridge2Png from "@/assets/fridge2.png";
import { FaGavel, FaMapMarkerAlt } from 'react-icons/fa';
import { placeBid } from "@/services/crudService";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  
  // WebSocket and product data state
  const [ws, setWs] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState("description");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(null);
  const [selectedImage, setSelectedImage] = useState(fridgeWebp);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const images = [
    { src: fridgeWebp, alt: "Product Image 1" },
    { src: fridge2Png, alt: "Product Image 2" },
  ];

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

  // WebSocket connection setup with proper cleanup
  useEffect(() => {
    if (!productId) {
      toast.error('Product ID not found');
      navigate('/');
      return;
    }

    let websocket;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      // Close any existing connection
      if (websocket) {
        websocket.close();
      }

      websocket = new WebSocket(`ws://localhost:3000/ws/product?product_id=${productId}`);
      
      websocket.onopen = () => {
        console.log(`WebSocket connected for product ${productId}`);
        reconnectAttempts = 0;
        setConnectionError(false);
      };
      
      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'product_update' && message.data) {
            setProductData(message.data);
            setLoading(false);
            
            const highestBid = getHighestBid(message.data.bids);
            const minBid = highestBid ? highestBid + 50 : parseFloat(message.data.starting_price);
            setBidAmount(minBid);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError(true);
      };
      
      websocket.onclose = () => {
        console.log(`WebSocket disconnected for product ${productId}`);
        setConnectionError(true);
        
        // Only attempt to reconnect if we're still on the same product
        if (websocket === ws && reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(() => {
            if (!websocket || websocket.readyState === WebSocket.CLOSED) {
              connectWebSocket();
            }
          }, 3000);
        }
      };
      
      setWs(websocket);
    };

    connectWebSocket();

    // Cleanup on component unmount or productId change
    return () => {
      if (websocket) {
        websocket.close();
        console.log(`Cleaning up WebSocket for product ${productId}`);
      }
    };
  }, [productId]);

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

  const formatCountdown = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
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

  // Event handlers
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!bidAmount || isNaN(bidAmount)) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    const minBid = getMinimumBid();
    if (bidAmount < minBid) {
      toast.error(`Bid amount must be at least ${formatCurrency(minBid)}`);
      return;
    }

    if (timeRemaining <= 0) {
      toast.error('This auction has already ended');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await placeBid(productId, bidAmount);
      toast.success('Bid placed successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // The WebSocket will automatically update the UI with the new bid
      return response;
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place bid', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      throw error; // Re-throw to allow form to handle the error
    } finally {
      setIsSubmitting(false);
    }
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

  // Loading and error states
  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading product details...</p>
            {connectionError && (
              <p style={{ color: 'red' }}>
                Connection error. Attempting to reconnect...
              </p>
            )}
          </div>
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
  const minimumBid = getMinimumBid();
  const quickBidOptions = [
    { amount: minimumBid, label: "Minimum" },
    { amount: minimumBid + 50, label: "" },
    { amount: minimumBid + 100, label: "" },
    { amount: Math.round(currentBid * 1.2), label: "Recommended" }
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Left Column: Image Gallery and Bid Card (Desktop) */}
          <div className={styles.leftColumn}>
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                <img src={selectedImage} alt="Selected Product" />
              </div>
              <div className={styles.thumbnailStrip}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${
                      selectedImage === image.src ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => handleImageClick(image.src)}
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
                  <span className={styles.auctionStatus}>
                    <span className={styles.statusIcon}>⏰</span>
                    {timeRemaining > 0 ? `Ends in ${formatCountdown(timeRemaining)}` : 'Auction Ended'}
                  </span>
                </div>
                <form onSubmit={handleBidSubmit} className={styles.bidForm}>
                  <div className={styles.bidInputGroup}>
                    <label className={styles.inputLabel}>YOUR BID (INR)</label>
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
              <h1>{productData.name}</h1>
              <div className={styles.headerMeta}>
                <span className={`${styles.conditionBadge} ${styles.condition}`}>
                  {productData.status}
                </span>
                <span className={`${styles.conditionBadge} ${styles.category}`}>
                  {productData.category}
                </span>
              </div>
              <span className={styles.location}>
                <FaMapMarkerAlt className={styles.locationIcon} />
                {productData.location}
              </span>
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
                    {getRetailPercentage()}% of retail
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
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Min Increment:</span>
                  <span className={styles.detailValue}>+{formatCurrency(50)}</span>
                </div>
                <div className={styles.detailItem}>
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
                  <span className={styles.auctionStatus}>
                    <span className={styles.statusIcon}>⏰</span>
                    {timeRemaining > 0 ? `Ends in ${formatCountdown(timeRemaining)}` : 'Auction Ended'}
                  </span>
                </div>
                <form onSubmit={handleBidSubmit} className={styles.bidForm}>
                  <div className={styles.bidInputGroup}>
                    <label className={styles.inputLabel}>YOUR BID (INR)</label>
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
    </Layout>
  );
};

export default ProductDetailPage;