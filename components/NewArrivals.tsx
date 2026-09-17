import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function NewArrivals() {
  const newArrivals = products.slice(0, 4);

  return (
    <section className="w-full overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[#c73572]">
              <Sparkles size={15} strokeWidth={1.8} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">Just arrived</p>
            </div>
            <h2 className="max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#171717] sm:text-5xl md:text-4xl lg:text-6xl">
              New arrivals,
              <span className="font-normal italic text-[#c73572]"> thoughtfully chosen.</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
              Discover the latest pieces added to our collection, selected for everyday elegance and effortless style.
            </p>
          </div>

          <Link href="/products" className="group inline-flex w-fit items-center gap-2 border-b border-[#171717] pb-2 text-sm font-semibold text-[#171717] transition-colors hover:border-[#c73572] hover:text-[#c73572]">
            View all arrivals
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-[28px] border border-[#e5e1da] bg-white md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex min-h-[390px] flex-col justify-between bg-[#f7f4ef] p-7 sm:min-h-[460px] sm:p-8 md:min-h-[400px] md:p-7 lg:min-h-[540px] lg:p-12">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
              <span>01 / 04</span>
              <span>Mulberries edit</span>
            </div>

            <div className="max-w-md">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c73572]">The latest edit</p>
              <h3 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#171717] sm:text-5xl md:text-3xl lg:text-5xl">Fresh pieces for your next occasion.</h3>
              <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-600 md:mt-4 md:text-xs md:leading-5 lg:text-sm lg:leading-6">From everyday statements to celebration-ready classics, find something made to feel distinctly yours.</p>
              <Link href="/products" className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#c73572] md:mt-5 md:px-4 md:py-3 md:text-xs lg:mt-7 lg:px-5 lg:py-3.5 lg:text-sm">
                Explore collection
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1"><ArrowRight size={14} /></span>
              </Link>
            </div>

            <p className="text-xs text-neutral-500">Curated with care for every occasion</p>
          </div>

          <div className="relative min-h-[360px] overflow-hidden sm:min-h-[500px] md:min-h-[400px] lg:min-h-[540px]">
            <Image src="/new-arrivals/new-arrivals-bg.jpg" alt="New arrivals collection" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-center transition duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between sm:bottom-8 sm:left-8 sm:right-8 md:bottom-6 md:left-6 md:right-6 lg:bottom-8 lg:left-8 lg:right-8">
              <div className="text-white">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/75">New season</p>
                <p className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">Freshly curated</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-sm"><ArrowUpRight size={17} /></span>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-14 md:mt-10 lg:mt-16">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c73572]">Shop the edit</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">Latest pieces</h3>
            </div>
            <Link href="/products" className="hidden items-center gap-1.5 text-sm font-semibold text-neutral-600 transition hover:text-[#c73572] sm:flex">View all <ArrowUpRight size={15} /></Link>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.slug} product={product} tallImage />
            ))}
          </div>

          <Link href="/products" className="mt-9 flex items-center justify-center gap-2 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#c73572] sm:hidden">
            View all sarees <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
