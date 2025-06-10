import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus("success");
      setEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="dotPattern" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#dotPattern)" />
            {/* Create a pattern of dots */}
            {Array.from({ length: 100 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r="0.15"
                fill="white"
                opacity="0.2"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated on Exclusive Auctions
            </h2>
            
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about upcoming auctions, 
              special deals, and insider bidding tips.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-4 pr-36 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white w-full rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={isSubmitting || status === "success"}
                />
                <Button 
                  type="submit" 
                  className="absolute right-1.5 top-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg"
                  disabled={isSubmitting || status === "success"}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : status === "success" ? (
                    <span className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Subscribed!
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
              
              {status === "error" && (
                <div className="absolute -bottom-8 left-0 right-0 text-red-300 text-sm flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errorMessage}
                </div>
              )}
            </form>
            
            <p className="text-sm text-blue-200/70 mt-12">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-blue-200">Subscribers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white">Weekly</div>
              <div className="text-sm text-blue-200">Updates</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white">Early</div>
              <div className="text-sm text-blue-200">Access</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;