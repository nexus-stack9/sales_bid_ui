import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gavel, Trophy, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import bannerImage from "@/assets/banners/banner1.png";

// Simplified BlurText component without animations
const BlurText = ({ text, className }: { text: string; className?: string }) => {
  // Split the text to apply gradient only to specific words
  const firstPart = "Exclusive auctions, unbeatable prices—";
  const highlightedPart = "start bidding today!";
  
  return (
    <div className={cn("w-full flex flex-wrap justify-center", className)}>
      {/* First part with regular color */}
      {firstPart.split(" ").map((word, index) => (
        <span
          key={`first-${index}`}
          className="text-xl md:text-2xl font-semibold mx-1 my-1 inline-block text-gray-800"
        >
          {word}
        </span>
      ))}
      
      {/* Highlighted part with gradient color */}
      {highlightedPart.split(" ").map((word, index) => (
        <span
          key={`highlight-${index}`}
          className="text-xl md:text-2xl font-semibold mx-1 my-1 inline-block"
          style={{
            background: "linear-gradient(to right, #ff7e33, #ff4d4d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

const Hero = () => {
  return (
<section className="pt-20 pb-12 md:pb-16 relative bg-gray-50">
      
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
