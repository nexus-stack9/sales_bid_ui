import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, TrendingUp, Truck, Zap, Clock, Camera, Video } from "lucide-react";

const IntegrationsSection = () => {
  // Platform-level features for e-commerce
  const platformFeatures = [
    {
      id: 1,
      name: "Verified Buyers & Sellers",
      icon: <ShieldCheck className="h-7 w-7" />,
      description: "Every buyer and seller on SalesBid is verified and KYC-approved — ensuring you trade only with legitimate, trusted businesses.",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: 2,
      name: "Secure Payments",
      icon: <CreditCard className="h-7 w-7" />,
      description: "Multiple payment options with secure processing and buyer protection.",
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      id: 3,
      name: "Live Product Demos",
      icon: <TrendingUp className="h-7 w-7" />,
      description: "Sellers can share live product demos and condition videos before purchase, ensuring full visibility.",
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: 4,
      name: "PAN India Logistics",
      icon: <Truck className="h-7 w-7" />,
      description: "Strategic tie-ups with leading courier & freight partners for seamless nationwide delivery.",
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      id: 5,
      name: "Real-Time Offer Updates",
      icon: <Zap className="h-7 w-7" />,
      description: "Get instant alerts when your offer is accepted or a deal is about to close — never miss a profitable opportunity.",
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      id: 6,
      name: "Instant Deal Processing",
      icon: <Clock className="h-7 w-7" />,
      description: "Our platform handles Buy-Now and Offer submissions instantly, so you can secure lots without lag or manual delays.",
      color: "bg-rose-500",
      lightColor: "bg-rose-50",
      iconColor: "text-rose-600"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
              Why Choose <span className="text-primary">Sales Bid</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Our e-commerce platform is designed with features that make browsing, buying, and selling 
              a seamless, secure, and enjoyable experience.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {platformFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1">
                {/* Icon */}
                <div className={`${feature.lightColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={feature.iconColor}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;