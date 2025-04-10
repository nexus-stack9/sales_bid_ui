
import { Link } from 'react-router-dom';
import { useInView } from '@/utils/scrollAnimation';
import { useStaggeredAnimation } from '@/utils/scrollAnimation';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Computers, smartphones, and more',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    count: 243,
    icon: '💻'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    description: 'Clothing, shoes, and accessories',
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    count: 187,
    icon: '👔'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    description: 'Furniture, appliances, and decor',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    count: 156,
    icon: '🏠'
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Watches',
    description: 'Fine jewelry, diamonds, and watches',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    count: 89,
    icon: '💎'
  },
];

const Categories = () => {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const getItemStyle = useStaggeredAnimation(categories.length, isInView);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block px-3 py-1 rounded-full bg-secondary-50 text-secondary-800 text-sm font-medium mb-4">
            Categories
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Browse Categories</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you're looking for from our curated selection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <Link 
              to={`/categories/${category.id}`}
              key={category.id}
              style={getItemStyle(index)}
              className="group rounded-xl overflow-hidden bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10"></div>
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
                  {category.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-primary">{category.count} active auctions</span>
                  <span className="text-sm font-medium text-accent group-hover:underline flex items-center">
                    Browse
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
