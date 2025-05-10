import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, TrendingUp, Truck, Zap, Clock } from "lucide-react";

const IntegrationsSection = () => {
  // Replace generic integrations with auction-specific features
  const auctionFeatures = [
    {
      id: 1,
      name: "Secure Bidding",
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      description: "Our platform uses bank-level encryption to protect your bids and personal information"
    },
    {
      id: 2,
      name: "Easy Payments",
      icon: <CreditCard className="h-6 w-6 text-green-500" />,
      description: "Multiple payment options with secure processing and buyer protection"
    },
    {
      id: 3,
      name: "Real-time Updates",
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      description: "Get instant notifications when you're outbid or when auctions are ending soon"
    },
    {
      id: 4,
      name: "Fast Shipping",
      icon: <Truck className="h-6 w-6 text-orange-500" />,
      description: "Tracked shipping options with delivery guarantees on all won auctions"
    },
    {
      id: 5,
      name: "Lightning Fast Bids",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      description: "Our platform processes bids instantly with no lag or delays"
    },
    {
      id: 6,
      name: "Extended Bidding",
      icon: <Clock className="h-6 w-6 text-red-500" />,
      description: "Auctions automatically extend when bids are placed in the final minutes"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why Choose Sales Bid
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our auction platform is designed with features that make buying and selling 
            a seamless, secure, and enjoyable experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctionFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
