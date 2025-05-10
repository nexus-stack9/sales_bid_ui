import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Gavel, Trophy, Repeat } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import bannerImage from "@/assets/banners/banner1.png";

// BlurText component inspired by ReactBits library
const BlurText = ({ text, className }: { text: string; className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  // Split the text to apply gradient only to specific words
  const firstPart = "Exclusive auctions, unbeatable prices—";
  const highlightedPart = "start bidding today!";
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.div
      ref={ref}
      className={cn("w-full flex flex-wrap justify-center", className)}
      variants={container}
      initial="hidden"
      animate={controls}
    >
      {/* First part with regular color */}
      {firstPart.split(" ").map((word, index) => (
        <motion.span
          key={`first-${index}`}
          className="text-xl md:text-2xl font-semibold mx-1 my-1 inline-block text-gray-800"
          variants={child}
        >
          {word}
        </motion.span>
      ))}
      
      {/* Highlighted part with gradient color */}
      {highlightedPart.split(" ").map((word, index) => (
        <motion.span
          key={`highlight-${index}`}
          className="text-xl md:text-2xl font-semibold mx-1 my-1 inline-block"
          style={{
            background: "linear-gradient(to right, #ff7e33, #ff4d4d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="pt-0 pb-12 md:pb-16 relative bg-gray-50">
      {/* Banner Image - Full width with no spacing */}
      <div className="w-full h-auto mb-12">
        <img 
          src={bannerImage} 
          alt="Sales Bid Banner" 
          className="w-full h-auto object-cover"
        />
      </div>
      
      {/* Dot pattern background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            <span className="inline-block" style={{
              background: "linear-gradient(135deg, #0a2240 0%, #1a4b8c 50%, #0a2240 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Discover Premium Auction
              <br />
              Deals
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Access an ever-growing collection of premium, meticulously crafted templates and component packs.
            Save time and focus on what matters—building standout websites that captivate your audience.
          </p>
          
          {/* Bid Win Repeat Icons - Modern Interactive Layout */}
          <div className="flex justify-center items-center gap-6 md:gap-12 mb-6">
            {[
              {
                label: "BID",
                icon: <Gavel className="h-8 w-8 text-primary mb-2" />,
                color: "from-blue-500 to-indigo-600",
                delay: 0,
              },
              {
                label: "WIN",
                icon: <Trophy className="h-8 w-8 text-green-600 mb-2" />,
                color: "from-green-500 to-emerald-600",
                delay: 0.1,
              },
              {
                label: "REPEAT",
                icon: <Repeat className="h-8 w-8 text-yellow-500 mb-2" />,
                color: "from-amber-500 to-yellow-600",
                delay: 0.2,
              },
            ].map(({ label, icon, color, delay }, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div 
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                    whileHover={{ 
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {React.cloneElement(icon as React.ReactElement, { 
                      className: "h-8 w-8 text-white" 
                    })}
                  </motion.div>
                  <motion.div
                    className="mt-3 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <p className="text-base font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {label}
                    </p>
                  </motion.div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/80 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
              </motion.div>
            ))}
          </div>
          
          {/* BlurText Effect */}
          <div className="mb-8">
            <BlurText 
              text="Exclusive auctions, unbeatable prices—start bidding today!" 
              className="text-gray-800"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
              <Link to="/auctions">Explore Collection</Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-gray-300">
              <Link to="/sellers">Unlock Unlimited Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

{/* Bid Win Repeat Icons - Custom Layout Based on Images */}
<div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-12">
  {/* BID */}
  <div className="flex flex-col items-center">
    <div className="w-20 h-20 mb-4">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5f33" />
            <stop offset="100%" stopColor="#ff9933" />
          </linearGradient>
        </defs>
        <g fill="url(#bidGradient)">
          <path d="M50 10C33.4 10 20 21.6 20 36c0 7.8 3.8 14.8 9.9 20H25c-2.8 0-5 2.2-5 5v10c0 2.8 2.2 5 5 5h10l5 10 5-10h10c2.8 0 5-2.2 5-5V61c0-2.8-2.2-5-5-5h-4.9c6.1-5.2 9.9-12.2 9.9-20C60 21.6 46.6 10 30 10z" />
          <path d="M70 50c-2.8 0-5 2.2-5 5v5h-5c-2.8 0-5 2.2-5 5v15c0 5.5 4.5 10 10 10h15c5.5 0 10-4.5 10-10V65c0-2.8-2.2-5-5-5h-5v-5c0-2.8-2.2-5-5-5h-5z" />
        </g>
      </svg>
    </div>
    <h3 className="text-4xl font-black tracking-tight">BID</h3>
  </div>
  
  {/* WIN */}
  <div className="flex flex-col items-center">
    <div className="w-20 h-20 mb-4">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="winGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2a9d2a" />
            <stop offset="100%" stopColor="#5dc75d" />
          </linearGradient>
        </defs>
        <g fill="url(#winGradient)">
          <path d="M50 10c-2.8 0-5 2.2-5 5v5c0 2.8 2.2 5 5 5s5-2.2 5-5v-5c0-2.8-2.2-5-5-5z" />
          <path d="M35 20c-2.8 0-5 2.2-5 5v5c0 2.8 2.2 5 5 5s5-2.2 5-5v-5c0-2.8-2.2-5-5-5z" />
          <path d="M65 20c-2.8 0-5 2.2-5 5v5c0 2.8 2.2 5 5 5s5-2.2 5-5v-5c0-2.8-2.2-5-5-5z" />
          <path d="M30 45h40c2.8 0 5 2.2 5 5v30c0 2.8-2.2 5-5 5H30c-2.8 0-5-2.2-5-5V50c0-2.8 2.2-5 5-5z" />
          <rect x="35" y="55" width="30" height="5" rx="2.5" />
          <rect x="35" y="65" width="30" height="5" rx="2.5" />
          <rect x="35" y="75" width="30" height="5" rx="2.5" />
        </g>
      </svg>
    </div>
    <h3 className="text-4xl font-black tracking-tight">WIN</h3>
  </div>
  
  {/* REPEAT */}
  <div className="flex flex-col items-center">
    <div className="w-20 h-20 mb-4">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="repeatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a56db" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <g fill="url(#repeatGradient)">
          <path d="M65 25c-8.3 0-15.6 4.1-20 10.4C40.6 29.1 33.3 25 25 25c-13.8 0-25 11.2-25 25s11.2 25 25 25h40c13.8 0 25-11.2 25-25s-11.2-25-25-25zm-40 40c-8.3 0-15-6.7-15-15s6.7-15 15-15c5.1 0 9.6 2.5 12.3 6.4l-7.3 7.3 25 5-5-25-7.4 7.4C38.9 31.9 32.3 30 25 30c-11 0-20 9-20 20s9 20 20 20h5c-1.9-1.6-3.5-3.5-4.7-5.7-.7-.1-1.5-.3-2.3-.3zm40 0h-5c1.9-1.6 3.5-3.5 4.7-5.7.8.1 1.6.3 2.3.3 8.3 0 15-6.7 15-15s-6.7-15-15-15c-5.1 0-9.6 2.5-12.3 6.4l7.3 7.3-25 5 5-25 7.4 7.4c3.7-4.2 10.3-6.1 17.6-6.1 11 0 20 9 20 20s-9 20-20 20z" />
        </g>
      </svg>
    </div>
    <h3 className="text-4xl font-black tracking-tight">REPEAT</h3>
  </div>
</div>
