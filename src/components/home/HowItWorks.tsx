import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Steps in the auction process
const steps = [
  {
    icon: <Package className="h-10 w-10 text-white" />,
    title: "Place Your Bid",
    description:
      "Browse our extensive catalog and place bids on premium inventory from trusted sellers.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-white" />,
    title: "Win Auctions",
    description:
      "Secure deals at competitive prices, often 40-60% below retail value.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-white" />,
    title: "Complete Payment",
    description:
      "Use our secure payment system with multiple payment options for your convenience.",
  },
];

// Benefits of using the platform
const benefits = [
  "Access to premium inventory from major retailers",
  "Verified authentic products with detailed descriptions",
  "Secure bidding platform with fraud protection",
  "Dedicated customer support for all your questions",
];

const HowItWorks = () => {
  // References for scroll animations
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 bg-[#002639] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          {/* Main heading */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Maximize your returns with a Sales Bid account that generates.
          </motion.h2>
        </div>

        {/* Steps cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#003a52] rounded-lg p-8 relative"
            >
              {/* Large icon instead of number */}
              <div className="text-[120px] leading-none mb-4 opacity-30 flex justify-start">
                {step.icon}
              </div>
              
              {/* Step content */}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-[#a0b4c0]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
