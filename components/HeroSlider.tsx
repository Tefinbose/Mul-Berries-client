"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Package,
  Banknote,
  Truck,
} from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/products/upgraded2.png",
    eyebrow: "NEW COLLECTION",
    title: "Elegance, Woven\nInto Every Moment",
    description:
      "Discover timeless styles crafted for the woman who loves to stand out.",
    button: "Shop Collection",
  },
  {
    id: 2,
    image: "/products/upgraded1.png",
    eyebrow: "THE FESTIVE EDIT",
    title: "Celebrate In\nSomething Beautiful",
    description:
      "Graceful silhouettes and beautiful fabrics made for your special moments.",
    button: "Explore Festive",
  },
  {
    id: 3,
    image: "/products/upgraded3.png",
    eyebrow: "TIMELESS STYLE",
    title: "Tradition Meets\nModern Elegance",
    description:
      "Thoughtfully selected pieces that bring effortless elegance to every occasion.",
    button: "Discover More",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="w-full bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}
      <div className="relative w-full overflow-hidden bg-[#5b0d1c]">
        <div
          key={slide.id}
          className="
            relative
            h-[520px]
            w-full
            overflow-hidden

            sm:h-[580px]

            md:h-[620px]

            lg:h-[calc(100svh-162px)]
            lg:min-h-[600px]

            xl:h-[720px]
          "
        >
          {/* =================================================
              1. BLURRED BACKGROUND
              
              Mobile and desktop background layer
          ================================================= */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                scale-110
                object-cover
                object-center
                blur-[25px]
              "
            />

            <div className="absolute inset-0 bg-[#5b0d1c]/40" />
          </div>

          {/* =================================================
              2. SHARP IMAGE

              MOBILE:
              Full screen background image

              DESKTOP:
              Image occupies right side
          ================================================= */}
          <div
            className="
              absolute
              inset-0
              z-[5]
              w-full

              lg:inset-y-0
              lg:left-auto
              lg:right-0
              lg:w-[67%]

              xl:w-[68%]
            "
          >
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.title.replace("\n", " ")}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center

                lg:object-[65%_center]
              "
            />
          </div>

          {/* =================================================
              3. HERO TEXT GRADIENT

              MOBILE:
              Gradient comes from bottom so the image
              remains visible while text is readable.

              DESKTOP:
              Original left-to-right burgundy gradient.
          ================================================= */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-10
              w-full

              bg-gradient-to-t
              from-[#250008]
              via-[#3c0712]/55
              to-transparent

              lg:inset-y-0
              lg:left-0
              lg:right-auto
              lg:w-[76%]

              lg:bg-gradient-to-r
              lg:from-[#250008]
              lg:via-[#3c0712]/95
              lg:via-[38%]
              lg:via-[#4d0a18]/75
              lg:to-transparent
            "
          />

          {/* =================================================
              4. EXTRA BLEND
          ================================================= */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-10

              bg-gradient-to-t
              from-black/25
              via-transparent
              to-black/10
            "
          />

          {/* =================================================
              5. HERO CONTENT
          ================================================= */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="site-container w-full">
              <div
                className="
                  max-w-[430px]
                  text-white

                  sm:max-w-[500px]

                  md:max-w-[540px]

                  lg:max-w-[590px]

                  xl:max-w-[620px]
                "
              >
                {/* EYEBROW */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-9 bg-white/90 sm:w-12" />

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.32em]
                      text-white/90

                      sm:text-[10px]

                      lg:text-[11px]
                    "
                  >
                    {slide.eyebrow}
                  </p>
                </div>

                {/* TITLE */}
                <h1
                  className="
                    whitespace-pre-line
                    text-[42px]
                    font-semibold
                    leading-[1.02]
                    tracking-[-0.04em]

                    sm:text-[50px]

                    md:text-[58px]

                    lg:text-[64px]

                    xl:text-[70px]
                  "
                >
                  {slide.title}
                </h1>

                {/* DESCRIPTION */}
                <p
                  className="
                    mt-6
                    max-w-[480px]
                    text-[12px]
                    leading-6
                    text-white/80

                    sm:text-[13px]

                    lg:text-[15px]
                    lg:leading-7
                  "
                >
                  {slide.description}
                </p>

                {/* BUTTON */}
                <div className="mt-8">
                  <Link
                    href="/products"
                    className="
                      group
                      inline-flex
                      items-center
                      gap-4
                      rounded-full
                      bg-white
                      px-7
                      py-4
                      text-[12px]
                      font-semibold
                      text-[#171717]
                      shadow-lg
                      transition-all
                      duration-300

                      hover:bg-[#971444]
                      hover:text-white
                      hover:shadow-xl

                      sm:px-8
                      sm:text-[13px]
                    "
                  >
                    {slide.button}

                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              SLIDER DOTS
          ================================================= */}
          <div
            className="
              absolute
              bottom-6
              left-0
              right-0
              z-30
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={
                  current === index ? "true" : undefined
                }
                className={`
                  h-[7px]
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    current === index
                      ? "w-11 bg-white"
                      : "w-[7px] bg-white/50 hover:bg-white"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          SERVICE FEATURES
      ===================================================== */}
      <div className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3">

          {/* FREE RETURNS */}
          <div
            className="
              flex
              min-h-[100px]
              flex-col
              items-center
              justify-center
              px-2
              text-center

              sm:min-h-[110px]
            "
          >
            <div className="mb-2 text-[#e52d72]">
              <Package
                size={24}
                strokeWidth={1.5}
                className="sm:h-7 sm:w-7"
              />
            </div>

            <p className="text-[11px] font-bold text-[#303030] sm:text-[14px]">
              FREE RETURNS
            </p>

            <p className="mt-0.5 text-[10px] text-[#444] sm:text-[12px]">
              Within 7 days
            </p>
          </div>

          {/* CASH ON DELIVERY */}
          <div
            className="
              relative
              flex
              min-h-[100px]
              flex-col
              items-center
              justify-center
              px-2
              text-center

              sm:min-h-[110px]
            "
          >
            <span
              className="
                absolute
                left-0
                top-1/2
                h-10
                w-px
                -translate-y-1/2
                bg-[#e5e5e5]
              "
            />

            <div className="mb-2 text-[#e52d72]">
              <Banknote
                size={24}
                strokeWidth={1.5}
                className="sm:h-7 sm:w-7"
              />
            </div>

            <p className="text-[11px] font-bold text-[#303030] sm:text-[14px]">
              CASH ON DELIVERY
            </p>

            <p className="mt-0.5 text-[10px] text-[#444] sm:text-[12px]">
              On all orders
            </p>
          </div>

          {/* FREE DELIVERY */}
          <div
            className="
              relative
              flex
              min-h-[100px]
              flex-col
              items-center
              justify-center
              px-2
              text-center

              sm:min-h-[110px]
            "
          >
            <span
              className="
                absolute
                left-0
                top-1/2
                h-10
                w-px
                -translate-y-1/2
                bg-[#e5e5e5]
              "
            />

            <div className="mb-2 text-[#e52d72]">
              <Truck
                size={24}
                strokeWidth={1.5}
                className="sm:h-7 sm:w-7"
              />
            </div>

            <p className="text-[11px] font-bold text-[#303030] sm:text-[14px]">
              FREE DELIVERY
            </p>

            <p className="mt-0.5 text-[10px] text-[#444] sm:text-[12px]">
              On orders above ₹699
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}