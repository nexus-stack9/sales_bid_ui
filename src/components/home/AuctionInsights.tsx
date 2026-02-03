import React from "react";
import { motion } from "framer-motion";
import { LineChart, BarChart, PieChart, ArrowRight, TrendingUp, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Insights data
const insightCards = [
  {
    title: "Market Trends",
    description: "Explore the latest trends in auction markets across different categories",
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    stats: [
      { label: "Electronics", value: "+24%", trend: "up" },
      { label: "Collectibles", value: "+18%", trend: "up" },
      { label: "Jewelry", value: "+12%", trend: "up" }
    ],
    chartIcon: <LineChart className="h-16 w-16 text-blue-200" />
  },
  {
    title: "Price Analysis",
    description: "Get insights on pricing patterns and purchasing strategies",
    icon: <DollarSign className="h-6 w-6 text-green-500" />,
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    stats: [
      { label: "Avg. Discount", value: "22%", trend: "neutral" },
      { label: "Price Increments", value: "₹500+", trend: "neutral" },
      { label: "Final Price", value: "78%", trend: "up" }
    ],
    chartIcon: <BarChart className="h-16 w-16 text-green-200" />
  },
  {
    title: "Buyer Demographics",
    description: "Understand who's buying what and regional preferences",
    icon: <Users className="h-6 w-6 text-purple-500" />,
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
    stats: [
      { label: "Age 25-34", value: "42%", trend: "neutral" },
      { label: "Urban", value: "65%", trend: "up" },
      { label: "Repeat Buyers", value: "38%", trend: "up" }
    ],
    chartIcon: <PieChart className="h-16 w-16 text-purple-200" />
  }
];

const AuctionInsights = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Product Insights & Analytics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make informed purchasing decisions with our comprehensive product analytics and market insights
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insightCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`rounded-xl border ${card.color} p-6 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
            >
              <div className="absolute right-0 bottom-0 opacity-10">{card.chartIcon}</div>
              
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-6">{card.description}</p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {card.stats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className={`text-sm font-bold ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'down' ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              
              <Button asChild variant="ghost" className="w-full justify-between border border-gray-200 hover:bg-gray-50">
                <Link to="/insights" className="flex items-center">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6 max-w-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Get Personalized Product Recommendations
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI-powered recommendation engine analyzes your shopping history and preferences to suggest products that match your interests. Create an account to unlock personalized recommendations.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                <Link to="/register">
                  Create Free Account
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="w-64 h-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 relative z-10">
                <div className="h-4 w-1/2 bg-blue-100 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-blue-100 rounded-full mb-4"></div>
                <div className="h-4 w-2/3 bg-blue-100 rounded-full mb-8"></div>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 mr-3"></div>
                  <div>
                    <div className="h-3 w-24 bg-blue-100 rounded-full mb-2"></div>
                    <div className="h-3 w-16 bg-blue-100 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 mr-3"></div>
                  <div>
                    <div className="h-3 w-24 bg-green-100 rounded-full mb-2"></div>
                    <div className="h-3 w-16 bg-green-100 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 mr-3"></div>
                  <div>
                    <div className="h-3 w-24 bg-purple-100 rounded-full mb-2"></div>
                    <div className="h-3 w-16 bg-purple-100 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-xl -z-10"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuctionInsights;