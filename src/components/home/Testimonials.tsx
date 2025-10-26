import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, User } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Neeraj",
    role: "Retail Business Owner",
    image: "",
    content: "Sales Bid has transformed how I source inventory for my store. The platform is intuitive, and I've found incredible deals that have significantly increased my profit margins.",
    rating: 5
  },
  {
    id: 2,
    name: "Prakash",
    role: "Professional Reseller",
    image: "",
    content: "As someone who resells full-time, I've tried many auction platforms. Sales Bid stands out with its transparent bidding process and exceptional customer service.",
    rating: 5
  },
  {
    id: 3,
    name: "Suhas",
    role: "Collector",
    image: "",
    content: "I've been able to find rare items for my collection that I couldn't source anywhere else. The verification process gives me confidence in the authenticity of every purchase.",
    rating: 4
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const renderTestimonialCard = (testimonial: typeof testimonials[0]) => (
    <div className="bg-white rounded-xl p-6 shadow-md relative">
      <div className="absolute -top-4 -right-4 bg-primary text-white p-3 rounded-full">
        <Quote className="h-5 w-5" />
      </div>
      
      <div className="flex items-center mb-4">
        {testimonial.image ? (
          <img 
            src={testimonial.image} 
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-gray-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200">
            <User className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <div>
          <h3 className="font-semibold">{testimonial.name}</h3>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
      
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    </div>
  );

  // Handle swipe
  const handleSwipe = (direction: number) => {
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) {
      newIndex = testimonials.length - 1;
    } else if (newIndex >= testimonials.length) {
      newIndex = 0;
    }
    
    setCurrentIndex(newIndex);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-3">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied buyers and sellers who have found success on our platform
          </p>
        </div>
        
        {isMobile ? (
          <div className="relative max-w-sm mx-auto px-4">
            <div 
              className="touch-pan-y"
              onTouchStart={(e) => {
                const touchStartX = e.touches[0].clientX;
                
                const handleTouchEnd = (e: TouchEvent) => {
                  const touchEndX = e.changedTouches[0].clientX;
                  const diff = touchStartX - touchEndX;
                  
                  // Determine swipe direction if the swipe is significant enough
                  if (Math.abs(diff) > 50) {
                    handleSwipe(diff > 0 ? 1 : -1);
                  }
                  
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              {renderTestimonialCard(testimonials[currentIndex])}
            </div>
            
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {renderTestimonialCard(testimonial)}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;