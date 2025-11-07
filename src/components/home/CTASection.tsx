import { Gavel, Store, Smartphone, ArrowRight, CheckCircle, TrendingUp, Users, Package, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  const features = [
    {
      icon: <Gavel className="w-8 h-8" />,
      title: "Become a Seller",
      description: "List your items and reach buyers worldwide. Start selling in minutes with our easy-to-use platform.",
      cta: "Start selling",
      route: "/sellerRegistration",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      stats: "10K+ Active Sellers"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Join Auctions",
      description: "Discover unique items and bid to win at great prices. New auctions added daily with thousands of items.",
      cta: "Start bidding",
      route: "/auctions",
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      stats: "500+ Daily Auctions"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Register Now",
      description: "Create your account to access exclusive auctions and start bidding instantly. Free to join with no obligations.",
      cta: "Sign up free",
      route: "/signup",
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      stats: "Join 50K+ Users"
    },
  ];

  const benefits = [
    "Secure transactions",
    "24/7 Support",
    "Best prices guaranteed",
    "Fast shipping"
  ];

  const uniqueFeatures = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "No Middleman",
      description: "Direct B2B deals",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <Package className="w-7 h-7" />,
      title: "All Lot Sizes",
      description: "From small to bulk",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: <IndianRupee className="w-7 h-7" />,
      title: "Attractive Prices",
      description: "40-60% below retail",
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -mt-48 -mr-48 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-50 to-blue-50 rounded-full -mb-48 -ml-48 blur-3xl opacity-50"></div>
      
      {/* Decorative dots pattern */}
      <div className="absolute top-20 left-10 w-20 h-20 opacity-5">
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-900 rounded-full"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Get Started Today
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Sales Bid Journey?
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join thousands of users who are already buying and selling on Sales Bid
            </p>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 h-full shadow-sm hover:shadow-2xl">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`${feature.lightColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </div>

                  {/* Stats badge */}
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 mb-4 self-start">
                    <TrendingUp className="w-3 h-3" />
                    {feature.stats}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* CTA Button */}
                  <Button 
                    asChild
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 group/btn`}
                    size="lg"
                  >
                    <Link to={feature.route}>
                      {feature.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Decorative corner element */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unique B2B Features Section - Clean White UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    Search auctions via the largest network of{" "}
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      B2B liquidation marketplaces
                    </span>
                  </h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Connect directly with verified sellers and access premium inventory at unbeatable prices
                  </p>
                </motion.div>
              </div>

              {/* Three Feature Cards */}
              <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
                {uniqueFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10 text-center">
                        {/* Icon */}
                        <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          <div className={feature.iconColor}>
                            {feature.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>

                        {/* Decorative gradient line */}
                        <div className={`mt-6 h-1 w-12 bg-gradient-to-r ${feature.color} rounded-full mx-auto group-hover:w-full transition-all duration-300`}></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 font-semibold shadow-lg hover:shadow-xl transition-all px-8"
                >
                  <Link to="/auctions">
                    Explore Auctions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;