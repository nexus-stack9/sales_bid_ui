import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// User review data based on the image
const userReviews = [
  {
    id: 1,
    name: "Jill",
    username: "@jill",
    avatarColor: "from-purple-500 to-pink-500",
    content: "I don't know what to say. I'm speechless. This is amazing.",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    name: "John",
    username: "@john",
    avatarColor: "from-green-500 to-blue-500",
    content: "I'm at a loss for words. This is amazing. I love it.",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    name: "Jane",
    username: "@jane",
    avatarColor: "from-pink-200 to-pink-300",
    content: "I'm at a loss for words. This is amazing. I love it.",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: 4,
    name: "Jenny",
    username: "@jenny",
    avatarColor: "from-red-500 to-yellow-500",
    content: "I'm at a loss for words. This is amazing. I love it.",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: 5,
    name: "James",
    username: "@james",
    avatarColor: "from-blue-400 to-green-400",
    content: "I'm at a loss for words. This is amazing. I love it.",
    avatarUrl: "https://github.com/shadcn.png",
  },
  // Duplicate reviews to ensure continuous scrolling
  {
    id: 6,
    name: "Jill",
    username: "@jill",
    avatarColor: "from-purple-500 to-pink-500",
    content: "I don't know what to say. I'm speechless. This is amazing.",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: 7,
    name: "John",
    username: "@john",
    avatarColor: "from-green-500 to-blue-500",
    content: "I'm at a loss for words. This is amazing. I love it.",
    avatarUrl: "https://github.com/shadcn.png",
  },
];

const ReviewsMarquee = () => {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Function to duplicate the reviews for continuous scrolling
  const duplicateReviews = (reviews: typeof userReviews) => {
    return [...reviews, ...reviews];
  };

  const allReviews = duplicateReviews(userReviews);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            What Our Users Say
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who have found amazing deals on our platform
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={marqueeRef}
            className={`flex gap-4 ${
              isPaused ? "" : "animate-marquee"
            } hover:animation-play-state-paused`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {allReviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-64 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className={`h-12 w-12 bg-gradient-to-r ${review.avatarColor}`}>
                    <AvatarImage src={review.avatarUrl} alt={review.name} />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.username}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsMarquee;