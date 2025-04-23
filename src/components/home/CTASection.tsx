import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInView } from "@/utils/scrollAnimation";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Save up to 60% on retail prices",
  "Access to premium inventory",
  "Verified authentic products",
  "Secure bidding platform",
];

const CTASection = () => {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="relative py-12 overflow-hidden"
      style={{
        background: "linear-gradient(to right, #1A365D, #2C476D)",
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="circles"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1.5" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circles)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                Ready to Start?
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white">
                Join Thousands of Smart Bidders Today
              </h2>
              <p className="mt-6 text-lg text-primary-100">
                Sign up now to access exclusive auction deals and start saving
                on premium products.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex items-center transition-all duration-500 ${
                      isInView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Create an Account
                  </Button>
                </Link>
                <Link to="/auctions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-white border-white hover:bg-white/10 font-medium"
                  >
                    Browse Auctions
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 ${
                isInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-secondary/20 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-accent/20 blur-2xl"></div>

                <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                  <div className="absolute -top-5 -right-5 bg-secondary text-white text-sm font-bold px-4 py-2 rounded-lg rotate-3">
                    Limited Time
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4 text-gray-900">
                    New User Special
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Register today and receive:
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <span className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span>$50 bidding credit on your first purchase</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span>Early access to featured auctions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span>Free shipping on your first won auction</span>
                    </li>
                  </ul>
                  <Link to="/signup" className="block">
                    <Button className="w-full bg-primary hover:bg-primary-600">
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
