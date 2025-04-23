import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Users, Award } from "lucide-react";
import { useInView } from "@/utils/scrollAnimation";
import banner1 from "@/assets/banners/banner1.png";
import banner2 from "@/assets/banners/banner2.png";
import banner3 from "@/assets/banners/banner3.png";
import bid_gif from "@/assets/bid_win_repeat_fixed.gif";
import { Gavel, Trophy, Repeat } from "lucide-react";

const banners = [
  { id: 1, image: banner1, alt: "Banner 1" },
  { id: 2, image: banner2, alt: "Banner 2" },
  { id: 3, image: banner3, alt: "Banner 3" },
];

const Hero = () => {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isInView) {
      const textElements = document.querySelectorAll(".animate-text-reveal");
      textElements.forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
      });
    }
  }, [isInView]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white pt-4 sm:pt-6 pb-20 sm:pb-28"
    >
      {/* Carousel */}
      <div className="w-screen mb-8">
        <div className="relative h-56 sm:h-72 md:h-80 lg:h-[30rem] overflow-hidden">
          {banners.map((banner, index) => (
            <img
              key={banner.id}
              src={banner.image}
              alt={banner.alt}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Background SVG */}
      <div className="absolute inset-x-0 top-0 -z-10">
        <svg
          className="w-full"
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,140 C320,100 420,180 720,120 C1020,60 1120,80 1440,100 L1440,0 L0,0 Z"
            fill="#1A365D"
            fillOpacity="0.05"
          />
        </svg>
      </div>

      {/* Main Hero Content */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div
            className={`max-w-2xl transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl font-display font-bold tracking-tight sm:text-5xl lg:text-6xl mb-3">
              Discover{" "}
              <span className="text-primary relative inline-flex flex-col">
                <span className="inline-flex flex-wrap">
                  {"Premium Auction".split("").map((char, index) => (
                    <span
                      key={"line1-" + index}
                      className="relative z-10 animate-text-reveal opacity-0 whitespace-pre-wrap"
                      style={{
                        animationDelay: `${index * 30}ms`,
                        animationFillMode: "forwards",
                        marginRight: char === " " ? "0.25em" : "0.01em",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="inline-flex flex-wrap">
                  {"Deals".split("").map((char, index) => (
                    <span
                      key={"line2-" + index}
                      className="relative z-10 animate-text-reveal opacity-0 whitespace-pre-wrap"
                      style={{
                        animationDelay: `${(index + 14) * 30}ms`,
                        animationFillMode: "forwards",
                        marginRight: char === " " ? "0.25em" : "0.01em",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-600">
              Find exceptional value on surplus, salvage, and returned inventory
              from top retailers and manufacturers.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4">
              <Link to="/auctions">
                <Button
                  size="lg"
                  className="group bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Auctions
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white hover:border-transparent transform hover:scale-105 transition-all duration-300"
                >
                  Sell With Us
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                {
                  icon: <Package className="h-5 w-5 text-secondary-800" />,
                  title: "1000+",
                  subtitle: "Premium Auctions",
                  delay: 200,
                },
                {
                  icon: <Users className="h-5 w-5 text-primary" />,
                  title: "10,000+",
                  subtitle: "Active Buyers",
                  delay: 300,
                },
                {
                  icon: <Award className="h-5 w-5 text-accent" />,
                  title: "35%",
                  subtitle: "Avg. Savings",
                  delay: 400,
                },
              ].map(({ icon, title, subtitle, delay }, i) => (
                <div
                  key={i}
                  className={`flex items-center transition-all duration-500 ${
                    isInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <div className="p-2 rounded-full bg-secondary/20 mr-3">
                    {icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section Image - visible only on desktop */}
          <div
            className={`hidden lg:flex flex-col items-center justify-center space-y-12 transition-all duration-1000 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            {[
              {
                label: "BID",
                icon: <Gavel className="h-12 w-12 text-primary z-10 mb-2" />,
                glowColor: "text-primary/20",
              },
              {
                label: "WIN",
                icon: <Trophy className="h-12 w-12 text-green-600 z-10 mb-2" />,
                glowColor: "text-green-600/20",
              },
              {
                label: "REPEAT",
                icon: (
                  <Repeat className="h-12 w-12 text-yellow-500 z-10 mb-2" />
                ),
                glowColor: "text-yellow-500/20",
              },
            ].map(({ label, icon, glowColor }, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center"
              >
                {/* Glow Layer */}
                <p
                  className={`absolute text-6xl font-extrabold blur-md opacity-30 ${glowColor}`}
                  style={{ top: 10 }}
                >
                  {label}
                </p>

                {/* Foreground Icon + Text */}
                {icon}
                <p className="relative z-10 text-4xl font-extrabold tracking-widest text-gray-900">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
