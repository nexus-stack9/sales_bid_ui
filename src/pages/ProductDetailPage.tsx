import React, { useState, useEffect } from "react";
import styles from "./ProductDetailPage.module.css";
import Layout from "@/components/layout/Layout";
import fridgeWebp from "@/assets/fridge.webp";
import fridge2Png from "@/assets/fridge2.png";
import { FaGavel } from 'react-icons/fa';

const ProductDetailPage = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60);
  const [bidAmount, setBidAmount] = useState("");
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(null);
  const [selectedImage, setSelectedImage] = useState(fridgeWebp);

  const images = [
    { src: fridgeWebp, alt: "Fridge 1" },
    { src: fridge2Png, alt: "Fridge 2" },
  ];

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
  ]);

  const [bidHistory] = useState([
    { bidder: "Bidder123", amount: 11500 * 85, time: "2023-05-15 14:30:22" },
    { bidder: "AppliancePro", amount: 11000 * 85, time: "2023-05-15 13:45:10" },
    {
      bidder: "WarehouseBuyer",
      amount: 10500 * 85,
      time: "2023-05-15 12:15:45",
    },
    { bidder: "Bidder123", amount: 10000 * 85, time: "2023-05-15 10:20:30" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    console.log("Bid submitted:", bidAmount);
  };

  const toggleMobileAccordion = (tab) => {
    setMobileAccordionOpen(mobileAccordionOpen === tab ? null : tab);
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.productHeader}>
          <h1>
            51 Units of Used - Good Condition Refrigerators, Dishwashers, Ranges
            & More
          </h1>
          <div className={styles.headerMeta}>
            <span className={`${styles.conditionBadge} ${styles.usedGood}`}>
              Used - Good
            </span>
            <span className={styles.location}>Mirooka Warehouse</span>
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                <img src={selectedImage} alt="Selected Appliance" />
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

            <div className={styles.productDetails}>
              <h2>Product Details</h2>
              <ul>
                <li>
                  <strong>Quantity:</strong> 51 units
                </li>
                {/* <li>
                  <strong>Shipping:</strong> Standard Shipping only
                </li>
                <li>
                  <strong>Estimated Shipping Cost:</strong>{" "}
                  {formatCurrency(6000 * 85)}
                </li> */}
                {/* <li>
                  <strong>Payment Methods:</strong> Various payment methods
                  available
                </li> */}
                <li>
                  <strong>Category:</strong> Major Appliances: Kitchen 90.2%,
                  Major Appliances: Laundry 5.9%, and Small Appliances
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.topBox}>
              <div className={styles.priceInfo}>
                <div className={styles.currentBid}>
                  <span className={styles.label}>Current Bid:</span>
                  <span className={styles.amount}>
                    {formatCurrency(12000 * 85)}
                  </span>
                </div>
                <div className={styles.perUnit}>
                  {formatCurrency(323.29 * 85)} per unit
                </div>
                <div className={styles.msrpEstimate}>
                  Estimated MSRP: {formatCurrency(75467.0 * 85)} /{" "}
                  {formatCurrency(4480.61 * 85)} per unit
                </div>
              </div>
              <div className={styles.timeRemaining}>
                <span className={styles.label}>
                  <span className={styles.icon}>⌛</span>
                  Time Remaining:
                </span>
                <span className={styles.timer}>
                  {formatCountdown(timeRemaining)}
                </span>
              </div>
              <div className={styles.totalBids}>
                <span className={styles.label}>
                  <span className={styles.icon}>
                  <FaGavel size={14} />
                  </span>
                  Total Bids:
                </span>
                <span className={styles.timer}>12</span>
              </div>
              <form onSubmit={handleBidSubmit} className={styles.bidForm}>
                <div className={styles.bidInputGroup}>
                  <span className={styles.currencySymbol}>₹</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    min={12000 * 85 * 1.05}
                    step="100"
                    required
                  />
                </div>
                <button type="submit" className={styles.bidButton}>
                  Place Bid
                </button>
              </form>
            </div>

            <div className={styles.bottomBox}>
              <div className={styles.sellerInfo}>
                <h3>Seller Information</h3>
                <div className={styles.sellerDetails}>
                  <div className={styles.sellerNameRating}>
                    <span className={styles.sellerName}>Sales Bid</span>
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
            </div>
          </div>
        </div>
        <div className={styles.mobileSpacer}></div>

        {/* Moved tabbedInfoDesktop and tabbedInfoMobile outside of leftColumn */}
        <div className={styles.tabbedInfoDesktop}>
          <div className={styles.tabHeaders}>
            {[
              "description",
              "shipping",
              "returns",
              "manifest",
              "bid-history",
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
                <p>
                  This auction includes 51 units of used kitchen and laundry
                  appliances in good condition. The lot includes refrigerators,
                  dishwashers, ranges, and other major appliances.
                </p>
                <p>
                  All items have been inspected and are in working condition.
                  Minor cosmetic imperfections may be present.
                </p>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className={styles.shippingInfo}>
                <h4>Shipping Information</h4>
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
          </div>
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
                    {bidHistory.map((bid, index) => (
                      <tr key={index}>
                        <td>{bid.bidder}</td>
                        <td>{formatCurrency(bid.amount)}</td>
                        <td>{bid.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className={styles.tabbedInfoMobile}>
          {[
            "description",
            "shipping",
            "returns",
            "manifest",
            "bid-history",
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
                    <p>
                      This auction includes 51 units of used kitchen and laundry
                      appliances in good condition.
                    </p>
                  </div>
                )}
                {tab === "shipping" && (
                  <div className={styles.shippingInfo}>
                    <p>Standard Shipping only</p>
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
                          {bidHistory.slice(0, 2).map((bid, index) => (
                            <tr key={index}>
                              <td>{bid.bidder}</td>
                              <td>{formatCurrency(bid.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
