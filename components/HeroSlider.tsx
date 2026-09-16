"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90",
    eyebrow: "NEW COLLECTION",
    title: "Elegance, Woven\nInto Every Moment",
    description:
      "Discover timeless styles crafted for the woman who loves to stand out.",
    button: "Shop Collection",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=90",
    eyebrow: "THE FESTIVE EDIT",
    title: "Celebrate In\nSomething Beautiful",
    description:
      "Graceful silhouettes and beautiful fabrics made for your special moments.",
    button: "Explore Festive",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1800&q=90",
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
      ====================================================== */}
      <div className="relative w-full overflow-hidden">
        {/* ===================================================
            BACKGROUND IMAGE
        ==================================================== */}
        <div
          key={slide.id}
          className="
            relative
            h-[360px]
            w-full
            bg-cover
            bg-center
            bg-no-repeat
            transition-opacity
            duration-500

            sm:h-[420px]

            md:h-[480px]

            lg:h-[calc(100svh-200px)]
          "
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundPosition: "center 30%",
          }}
        >
          {/* =================================================
              DARK GRADIENT

              Helps the text remain readable.
          ================================================== */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/65
              via-black/30
              to-transparent
            "
          />

          {/* =================================================
              HERO CONTENT
          ================================================== */}
          <div
            key={`content-${slide.id}`}
            className="
              absolute
              inset-y-0
              left-0
              flex
              w-full
              items-center
            "
          >
            <div
              className="
                w-full
                max-w-[1400px]
                px-6
                sm:px-10
                lg:px-16
                xl:px-20
              "
            >
              <div
                className="
                  max-w-[430px]
                  text-white
                  sm:max-w-[500px]
                  lg:max-w-[540px]
                "
              >
                {/* EYEBROW */}
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <span className="h-px w-7 bg-white sm:w-10" />

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.3em]
                      text-white/80
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
                    text-3xl
                    font-semibold
                    leading-[1.05]
                    tracking-[-0.03em]

                    sm:text-4xl

                    md:text-5xl

                    lg:text-6xl

                    xl:text-[68px]
                  "
                >
                  {slide.title}
                </h1>

                {/* DESCRIPTION */}
                <p
                  className="
                    mt-4
                    max-w-[420px]
                    text-xs
                    leading-5
                    text-white/80

                    sm:mt-5
                    sm:text-sm
                    sm:leading-6

                    lg:text-[15px]
                    lg:leading-7
                  "
                >
                  {slide.description}
                </p>

                {/* CTA */}
                <div className="mt-6 sm:mt-7">
                  <Link
                    href="/products"
                    className="
                      inline-flex
                      items-center
                      gap-3
                      rounded-full
                      bg-white
                      px-5
                      py-3
                      text-xs
                      font-semibold
                      text-neutral-950
                      transition-all
                      duration-300
                      hover:gap-4
                      hover:bg-[#971444]
                      hover:text-white

                      sm:px-6
                      sm:py-3.5
                      sm:text-sm
                    "
                  >
                    {slide.button}

                    <ArrowRight
                      size={15}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SLIDER DOTS
        ==================================================== */}
        <div
          className="
            absolute
            bottom-4
            left-0
            right-0
            z-10
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
              className={`
                h-[7px]
                rounded-full
                transition-all
                duration-300
                ${
                  current === index
                    ? "w-12 bg-white"
                    : "w-[7px] bg-white/70"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          BENEFITS
      ====================================================== */}
      <div className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3">
          {/* =================================================
              FREE RETURNS
          ================================================== */}
          <div
            className="
              flex
              min-h-[112px]
              flex-col
              items-center
              justify-center
              px-2
              text-center
              lg:min-h-[110px]
            "
          >
            <div className="mb-2 text-[#e52d72]">
              <svg
                width="27"
                height="27"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 10.5 16 4l11 6.5v12L16 29 5 22.5v-12Z" />
                <path d="m5 10.5 11 6 11-6" />
                <path d="M16 16.5V29" />
                <path d="M11 8l11 6" />
                <path d="M22 19h6" />
                <path d="M25 16l3 3-3 3" />
              </svg>
            </div>

            <p className="text-[13px] font-bold text-[#303030] sm:text-[15px]">
              FREE RETURNS
            </p>

            <p className="mt-0.5 text-[11px] text-[#444] sm:text-[12px]">
              Within 7 days
            </p>
          </div>

          {/* =================================================
              CASH ON DELIVERY
          ================================================== */}
          <div
            className="
              relative
              flex
              min-h-[112px]
              flex-col
              items-center
              justify-center
              px-2
              text-center
              lg:min-h-[110px]
            "
          >
            <span className="absolute left-0 top-1/2 h-8 -translate-y-1/2 border-l border-[#d6d6d6]" />

            <div className="mb-2 text-[#e52d72]">
              <svg
                width="29"
                height="29"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect
                  x="4"
                  y="6"
                  width="24"
                  height="14"
                  rx="1"
                />

                <path d="M4 11h24" />

                <circle
                  cx="12"
                  cy="13.5"
                  r="2"
                />

                <path d="M8 25h16" />
                <path d="M10 22v6" />
                <path d="M22 22v6" />
              </svg>
            </div>

            <p className="text-[13px] font-bold text-[#303030] sm:text-[15px]">
              CASH ON DELIVERY
            </p>

            <p className="mt-0.5 text-[11px] text-[#444] sm:text-[12px]">
              On all orders
            </p>
          </div>

          {/* =================================================
              FREE DELIVERY
          ================================================== */}
          <div
            className="
              relative
              flex
              min-h-[112px]
              flex-col
              items-center
              justify-center
              px-2
              text-center
              lg:min-h-[110px]
            "
          >
            <span className="absolute left-0 top-1/2 h-8 -translate-y-1/2 border-l border-[#d6d6d6]" />

            <div className="mb-2 text-[#e52d72]">
              <svg
                width="31"
                height="29"
                viewBox="0 0 36 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 7h20v17H3z" />
                <path d="M23 13h6l4 5v6h-10" />

                <circle
                  cx="10"
                  cy="26"
                  r="3"
                />

                <circle
                  cx="28"
                  cy="26"
                  r="3"
                />

                <path d="M29 13v5h5" />
              </svg>
            </div>

            <p className="text-[13px] font-bold text-[#303030] sm:text-[15px]">
              FREE DELIVERY
            </p>

            <p className="mt-0.5 text-[11px] text-[#444] sm:text-[12px]">
              On orders above ₹699
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}