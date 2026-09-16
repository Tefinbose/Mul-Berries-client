import HeroSlider from "@/components/HeroSlider";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import StyleInspiration from "@/components/StyleInspiration";
import ShopByCategory from "@/components/Shopbycategory";
import WhyPeopleChooseUs from "@/components/WhyPeopleLoveUs";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#f5f3ee]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="w-full">
        <HeroSlider />
      </section>


      {/* ================================================= */}
      {/* SHOP BY CATEGORY */}
      {/* ================================================= */}

      <section className="w-full">
        <ShopByCategory />
      </section>


      {/* ================================================= */}
      {/* NEW ARRIVALS */}
      {/* ================================================= */}

      <section className="w-full">
        <NewArrivals />
      </section>


      {/* ================================================= */}
      {/* BEST SELLERS */}
      {/* ================================================= */}

      <section className="w-full">
        <BestSellers />
      </section>


      {/* ================================================= */}
      {/* STYLE INSPIRATION */}
      {/* ================================================= */}

      <section className="w-full">
        <StyleInspiration />
      </section>


      {/* ================================================= */}
      {/* WHY PEOPLE CHOOSE US */}
      {/* ================================================= */}

      <section className="w-full">
        <WhyPeopleChooseUs />
      </section>
    



<section className="w-full">
  <div
    className="
      relative
      w-full
      overflow-hidden
      bg-gradient-to-br
      from-[#fdf3f7]
      via-[#f8edf2]
      to-[#f5f3ee]
      px-6
      py-20
      text-center
      sm:px-10
      sm:py-24
      lg:px-16
      lg:py-28
      xl:px-24
    "
  >
    {/* Decorative background */}
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#c73572]/10 sm:h-96 sm:w-96" />

    <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#c73572]/5 blur-3xl" />

    <div className="pointer-events-none absolute right-[20%] top-[25%] h-2 w-2 rounded-full bg-[#c73572]/30" />

    <div className="pointer-events-none absolute bottom-[20%] left-[30%] h-1.5 w-1.5 rounded-full bg-[#c73572]/20" />

    {/* Content */}
    <div className="relative z-10 flex w-full flex-col items-center">

      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#c73572]" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
          The Mulberries Edit
        </p>

        <span className="h-px w-8 bg-[#c73572]" />
      </div>

      {/* Heading */}
      <h2
        className="
          mt-6
          max-w-4xl
          text-5xl
          font-semibold
          leading-[0.95]
          tracking-[-0.045em]
          text-[#171717]
          sm:text-6xl
          lg:text-7xl
          xl:text-[88px]
        "
      >
        Discover something
        <br />
        <span className="font-normal italic text-[#c73572]">
          you&apos;ll love.
        </span>
      </h2>

      {/* Description */}
      <p
        className="
          mt-7
          max-w-xl
          text-sm
          leading-6
          text-neutral-600
          sm:text-base
          sm:leading-7
        "
      >
        Explore our complete collection and discover products selected
        with quality, elegance and everyday style in mind.
      </p>

      {/* CTA */}
      <Link
        href="/products"
        className="
          group
          mt-9
          inline-flex
          items-center
          gap-4
          rounded-full
          bg-[#111111]
          px-6
          py-3.5
          text-sm
          font-semibold
          text-white
          transition-all
          duration-300
          hover:bg-[#c73572]
          sm:px-7
          sm:py-4
        "
      >
        Start Shopping

        <span
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-white/10
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          <ArrowRight size={15} />
        </span>
      </Link>

      {/* Bottom brand line */}
      <div
        className="
          mt-16
          flex
          w-full
          items-center
          justify-between
          border-t
          border-[#c73572]/10
          pt-5
          text-center
          sm:mt-20
        "
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-neutral-400">
          Mul-Berries
        </p>

        <p className="hidden text-xs text-neutral-400 sm:block">
          Curated with care
        </p>

        <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          Explore • Discover • Love
        </p>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}