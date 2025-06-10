import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Bell, Zap, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileApp = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - App features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-6">
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile Experience
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bid On The Go With Our Mobile App
            </h2>
            
            <p className="text-gray-300 mb-8">
              Never miss an auction again. Our mobile app keeps you connected to your favorite 
              auctions anytime, anywhere. Get real-time notifications, place bids instantly, 
              and manage your account with ease.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: <Bell className="h-5 w-5 text-blue-400" />,
                  title: "Real-time Notifications",
                  description: "Get instant alerts for new bids, auction endings, and price drops."
                },
                {
                  icon: <Zap className="h-5 w-5 text-yellow-400" />,
                  title: "Lightning Fast Bidding",
                  description: "Place bids with a single tap and secure your desired items quickly."
                },
                {
                  icon: <Shield className="h-5 w-5 text-green-400" />,
                  title: "Secure Transactions",
                  description: "End-to-end encryption ensures your payment information stays safe."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5,2H8.5L8.3,2C7.1,2,6,3.1,6,4.3V4.5v15V19.7c0,1.2,1.1,2.3,2.3,2.3H17.7c1.2,0,2.3-1.1,2.3-2.3V4.3C20,3.1,18.9,2,17.7,2z M13,20.8c-0.7,0-1.3-0.6-1.3-1.3s0.6-1.3,1.3-1.3s1.3,0.6,1.3,1.3S13.7,20.8,13,20.8z M18,17H8V5h10V17z"/>
                </svg>
                Download for iOS
              </Button>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9,5.7L9.2,2.3C8.9,2.2,8.6,2,8.2,2C7.4,2,6.7,2.5,6.5,3.3c0,0.1,0,0.1,0,0.2v18.9c0,0.1,0,0.1,0,0.2c0.2,0.8,1,1.3,1.8,1.1l8.6-3.4c0.7-0.3,1.1-1,1.1-1.7V7.4C18.9,6.7,18.5,6,17.9,5.7z M13.9,8.7l-2.7-4.6l2.7,1.3V8.7z M9.2,4.1l3,5.1L6.5,5.7L9.2,4.1z M6.5,20.5V8.5l5.7,3.8v5.5L6.5,20.5z M13.9,18.1v-5.8l5-3.4v5.8L13.9,18.1z"/>
                </svg>
                Download for Android
              </Button>
            </div>
          </motion.div>
          
          {/* Right column - App mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-64 h-[500px] md:w-72 md:h-[580px]">
              {/* Phone frame */}
              <div className="absolute inset-0 bg-gray-800 rounded-[40px] border-4 border-gray-700 shadow-2xl overflow-hidden">
                {/* Status bar */}
                <div className="absolute top-0 inset-x-0 h-6 bg-black flex items-center justify-between px-6">
                  <div className="text-white text-xs">9:41</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-1 bg-white rounded-sm"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-xl"></div>
                
                {/* App screen */}
                <div className="absolute top-6 inset-x-0 bottom-0 bg-gradient-to-b from-blue-900 to-indigo-900 overflow-hidden">
                  {/* App header */}
                  <div className="h-12 bg-black/20 backdrop-blur-sm flex items-center justify-between px-4">
                    <div className="text-white font-semibold">SalesBid</div>
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* App content */}
                  <div className="p-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
                      <div className="text-xs text-blue-300 mb-1">TRENDING NOW</div>
                      <div className="text-white font-medium mb-2">Luxury Watch Collection</div>
                      <div className="flex justify-between items-center">
                        <div className="text-green-400 font-bold">₹2,450</div>
                        <div className="text-xs text-white bg-black/30 px-2 py-1 rounded-full">2h 15m left</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 h-32">
                        <div className="h-16 bg-black/20 rounded-lg mb-2"></div>
                        <div className="h-2 w-2/3 bg-white/30 rounded-full mb-1"></div>
                        <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 h-32">
                        <div className="h-16 bg-black/20 rounded-lg mb-2"></div>
                        <div className="h-2 w-2/3 bg-white/30 rounded-full mb-1"></div>
                        <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-blue-300">YOUR WATCHLIST</div>
                        <div className="text-xs text-white">See All</div>
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center bg-black/20 rounded-lg p-2">
                            <div className="w-10 h-10 bg-black/30 rounded-md mr-3"></div>
                            <div className="flex-1">
                              <div className="h-2 w-3/4 bg-white/30 rounded-full mb-1"></div>
                              <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                            </div>
                            <div className="text-xs text-green-400 font-bold">₹1,200</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom navigation */}
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-black/30 backdrop-blur-sm flex justify-around items-center">
                    {['Home', 'Search', 'Bids', 'Profile'].map((item, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-white/20 rounded-full mb-1"></div>
                        <div className="text-xs text-white/70">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-blue-500/20 rounded-[60px] filter blur-xl -z-10"></div>
            </div>
            
            {/* Download badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-6 bg-white text-gray-900 rounded-full px-4 py-2 flex items-center shadow-lg"
            >
              <Download className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Download Now</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;