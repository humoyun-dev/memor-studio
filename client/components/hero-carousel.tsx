"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Zamonaviy Uy-joylar",
    subtitle: "Oilangiz uchun mukammal yashash joyi",
    description:
      "Eng so'nggi texnologiyalar va dizayn yechimlar bilan qurilgan zamonaviy uy-joylar",
    image: "/banner.jpg",
    cta: "Uy Loyihalarini Ko'rish",
  },
  {
    title: "Tijorat Binolari",
    subtitle: "Biznesingiz uchun professional muhit",
    description:
      "Ofis binoları, savdo markazlari va sanoat inshootlarini professional darajada qurish",
    image: "/banner2.jpg",
    cta: "Tijorat Loyihalarini Ko'rish",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] lg:h-[700px] overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-full bg-gradient-to-r from-background/90 to-background/50">
            <Image
              src={slide.image || "/placeholder.svg?height=700&width=1200"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
            <div className="absolute inset-0 bg-background/60" />

            <div className="relative h-full flex items-center">
              <div className="container text-center flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                    {slide.title}
                  </h2>
                  <p className="text-xl sm:text-2xl mb-6 text-balance">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg mb-8 text-pretty leading-relaxed">
                    {slide.description}
                  </p>
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-foreground"
                : "bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
