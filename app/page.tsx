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
      border-y
      border-[#e5e1da]
      bg-[#f5f3ee]
      px-5
      py-16
      text-center
      sm:px-8
      sm:py-20
      lg:px-12
      lg:py-24
    "
  >
    {/* Content */}
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">

      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[#c73572]" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#c73572]">
          The Mulberries Edit
        </p>

        <span className="h-px w-10 bg-[#c73572]" />
      </div>

      {/* Heading */}
      <h2
        className="
          mt-5
          max-w-3xl
          text-4xl
          font-semibold
          leading-none
          tracking-[-0.035em]
          text-[#171717]
          sm:text-5xl
          lg:text-6xl
          xl:text-7xl
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
          mt-6
          max-w-2xl
          text-sm
          leading-6
          text-neutral-600
          sm:text-[15px]
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
          mt-8
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
          sm:py-3.5
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
          mt-14
          flex
          w-full
          items-center
          justify-between
          border-t
          border-[#e5e1da]
          pt-5
          text-center
          sm:mt-16
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