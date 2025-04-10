
import { useEffect, useState, useRef } from 'react';

// Hook for determining if an element is in viewport
export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const current = ref.current;
    if (!current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );
    
    observer.observe(current);
    return () => {
      observer.unobserve(current);
    };
  }, []);

  return { ref, isInView };
}

// Staggered animation helper for child elements
export function useStaggeredAnimation(totalItems: number, isParentInView: boolean) {
  return (index: number) => {
    return {
      opacity: isParentInView ? 1 : 0,
      transform: isParentInView ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.5s ease, transform 0.5s ease ${index * 0.1}s`
    };
  };
}
