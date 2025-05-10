import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// CountUp component for animating numbers
const CountUp = ({ end, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(percentage);
      
      setCount(Math.floor(easedProgress * end));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

const CompanyStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById("company-stats");
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.disconnect();
      }
    };
  }, []);
  
  return (
    <section id="company-stats" className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Founded Year */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="p-6 bg-gray-800 rounded-xl shadow-lg"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-2">
              {isVisible ? <CountUp end={2000} duration={2000} suffix="+" /> : "0"}
            </h2>
            <p className="text-gray-300">Auctions</p>
          </motion.div>
          
          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-gray-800 rounded-xl shadow-lg"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-2">
              {isVisible ? <CountUp end={500} duration={2000} suffix="+" /> : "0"}
            </h2>
            <p className="text-gray-300">Active Users</p>
          </motion.div>
          
          {/* Company Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 bg-gray-800 rounded-xl shadow-lg"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-2">
              {isVisible ? <CountUp end={4000} duration={2000} suffix="+" /> : "0"}
            </h2>
            <p className="text-gray-300">Products Sold</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;