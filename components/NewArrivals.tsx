import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function NewArrivals() {
  const newArrivals = products.slice(0, 4);

  return (
    <section className="w-full py-5 sm:py-6 lg:py-8">
      <div className="w-full overflow-hidden bg-[#fbf0f5]">
        {/* =========================================
            HERO SECTION
        ========================================= */}
        <div className="grid min-h-[500px] w-full grid-cols-1 lg:grid-cols-2">

          {/* =========================================
              LEFT — CONTENT
          ========================================= */}
          <div
            className="
              relative
              flex
              min-h-[500px]
              flex-col
              items-center
              justify-center
              p-7
              text-center
              sm:min-h-[560px]
              sm:p-10
              lg:min-h-[560px]
              lg:p-14
              xl:p-16
            "
          >
            {/* Decorative circle */}
            <div
              className="
                pointer-events-none
                absolute
                -left-20
                -top-20
                h-64
                w-64
                rounded-full
                border
                border-[#c73572]/10
              "
            />

            {/* =====================================
                TOP INFORMATION
            ===================================== */}
            <div
              className="
                absolute
                left-7
                right-7
                top-7
                flex
                items-center
                justify-between
                sm:left-10
                sm:right-10
                sm:top-10
                lg:left-14
                lg:right-14
                lg:top-14
                xl:left-16
                xl:right-16
                xl:top-16
              "
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-[#c73572]"
                  strokeWidth={1.7}
                />

                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#c73572]
                  "
                >
                  Just arrived
                </span>
              </div>

              <span className="text-[10px] font-medium text-neutral-400">
                01 — 04
              </span>
            </div>

            {/* =====================================
                CENTER CONTENT
            ===================================== */}
            <div
              className="
                relative
                z-10
                flex
                w-full
                max-w-xl
                flex-col
                items-center
              "
            >
              <p
                className="
                  mb-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-neutral-500
                "
              >
                The latest edit
              </p>

              <h2
                className="
                  text-5xl
                  font-semibold
                  leading-[0.9]
                  tracking-[-0.05em]
                  text-[#171717]
                  sm:text-6xl
                  lg:text-7xl
                  xl:text-[82px]
                "
              >
                New
                <br />

                <span className="font-normal italic text-[#c73572]">
                  arrivals.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-[420px]
                  text-sm
                  leading-6
                  text-neutral-600
                  sm:text-base
                  sm:leading-7
                "
              >
                Discover the latest pieces added to our collection.
                Beautiful styles thoughtfully selected for every occasion.
              </p>

              <Link
                href="/products"
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#111111]
                  px-5
                  py-3.5
                  text-xs
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#c73572]
                  sm:mt-8
                  sm:px-6
                  sm:py-4
                  sm:text-sm
                "
              >
                Explore collection

                <span
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>

            {/* =====================================
                BOTTOM INFORMATION
            ===================================== */}
            <div
              className="
                absolute
                bottom-7
                left-7
                right-7
                flex
                items-end
                justify-between
                border-t
                border-[#c73572]/15
                pt-5
                sm:bottom-10
                sm:left-10
                sm:right-10
                lg:bottom-14
                lg:left-14
                lg:right-14
                xl:bottom-16
                xl:left-16
                xl:right-16
              "
            >
              <div className="text-left">
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-neutral-400
                  "
                >
                  Mul-Berries
                </p>

                <p className="mt-1 text-xs text-neutral-600">
                  Curated for you
                </p>
              </div>

              <Link
                href="/products"
                className="
                  hidden
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold
                  text-neutral-600
                  transition
                  hover:text-[#c73572]
                  sm:flex
                "
              >
                View all
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* =========================================
              RIGHT — IMAGE
          ========================================= */}
          <div
            className="
              relative
              min-h-[400px]
              overflow-hidden
              lg:min-h-[560px]
            "
          >
            {/* Main image */}
            <img
              src="/new-arrivals/new-arrivals-bg.jpg"
              alt="New arrivals"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
              "
            />

            {/* Very subtle pink tint */}
            <div
              className="
                absolute
                inset-0
                bg-[#c73572]/[0.04]
              "
            />

            {/* =====================================
                SOFT LEFT TRANSITION
            ===================================== */}
            <div
              className="
                absolute
                inset-y-0
                left-0
                z-10
                w-[25%]
                bg-gradient-to-r
                from-[#fbf0f5]
                via-[#fbf0f5]/70
                to-transparent
              "
            />

            {/* =====================================
                SOFT BOTTOM FADE
            ===================================== */}
            <div
              className="
                absolute
                inset-x-0
                bottom-0
                z-10
                h-28
                bg-gradient-to-t
                from-[#111111]/10
                to-transparent
              "
            />

            {/* =====================================
                IMAGE INFORMATION
            ===================================== */}
            <div
              className="
                absolute
                bottom-6
                left-6
                right-6
                z-20
                flex
                items-end
                justify-between
                sm:bottom-8
                sm:left-8
                sm:right-8
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.3em]
                    text-white/80
                  "
                >
                  New season
                </p>

                <p
                  className="
                    mt-1
                    text-xl
                    font-medium
                    text-white
                    drop-shadow-sm
                    sm:text-2xl
                  "
                >
                  Freshly curated
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/50
                  bg-white/10
                  text-white
                  backdrop-blur-sm
                "
              >
                <ArrowUpRight size={17} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            PRODUCTS SECTION
        ========================================= */}
        <div
          className="
            w-full
            bg-[#f5f3ee]
            px-4
            py-7
            sm:px-6
            sm:py-9
            lg:px-10
            lg:py-10
          "
        >
          {/* Products heading */}
          <div className="mb-6 flex items-end justify-between sm:mb-8">
            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#c73572]
                "
              >
                Shop the edit
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-[#171717]
                  sm:text-3xl
                "
              >
                Latest pieces
              </h3>
            </div>

            <Link
              href="/products"
              className="
                hidden
                items-center
                gap-1.5
                text-xs
                font-semibold
                text-neutral-600
                transition
                hover:text-[#c73572]
                sm:flex
              "
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Product grid */}
          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-7
              sm:grid-cols-3
              lg:grid-cols-4
              lg:gap-x-5
            "
          >
            {newArrivals.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>

          {/* Mobile button */}
          <Link
            href="/products"
            className="
              mt-8
              flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#111111]
              px-5
              py-3.5
              text-sm
              font-medium
              text-white
              transition-all
              duration-300
              hover:bg-[#c73572]
              sm:hidden
            "
          >
            View all sarees
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}