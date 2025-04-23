import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  UserRound,
  Search,
  DollarSign,
  PackageCheck,
} from "lucide-react";
import { useInView } from "@/utils/scrollAnimation";
import { useStaggeredAnimation } from "@/utils/scrollAnimation";

const steps = [
  {
    number: "01",
    title: "Create an account",
    description:
      "Sign up for free and get verified to start bidding on premium inventory.",
    icon: <UserRound className="h-6 w-6 text-primary" />,
  },
  {
    number: "02",
    title: "Browse auctions",
    description:
      "Explore thousands of auctions from retailers and manufacturers.",
    icon: <Search className="h-6 w-6 text-primary" />,
  },
  {
    number: "03",
    title: "Place your bid",
    description: "Find the perfect lot and place a competitive bid.",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
  },
  {
    number: "04",
    title: "Win & Receive",
    description: "If you win, complete payment and receive your items.",
    icon: <PackageCheck className="h-6 w-6 text-primary" />,
  },
];

const HowItWorks = () => {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const getItemStyle = useStaggeredAnimation(steps.length, isInView);

  return (
    <section ref={ref} className="py-12 bg-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <svg
          className="w-full h-full opacity-5"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Easy Process
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            How It Works
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple steps to start bidding and winning auctions in our
            marketplace
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                style={getItemStyle(index)}
                className="flex flex-col items-center text-center relative"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 border border-primary/10 shadow-sm relative">
                  {step.icon}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground shadow-lg">
                    {step.number.split("")[1]}
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-display font-semibold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className={`mt-14 text-center transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="group border-primary text-primary hover:bg-primary-50">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorks;
