"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

const slides = [
  {
    eyebrow: "The Mulberries Edit",
    title: "Kanjivaram\nSilk Stories",
    copy: "Timeless silk sarees woven for celebrations, traditions and unforgettable moments.",
    ctaLabel: "Explore Kanjivaram",
    href: "/categories/kanchipuram-sarees",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    eyebrow: "Festive Collection",
    title: "Made for\nCelebrations",
    copy: "Rich colours, elegant textures and timeless details for every festive occasion.",
    ctaLabel: "Explore Festive",
    href: "/categories/festive-sarees",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    eyebrow: "Bridal Edit",
    title: "Your Special\nDay",
    copy: "Discover graceful bridal sarees designed to make your most beautiful moments unforgettable.",
    ctaLabel: "Explore Bridal",
    href: "/categories/bridal-sarees",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
  },
  {
    eyebrow: "Everyday Grace",
    title: "Elegance for\nEveryday",
    copy: "Light, effortless sarees that bring comfort and timeless elegance to everyday dressing.",
    ctaLabel: "Explore Kerala Sarees",
    href: "/categories/kerala-sarees",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function FeaturedCollectionSplit() {
  const [active, setActive] = useState(0);

  const slide = slides[active];

  const goTo = (index: number) => {
    setActive((index + slides.length) % slides.length);
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1400px]">

        {/* Section Heading */}

        <div className="mb-7 max-w-2xl sm:mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
            The Mulberries Edit
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Curated for Every Occasion
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
            Discover timeless sarees thoughtfully selected for celebrations,
            traditions and everyday elegance.
          </p>
        </div>

        {/* Featured Collection */}

        <div
          className="
            grid
            min-h-[65vh]
            max-h-[720px]
            overflow-hidden
            rounded-[28px]
            border
            border-neutral-200/80
            bg-[#f7f7f2]
            shadow-sm
            lg:grid-cols-2
          "
        >

          {/* Image */}

          <div className="relative min-h-[350px] overflow-hidden lg:min-h-0">
            {slides.map((item, index) => (
              <div
                key={item.title}
                className="absolute inset-0 transition-opacity duration-700 ease-out"
                style={{
                  opacity: index === active ? 1 : 0,
                }}
                aria-hidden={index !== active}
              >
                <Image
                  src={item.image}
                  alt={item.title.replace("\n", " ")}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={index === 0}
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          {/* Content */}

          <div className="flex min-h-0 flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">

            <div
              key={active}
              className="animate-featured-fade-up"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                {slide.eyebrow}
              </p>

              <h3 className="mt-3 whitespace-pre-line text-3xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl xl:text-[52px]">
                {slide.title}
              </h3>

              <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                {slide.copy}
              </p>

              <Link
                href={slide.href}
                className="
                  mt-7
                  inline-flex
                  w-fit
                  items-center
                  gap-3
                  rounded-full
                  bg-neutral-950
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  hover:scale-[1.03]
                  hover:bg-neutral-800
                "
              >
                {slide.ctaLabel}

                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                />
              </Link>
            </div>

            {/* Controls */}

            <div className="mt-8 flex items-center gap-5 sm:mt-10">

              <button
                type="button"
                aria-label="Previous collection"
                onClick={() => goTo(active - 1)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-300
                  text-neutral-700
                  transition-all
                  duration-300
                  hover:border-neutral-950
                  hover:bg-neutral-950
                  hover:text-white
                "
              >
                <ArrowLeft
                  size={15}
                  strokeWidth={1.8}
                />
              </button>

              <div className="flex items-center gap-4">
                {slides.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Go to collection ${index + 1}`}
                    aria-current={
                      index === active ? "true" : undefined
                    }
                    onClick={() => goTo(index)}
                    className={`text-xs transition-all duration-300 ${
                      index === active
                        ? "font-semibold text-neutral-950"
                        : "text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    0{index + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Next collection"
                onClick={() => goTo(active + 1)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-300
                  text-neutral-700
                  transition-all
                  duration-300
                  hover:border-neutral-950
                  hover:bg-neutral-950
                  hover:text-white
                "
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* Progress */}

            <div className="mt-6 h-px w-full max-w-sm bg-neutral-200">
              <div
                className="h-px bg-neutral-950 transition-all duration-500"
                style={{
                  width: `${((active + 1) / slides.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}