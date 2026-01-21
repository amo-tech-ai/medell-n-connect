import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import images
import medellinSkyline from "@/assets/inspired/medellin-skyline.jpg";
import coffeeRegion from "@/assets/inspired/coffee-region.jpg";
import guatape from "@/assets/inspired/guatape.jpg";
import mountainAdventures from "@/assets/inspired/mountain-adventures.jpg";
import urbanExploration from "@/assets/inspired/urban-exploration.jpg";
import caribbeanCoast from "@/assets/inspired/caribbean-coast.jpg";
import nightlife from "@/assets/inspired/nightlife.jpg";

const slides = [
  { src: medellinSkyline, caption: "Medellín skyline", alt: "Panoramic view of Medellín city skyline at golden hour" },
  { src: coffeeRegion, caption: "Coffee region escapes", alt: "Lush green Colombian coffee farm landscape" },
  { src: guatape, caption: "Guatapé", alt: "Colorful Guatapé town with El Peñol rock" },
  { src: mountainAdventures, caption: "Mountain adventures", alt: "Colombian Andes mountain hiking" },
  { src: urbanExploration, caption: "Urban exploration", alt: "Medellín urban street with cafes and art" },
  { src: caribbeanCoast, caption: "Caribbean coast", alt: "Caribbean beach with palm trees and blue water" },
  { src: nightlife, caption: "Nightlife", alt: "Medellín rooftop bar at night with city lights" },
];

export function GetInspiredSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 320; // Card width + gap
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-20 bg-primary">
      <div className="max-w-[1120px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              Get Inspired
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground">
              Discover your next adventure
            </h2>
          </div>

          {/* Navigation Arrows (desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full h-10 w-10 border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full h-10 w-10 border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.caption}
              className={cn(
                "group relative flex-shrink-0 w-[280px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden snap-start",
                "motion-safe:animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display text-lg lg:text-xl font-semibold text-white">
                  {slide.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
