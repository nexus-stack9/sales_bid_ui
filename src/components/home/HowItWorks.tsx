import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Steps in the auction process
const steps = [
  {
    icon: <Package className="h-8 w-8" />,
    title: "Place Your Bid",
    description:
      "Browse our extensive catalog and place bids on premium inventory from trusted sellers.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    number: "01"
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Win Auctions",
    description:
      "Secure deals at competitive prices, often 40-60% below retail value.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    number: "02"
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Complete Payment",
    description:
      "Use our secure payment system with multiple payment options for your convenience.",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    number: "03"
  },
];

// Benefits of using the platform
const benefits = [
  {
    text: "Access to premium inventory from major retailers",
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    text: "Verified authentic products with detailed descriptions",
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    text: "Secure bidding platform with fraud protection",
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    text: "Dedicated customer support for all your questions",
    icon: <CheckCircle className="h-5 w-5" />
  },
];

const HowItWorks = () => {
  // References for scroll animations
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
              Maximize your returns with a{" "}
              <span className="text-primary">Sales Bid</span> account
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful buyers getting premium inventory at unbeatable prices
            </p>
          </motion.div>
        </div>

        {/* Steps cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 h-full relative overflow-hidden">
                {/* Decorative number background */}
                <div className="absolute top-4 right-4 text-7xl font-bold text-gray-50 select-none">
                  {step.number}
                </div>
                
                {/* Icon with colored background */}
                <div className={`${step.color} ${step.lightColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>
                
                {/* Step content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed relative z-10">
                  {step.description}
                </p>

                {/* Hover arrow */}
                {/* <div className="mt-6 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div> */}
              </div>

              {/* Connecting arrow (hidden on last card and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <ArrowRight className="h-6 w-6 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Benefits list */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Why choose Sales Bid?
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 group-hover:bg-emerald-500 transition-colors">
                      <CheckCircle className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">
                      {benefit.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right side - CTA */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">
                Ready to get started?
              </h4>
              <p className="mb-6 text-white/90">
                Join our platform today and start bidding on premium inventory from trusted sellers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 font-semibold"
                >
                  <Link to="/register">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link to="/auctions">
                    Browse Auctions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;