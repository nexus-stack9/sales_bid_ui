import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

import fridgeWebp from "@/assets/fridge.webp";
import fridge2Png from "@/assets/fridge2.png";
import washingMachinePng from "@/assets/washing_machine.png";
import tvAvif from "@/assets/TV.avif";
import fridge3Avif from "@/assets/fridge3.avif";

const auctionItems = [
  {
    category: "Electronics / Fridge",
    title:
      "52 Units of Used - Good Condition Refrigerators, Dishwashers, Ranges &...",
    image: fridgeWebp,
    bids: 0,
    endsIn: "1h 13m",
  },
  {
    category: "Electronics / Fridge",
    title:
      "54 Units of Used - Good Condition Refrigerators, Dishwashers, Cooktops ...",
    image: fridge2Png,
    bids: 0,
    endsIn: "1h 28m",
  },
  {
    category: "Electronics / Fridge",
    title: "48 Units of Scratch & Dent Condition Refrigerators, ...",
    image: washingMachinePng,
    bids: 0,
    endsIn: "1h 33m",
  },
  {
    category: "Electronics / Fridge",
    title:
      "54 Units of Used - Good Condition Refrigerators, Dishwashers, Ranges &...",
    image: tvAvif,
    bids: 0,
    endsIn: "1h 23m",
  },
  {
    category: "Electronics / Fridge",
    title: "53 Units of Scratch & Dent Condition Refrigerators, Freezers,...",
    image: fridge3Avif,
    bids: 5,
    endsIn: "1h 18m",
  },
  {
    category: "Electronics / Fridge",
    title: "51 Units of Scratch & Dent Condition Ranges, Freezers,...",
    image: fridge2Png,
    bids: 14,
    endsIn: "1h 10m",
  },
];

const LiveAuctions = () => {
  return (
    <section className="py-10 bg-gradient-to-r from-white via-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900">
            Live Auctions
          </h2>
        </div>
        <Carousel opts={{ loop: true }}>
          <div className="flex gap-2 mb-4 justify-between md:justify-end w-full">
            <CarouselPrevious className="rounded-full shadow bg-white/80 hover:bg-blue-100 transition" />
            <CarouselNext className="rounded-full shadow bg-white/80 hover:bg-blue-100 transition" />
          </div>
          <CarouselContent>
            {auctionItems.map((item, idx) => (
              <CarouselItem
                key={idx}
                className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-2"
              >
                <div className="bg-white rounded-xl shadow-md transition overflow-hidden flex flex-col h-full border border-gray-200 hover:border-black">
                  <div className="px-4 pt-4 pb-2 flex flex-col items-center">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 text-center">
                      {item.category}
                    </span>
                    <hr className="w-full border-t border-gray-200 mb-2" />
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-contain object-center bg-gray-50"
                  />
                  <hr className="w-full border-t border-gray-200 mt-2" />
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <h3 className="font-semibold text-base text-gray-800 mb-2 line-clamp-2 text-center min-h-[48px]">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-500">
                        Bids{" "}
                        <span className="font-bold text-gray-700">
                          {item.bids}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                        Closes in{" "}
                        <span className="font-semibold">{item.endsIn}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default LiveAuctions;
