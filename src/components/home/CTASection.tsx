import { Gavel, Store, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const features = [
    {
      icon: <Gavel className="w-12 h-12 text-white" />,
      title: "Become a Seller",
      description: "List your items and reach bidders worldwide. Start selling in minutes with our easy-to-use platform.",
      cta: "Start selling",
      color: "from-blue-600 to-blue-800"
    },
    {
      icon: <Store className="w-12 h-12 text-white" />,
      title: "Join Auctions",
      description: "Discover unique items and bid to win at great prices. New auctions added daily with thousands of items.",
      cta: "Start bidding",
      color: "from-purple-600 to-indigo-800"
    },
    {
      icon: <Smartphone className="w-12 h-12 text-white" />,
      title: "Register Now",
      description: "Create your account to access exclusive auctions and start bidding instantly. Free to join with no obligations.",
      cta: "Sign up free",
      color: "from-emerald-600 to-teal-800"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0b1f3a] to-[#071428] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full -mb-20 -ml-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Start With Salesbid Journey ?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Join India’s fastest-growing B2B liquidation network for verified businesses.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="relative rounded-xl overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color}`}></div>
              <div className="relative z-10 p-8 flex flex-col items-center text-center h-full">
                <div className="bg-white/10 p-6 rounded-full mb-6 backdrop-blur-sm">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 mb-6 flex-grow">{feature.description}</p>
                <Button className="bg-white text-primary hover:bg-white/90 transition-colors w-full">
                  {feature.cta} →
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
