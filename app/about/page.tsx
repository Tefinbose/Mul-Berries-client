import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import CustomerTestimonials from "@/components/CustomerTestimonials";


const images = {
  hero:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85",

  story:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",

  style:
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85",

  detail:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf7] text-[#172d32]">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative">

        {/* Decorative background blocks */}
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[330px] w-[220px] bg-[#f6c8b3] lg:block" />

        <div className="pointer-events-none absolute bottom-[70px] left-0 hidden h-[150px] w-[180px] bg-[#dce9e1] lg:block" />

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-16">

          <div className="relative min-h-[650px] py-16 lg:min-h-[760px] lg:py-24">

            {/* Decorative line */}
            <svg
              className="pointer-events-none absolute left-[25%] top-[42%] hidden h-[300px] w-[520px] lg:block"
              viewBox="0 0 520 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 150C90 40 170 260 250 150C330 40 350 100 300 180C250 260 360 300 520 80"
                stroke="#9bbeb1"
                strokeWidth="2"
              />
            </svg>

            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.75fr]">

              {/* Hero copy */}
              <div className="relative z-10 max-w-2xl pt-8 lg:pt-16">

                <p className="mb-7 text-[10px] font-medium uppercase tracking-[0.28em] text-[#172d32]/50">
                  About Mulberries
                </p>

                <h1 className="font-serif text-[48px] leading-[0.98] tracking-[-0.035em] sm:text-[62px] lg:text-[78px]">
                  A thoughtful
                  <br />
                  way to define
                  <br />
                  your style.
                </h1>

                <p className="mt-8 max-w-lg text-[14px] leading-7 text-[#172d32]/60">
                  Mulberries brings together contemporary style, timeless
                  influences and thoughtfully selected pieces for everyday
                  living.
                </p>

                <Link
                  href="/products"
                  className="group mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em]"
                >
                  Explore Mulberries

                  <ArrowRight
                    size={16}
                    strokeWidth={1.3}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

              </div>


              {/* Hero image */}
              <div className="relative z-10 lg:pt-12">

                <div className="absolute -right-5 -top-5 h-[120px] w-[150px] bg-[#f6c8b3] sm:-right-8 sm:-top-8 lg:-right-12 lg:-top-12 lg:h-[190px] lg:w-[220px]" />

                <div className="relative ml-auto w-[88%] overflow-hidden sm:w-[82%] lg:w-[90%]">

                  <img
                    src={images.hero}
                    alt="Mulberries lifestyle"
                    className="h-[470px] w-full object-cover object-center sm:h-[560px] lg:h-[620px]"
                  />

                </div>

                <div className="absolute -bottom-8 left-0 hidden h-24 w-24 bg-[#dce9e1] sm:block lg:h-32 lg:w-32" />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          STORY
      ========================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-36">

        {/* decorative block */}
        <div className="absolute left-0 top-16 hidden h-[250px] w-[150px] bg-[#f6c8b3] lg:block" />

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-16">

          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-24">

            {/* Image */}
            <div className="relative">

              <div className="absolute -bottom-8 left-8 h-28 w-36 bg-[#dce9e1] sm:left-12 sm:h-36 sm:w-44" />

              <div className="relative z-10 ml-4 overflow-hidden sm:ml-8">

                <img
                  src={images.story}
                  alt="Mulberries fashion story"
                  className="h-[430px] w-full object-cover sm:h-[540px] lg:h-[570px]"
                />

              </div>

            </div>


            {/* Content */}
            <div className="relative z-10 max-w-xl">

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#172d32]/45">
                Our Story
              </p>

              <h2 className="mt-5 font-serif text-[40px] leading-[1.03] tracking-[-0.025em] sm:text-[52px]">
                Making everyday style feel more personal.
              </h2>

              <p className="mt-7 text-[14px] leading-7 text-[#172d32]/60">
                Mulberries is built around a simple idea — finding something
                you love should feel effortless. We believe fashion becomes
                meaningful when it reflects the person wearing it.
              </p>

              <p className="mt-5 text-[14px] leading-7 text-[#172d32]/60">
                Our collections bring together pieces that balance modern
                expression with familiar elegance, giving you the freedom to
                create a style that feels completely your own.
              </p>

              <div className="mt-8 h-px w-16 bg-[#172d32]/25" />

              <p className="mt-5 text-[12px] uppercase tracking-[0.15em] text-[#172d32]/45">
                Thoughtful · Personal · Everyday
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          PHILOSOPHY
      ========================================================= */}
      <section className="relative bg-[#f2f4ef] py-20 sm:py-28 lg:py-36">

        {/* Decorative blue/green block */}
        <div className="absolute right-0 top-0 hidden h-[330px] w-[170px] bg-[#bdd7e2] lg:block" />

        <div className="absolute bottom-0 right-[12%] hidden h-[160px] w-[170px] bg-[#d7e6dc] lg:block" />

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-16">

          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-24">

            {/* Text */}
            <div className="relative z-10 max-w-2xl">

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#172d32]/45">
                What We Believe
              </p>

              <h2 className="mt-5 font-serif text-[40px] leading-[1.03] tracking-[-0.025em] sm:text-[52px]">
                Style should feel natural,
                <br />
                not complicated.
              </h2>

              <p className="mt-7 max-w-xl text-[14px] leading-7 text-[#172d32]/60">
                We are drawn to thoughtful details, comfortable silhouettes
                and pieces that can become part of your everyday wardrobe.
              </p>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-5 border-t border-[#172d32]/15 pt-6">

                <div>
                  <p className="font-serif text-2xl">01</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#172d32]/45">
                    Curated
                  </p>
                </div>

                <div>
                  <p className="font-serif text-2xl">02</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#172d32]/45">
                    Considered
                  </p>
                </div>

                <div>
                  <p className="font-serif text-2xl">03</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#172d32]/45">
                    Personal
                  </p>
                </div>

              </div>

            </div>


            {/* Image composition */}
            <div className="relative mx-auto w-full max-w-[500px]">

              <div className="absolute -right-4 -top-5 h-28 w-32 bg-[#bdd7e2] sm:-right-8 sm:-top-8 sm:h-36 sm:w-40" />

              <div className="relative z-10 overflow-hidden">

                <img
                  src={images.style}
                  alt="Mulberries style"
                  className="h-[500px] w-full object-cover sm:h-[590px]"
                />

              </div>

              <div className="absolute -bottom-7 -left-6 z-20 h-28 w-32 bg-[#f6c8b3] sm:-left-10 sm:h-36 sm:w-40" />

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          APPROACH
      ========================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-36">

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-16">

          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-28">

            {/* Heading */}
            <div>

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#172d32]/45">
                Our Approach
              </p>

              <h2 className="mt-5 max-w-sm font-serif text-[40px] leading-[1.03] tracking-[-0.025em] sm:text-[52px]">
                Designed around how you live.
              </h2>

            </div>


            {/* Items */}
            <div>

              <div className="border-t border-[#172d32]/15">

                {/* 01 */}
                <div className="grid gap-5 border-b border-[#172d32]/15 py-8 sm:grid-cols-[70px_1fr]">

                  <span className="font-serif text-xl text-[#172d32]/45">
                    01
                  </span>

                  <div>

                    <h3 className="font-serif text-2xl">
                      Thoughtful selection
                    </h3>

                    <p className="mt-3 max-w-xl text-[14px] leading-7 text-[#172d32]/55">
                      We focus on pieces that bring together beauty,
                      versatility and a sense of individuality.
                    </p>

                  </div>

                </div>


                {/* 02 */}
                <div className="grid gap-5 border-b border-[#172d32]/15 py-8 sm:grid-cols-[70px_1fr]">

                  <span className="font-serif text-xl text-[#172d32]/45">
                    02
                  </span>

                  <div>

                    <h3 className="font-serif text-2xl">
                      Tradition with a modern eye
                    </h3>

                    <p className="mt-3 max-w-xl text-[14px] leading-7 text-[#172d32]/55">
                      We appreciate the richness of familiar fashion while
                      embracing the way modern wardrobes are evolving.
                    </p>

                  </div>

                </div>


                {/* 03 */}
                <div className="grid gap-5 border-b border-[#172d32]/15 py-8 sm:grid-cols-[70px_1fr]">

                  <span className="font-serif text-xl text-[#172d32]/45">
                    03
                  </span>

                  <div>

                    <h3 className="font-serif text-2xl">
                      Made for your expression
                    </h3>

                    <p className="mt-3 max-w-xl text-[14px] leading-7 text-[#172d32]/55">
                      Our role is to provide the starting point. The way you
                      style, layer and wear it is yours.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FULL-WIDTH BRAND IMAGE
      ========================================================= */}
      <section className="relative">

        <div className="relative h-[560px] sm:h-[650px] lg:h-[720px]">

          <img
            src={images.detail}
            alt="Mulberries editorial"
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#172d32]/20" />


          {/* Decorative blocks */}
          <div className="absolute left-0 top-16 h-28 w-32 bg-[#f6c8b3]/90 sm:h-36 sm:w-40" />

          <div className="absolute bottom-0 right-0 h-32 w-36 bg-[#bdd7e2]/90 sm:h-40 sm:w-48" />


          {/* Text */}
          <div className="absolute inset-0 flex items-center justify-center px-5 text-center">

            <div className="max-w-3xl">

              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/75">
                The Mulberries feeling
              </p>

              <h2 className="mt-5 font-serif text-[42px] leading-[1] tracking-[-0.03em] text-white sm:text-[58px] lg:text-[72px]">
                Find something
                <br />
                that feels like you.
              </h2>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          SOCIAL / CONTACT
      ========================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-32">

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-16">

          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">

            <div>

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#172d32]/45">
                Stay Connected
              </p>

              <h2 className="mt-5 max-w-2xl font-serif text-[40px] leading-[1.03] tracking-[-0.025em] sm:text-[52px]">
                Keep up with the world of Mulberries.
              </h2>

              <p className="mt-6 max-w-lg text-[14px] leading-7 text-[#172d32]/55">
                Follow us for new arrivals, inspiration, stories and the
                latest from Mulberries.
              </p>

            </div>


            <div className="flex flex-col items-start gap-3 lg:items-end">

              <a
                href="https://www.instagram.com/mulberries_official"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full max-w-xs items-center justify-between border-b border-[#172d32]/15 py-4 text-[11px] uppercase tracking-[0.18em] transition hover:border-[#172d32]/50"
              >
                Instagram

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.3}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="https://www.facebook.com/Mulberriess"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full max-w-xs items-center justify-between border-b border-[#172d32]/15 py-4 text-[11px] uppercase tracking-[0.18em] transition hover:border-[#172d32]/50"
              >
                Facebook

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.3}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="https://www.youtube.com/@mulberriesboutique832"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full max-w-xs items-center justify-between border-b border-[#172d32]/15 py-4 text-[11px] uppercase tracking-[0.18em] transition hover:border-[#172d32]/50"
              >
                YouTube

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.3}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              <Link
                href="/contact"
                className="group mt-3 flex w-full max-w-xs items-center justify-between bg-[#172d32] px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-white transition hover:bg-[#26464d]"
              >
                Contact Us

                <ArrowRight
                  size={16}
                  strokeWidth={1.3}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL SHOP CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#f6c8b3]">

        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#172d32]/10" />

        <div className="absolute bottom-[-80px] left-[15%] h-48 w-48 rounded-full border border-[#172d32]/10" />

        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-16 lg:py-28">

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">

            <div>

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#172d32]/50">
                Discover Mulberries
              </p>

              <h2 className="mt-5 max-w-3xl font-serif text-[42px] leading-[1] tracking-[-0.03em] sm:text-[58px] lg:text-[68px]">
                Your wardrobe.
                <br />
                Your story.
              </h2>

            </div>


            <Link
              href="/products"
              className="group flex w-fit items-center gap-4 border border-[#172d32]/30 px-7 py-4 text-[10px] font-medium uppercase tracking-[0.18em] transition hover:bg-[#172d32] hover:text-white"
            >
              Shop Now

              <ArrowRight
                size={16}
                strokeWidth={1.3}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </section>
      <section>
        <CustomerTestimonials/>
      </section>



    </main>
  );
}