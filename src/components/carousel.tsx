"use client";

import type React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export interface CarouselItem {
  id: number;
  title: string;
  body: string;
  image?: string;
  video?: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <div className="overflow-hidden w-full relative" ref={emblaRef}>
      <div className="flex">
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[110vh] relative flex items-center justify-center"
          >
            {/* Background: video yoki rasm */}
            {item.video ? (
              <video
                src={item.video}
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={item.image || "/fallback.jpg"}
                alt={item.title}
                fill
                className="object-cover"
              />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Text content */}
            <div className="relative z-10 text-center text-white max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase mb-3 sm:mb-4 leading-tight">
                {item.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
