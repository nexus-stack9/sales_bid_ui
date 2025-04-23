import { Link } from "react-router-dom";
import { useInView } from "@/utils/scrollAnimation";
import { useStaggeredAnimation } from "@/utils/scrollAnimation";

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Computers, smartphones, and more",
    imageUrl:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000",
    count: 243,
    icon: "💻",
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    description: "Clothing, shoes, and accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000",
    count: 187,
    icon: "👔",
  },
  {
    id: "home",
    name: "Home & Garden",
    description: "Furniture, appliances, and decor",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000",
    count: 156,
    icon: "🏠",
  },
  {
    id: "jewelry",
    name: "Jewelry & Watches",
    description: "Fine jewelry, diamonds, and watches",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000",
    count: 89,
    icon: "💎",
  },
];

const Categories = () => {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const getItemStyle = useStaggeredAnimation(categories.length, isInView);

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold mb-6 shadow-sm">
            Explore Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">
            Discover Our Categories
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our carefully curated selection of premium products across
            various categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              to={`/categories/${category.id}`}
              key={category.id}
              style={getItemStyle(index)}
              className="group relative rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-700/10 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90"></div>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 left-4 z-20 w-14 h-14 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-3xl shadow border border-gray-200">
                  {category.icon}
                </div>
              </div>
              <div className="p-7 relative bg-white rounded-b-2xl shadow-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 opacity-70 rounded-t-xl"></div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
                <div className="mt-5 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                    {category.count} active auctions
                  </span>
                  <span className="text-sm font-semibold text-gray-800 flex items-center gap-1 transition-colors duration-200">
                    Explore Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
