import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, TrendingUp, Truck, Zap, Clock, Camera, Video } from "lucide-react";

const IntegrationsSection = () => {
  // Replace generic integrations with auction-specific features
  const auctionFeatures = [
    {
      id: 1,
      name: "Verified Buyers & Sellers",
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      description: "Every buyer and seller on SalesBid is verified and KYC-approved — ensuring you trade only with legitimate, trusted businesses."
    },
    {
      id: 2,
      name: "Secure Payments",
      icon: <CreditCard className="h-6 w-6 text-green-500" />,
      description: "Multiple payment options with secure processing ."
    },
    {
      id: 3,
      name: "Real-Time Offer Updates",
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      description: "Get instant alerts when your offer is accepted or a deal is about to close — never miss a profitable opportunity."
    },
    {
      id: 4,
      name: "PAN India Logistics",
      icon: <Truck className="h-6 w-6 text-orange-500" />,
      description: "Strategic tie-ups with leading courier & freight partners for seamless nationwide delivery."
    },
    {
      id: 5,
      name: "Instant Deal Processing",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      description: "Our platform handles Buy-Now and Offer submissions instantly, so you can secure lots without lag or manual delays.."
    },
    {
      id: 6,
      name: "Live Transparency",
      icon: <Video className="h-6 w-6 text-red-500" />,
      description: "Watch sellers go live to showcase stock condition before the sale ends, ensuring full visibility."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why Businesses Trust SalesBid
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
           We combine transparency, secure transactions, and verified B2B relationships to build India’s #1 liquidation ecosystem.
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
