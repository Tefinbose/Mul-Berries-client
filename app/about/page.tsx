"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Quote,
  Sparkles,
  Users,
} from "lucide-react";

import CustomerTestimonials from "@/components/CustomerTestimonials";

const team = [
  {
    name: "Founder",
    role: "Founder & Creative Director",
    image: "/about/team/founder.jpg",
  },
  {
    name: "Creative Team",
    role: "Design & Curation",
    image: "/about/team/creative-team.jpg",
  },
  {
    name: "Style Team",
    role: "Customer Experience",
    image: "/about/team/style-team.jpg",
  },
  {
    name: "Mulberries Team",
    role: "Operations & Support",
    image: "/about/team/operations-team.jpg",
  },
];

const features = [
  {
    number: "01",
    icon: Award,
    title: "Premium Quality",
    description:
      "Thoughtfully selected products with attention to fabric, craftsmanship and finishing.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Curated Collections",
    description:
      "A considered mix of timeless elegance, contemporary style and occasion-ready fashion.",
  },
  {
    number: "03",
    icon: Users,
    title: "Customer First",
    description:
      "A personal shopping experience built around service, trust and long-term relationships.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Quality Checked",
    description:
      "We pay attention to the details that make every purchase feel worthwhile.",
  },
];

const collections = [
  {
    number: "01",
    title: "Garments",
    description:
      "Elegant sarees, bridal collections, designer wear and everyday styles for every occasion.",
  },
  {
    number: "02",
    title: "Silk Collections",
    description:
      "Timeless silk pieces bringing traditional craftsmanship together with contemporary elegance.",
  },
  {
    number: "03",
    title: "Accessories",
    description:
      "Jewelry and accessories carefully selected to complete and complement your look.",
  },
];

const faqs = [
  {
    question: "What is Mulberries Boutique?",
    answer:
      "Mulberries is a fashion destination offering clothing, ethnic wear, jewelry and accessories that combine modern trends with traditional designs.",
  },
  {
    question: "Where are your stores located?",
    answer:
      "Mulberries has stores in the UAE, including Dubai, Abu Dhabi and Sharjah. Customers can also explore and shop through our online store.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "International shipping is available for selected destinations. Delivery time and shipping charges may vary depending on the destination.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Returns are subject to the applicable return conditions for the purchased product. Items generally need to be unused and returned in their original condition and packaging.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#f5f3ee] text-[#171717]">

      {/* ========================================================= */}
      {/* HERO                                                      */}
      {/* ========================================================= */}

      <section className="relative w-full border-b border-neutral-200 bg-[#f5f3ee]">
        <div className="grid min-h-[680px] gap-6 p-4 sm:p-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:p-8">

          {/* Hero Content */}

          <div className="flex items-center px-2 py-16 sm:px-6 lg:px-10 lg:py-16 xl:px-16">
            <div className="w-full max-w-xl">

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c73572]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
                  About Mulberries
                </p>
              </div>

              <h1 className="mt-7 text-[clamp(3.4rem,7vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
                Fashion
                <br />
                <span className="font-normal italic text-[#c73572]">
                  with feeling.
                </span>
              </h1>

              <p className="mt-8 max-w-lg text-[15px] leading-7 text-neutral-600 sm:text-base">
                Mulberries brings together style, elegance and individuality
                through thoughtfully curated fashion collections created for
                every occasion.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#c73572] hover:shadow-md"
                >
                  Explore Collection

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={15} />
                  </span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-3.5 text-sm font-semibold transition duration-300 hover:border-[#c73572] hover:text-[#c73572]"
                >
                  Get in touch
                  <ArrowUpRight size={15} />
                </Link>
              </div>

              {/* Stats */}

              <div className="mt-14 grid max-w-xl grid-cols-3 border-t border-neutral-200 pt-7">
                <div className="pr-4">
                  <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    56K+
                  </p>
                  <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                    Happy Customers
                  </p>
                </div>

                <div className="border-l border-neutral-200 px-4">
                  <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    72K+
                  </p>
                  <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                    Products Sold
                  </p>
                </div>

                <div className="border-l border-neutral-200 pl-4">
                  <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    11+
                  </p>
                  <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                    Years Experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}

          <div className="relative min-h-[420px] overflow-hidden rounded-[28px] shadow-sm lg:min-h-full">
            <img
              src="https://mulberries.shop/wp-content/uploads/2024/10/168A7362-595x397.jpg"
              alt="Mulberries fashion collection"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/70">
                  The Mulberries Story
                </p>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white">
                  A world of fashion where tradition meets contemporary style.
                </p>
              </div>

              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-sm sm:flex">
                <ArrowDownIcon />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* BRAND INTRO                                               */}
      {/* ========================================================= */}

      <section className="w-full bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32 xl:px-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
              Who We Are
            </p>

            <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-500">
              A fashion destination built around individuality, quality and
              thoughtful curation.
            </p>
          </div>

          <div>
            <h2 className="max-w-5xl text-3xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-5xl xl:text-6xl">
              More than a fashion store. We create a place where{" "}
              <span className="text-[#a91d4f]">
                style feels personal.
              </span>
            </h2>

            <div className="mt-8 grid gap-8 border-t border-neutral-200 pt-8 md:grid-cols-2">
              <p className="text-sm leading-7 text-neutral-600 sm:text-base">
                Mulberries began with a simple idea: make stylish, quality
                fashion more accessible while creating a shopping experience
                that feels personal and inspiring.
              </p>

              <p className="text-sm leading-7 text-neutral-600 sm:text-base">
                From traditional influences to modern trends, every collection
                is selected to help customers discover pieces that feel right
                for their personality and occasion.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* OUR STORY                                                  */}
      {/* ========================================================= */}

      <section className="w-full bg-[#f5f3ee] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32 xl:px-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-[28px] border-l border-t border-[#c73572]/30" />

            <div className="relative overflow-hidden rounded-[28px] shadow-sm">
              <img
                src="https://mulberries.shop/wp-content/uploads/2024/10/mulberries-our-story.png"
                alt="The Mulberries story"
                className="h-[440px] w-full object-cover sm:h-[560px]"
              />
            </div>

            <div className="absolute -bottom-5 right-5 rounded-2xl bg-[#171717] px-6 py-5 text-white shadow-md sm:right-8">
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/50">
                Our journey
              </p>

              <p className="mt-1 text-lg font-medium">
                Built around fashion
              </p>
            </div>
          </div>

          <div className="max-w-xl lg:pl-4">

            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#c73572]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
                Our Story
              </p>
            </div>

            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              A journey shaped by{" "}
              <span className="font-normal italic text-[#a91d4f]">
                style and people.
              </span>
            </h2>

            <div className="mt-8 space-y-5 text-sm leading-7 text-neutral-600 sm:text-base">
              <p>
                Mulberries grew from a passion for fashion and a desire to
                create collections that make people feel confident, expressive
                and comfortable in what they wear.
              </p>

              <p>
                As the brand evolved, our focus expanded beyond products. We
                wanted every interaction to feel considered — from discovering
                a collection to receiving an order and coming back again.
              </p>

              <p>
                Today, that philosophy continues to guide the way we curate
                products, work with our customers and introduce new collections.
              </p>
            </div>

            <div className="mt-9 border-t border-neutral-200 pt-6">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 text-sm font-semibold text-[#171717]"
              >
                Discover the collection

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-white transition group-hover:bg-[#c73572]">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* VALUES                                                     */}
      {/* ========================================================= */}

      <section className="w-full bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr]">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
                What Matters
              </p>

              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                The principles behind everything we do.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-neutral-200 bg-white p-7 transition duration-300 hover:border-[#c73572]/30 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fbf0f5] text-[#a91d4f]">
                        <Icon size={18} />
                      </div>

                      <span className="text-[10px] font-medium tracking-[0.2em] text-neutral-300">
                        {feature.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* VISION + MISSION                                           */}
      {/* ========================================================= */}

      <section className="w-full bg-[#171717] px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e99ab8]">
                Our Direction
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                Where we are going.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e99ab8]">
                  01 — Vision
                </p>

                <h3 className="mt-5 text-2xl font-medium">
                  Inspiring confidence through fashion.
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  We envision a fashion experience where everyone can discover
                  styles that reflect their personality, confidence and
                  individuality.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e99ab8]">
                  02 — Mission
                </p>

                <h3 className="mt-5 text-2xl font-medium">
                  Making great fashion easier to discover.
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  We aim to provide high-quality, trend-driven fashion while
                  creating a shopping experience that is welcoming,
                  dependable and customer-focused.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* COLLECTIONS                                                 */}
      {/* ========================================================= */}

      <section className="w-full bg-[#f5f3ee] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
                Collections
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Made to be discovered.
              </h2>
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-sm font-semibold"
            >
              View all products

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.title}
                href="/products"
                className="group relative min-h-[330px] rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-1 hover:bg-[#171717] hover:text-white hover:shadow-lg sm:p-9"
              >
                <div className="flex items-start justify-between">

                  <span className="text-[10px] font-medium tracking-[0.2em] text-neutral-300 group-hover:text-white/30">
                    {collection.number}
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition group-hover:border-white/20 group-hover:bg-white/10">
                    <ArrowUpRight size={16} />
                  </span>

                </div>

                <div className="absolute bottom-8 left-7 right-7 sm:left-9 sm:right-9">
                  <h3 className="text-2xl font-semibold">
                    {collection.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-neutral-500 transition group-hover:text-white/55">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* TEAM                                                       */}
      {/* ========================================================= */}

      <section className="w-full bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
                The People
              </p>

              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                The team behind the experience.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-500">
                A passionate team working across design, styling, customer
                experience and operations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {team.map((member) => (
                <div key={member.name} className="group">

                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f5f3ee] shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>

                  <div className="py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold">
                          {member.name}
                        </h3>

                        <p className="mt-1 text-xs text-neutral-500">
                          {member.role}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={14}
                        className="mt-0.5 shrink-0 text-neutral-300"
                      />
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* WHY CHOOSE US                                               */}
      {/* ========================================================= */}

      <section className="w-full bg-[#171717] px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#e99ab8]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e99ab8]">
                  Why Mulberries
                </p>
              </div>

              <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Fashion should feel
                <br />
                <span className="font-normal italic text-[#e99ab8]">
                  like you.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
                From the products we select to the way we serve our customers,
                every detail is guided by a simple belief: shopping should
                feel thoughtful.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#171717] shadow-sm transition hover:bg-[#c73572] hover:text-white"
              >
                Shop Mulberries
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Thoughtful Selection",
                  text: "Collections chosen with style, quality and versatility in mind.",
                },
                {
                  title: "Personal Service",
                  text: "A customer-first approach throughout your shopping journey.",
                },
                {
                  title: "Style & Variety",
                  text: "A diverse selection for different occasions and personalities.",
                },
                {
                  title: "Quality Focus",
                  text: "Attention to materials, finishing and the details that matter.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9"
                >
                  <span className="text-[10px] font-medium tracking-[0.2em] text-white/25">
                    0{index + 1}
                  </span>

                  <h3 className="mt-12 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* CUSTOMER TESTIMONIALS                                       */}
      {/* ========================================================= */}

      <section className="w-full">
        <CustomerTestimonials />
      </section>


      {/* ========================================================= */}
      {/* FAQ                                                         */}
      {/* ========================================================= */}

      <section className="w-full bg-[#f5f3ee] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Questions,
              <br />
              answered.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-500">
              Find answers to some of the most common questions about
              Mulberries and shopping with us.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-neutral-200 bg-white px-6 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-sm font-semibold sm:text-base">
                  <span className="flex items-center gap-5">
                    <span className="text-[10px] font-medium tracking-[0.2em] text-neutral-300">
                      0{index + 1}
                    </span>

                    {faq.question}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 transition duration-300 group-open:rotate-45 group-open:border-[#c73572] group-open:text-[#c73572]">
                    <span className="text-lg font-light leading-none">
                      +
                    </span>
                  </span>
                </summary>

                <div className="max-w-2xl pb-6 pl-9 text-sm leading-7 text-neutral-500">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* CONTACT STRIP                                               */}
      {/* ========================================================= */}

      <section className="w-full border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">

          <Link
            href="/contact"
            className="group rounded-2xl border border-neutral-200 px-6 py-8 transition hover:border-[#c73572]/30 hover:bg-[#fbf0f5] lg:px-8"
          >
            <div className="flex items-start justify-between">
              <MessageCircle
                size={20}
                className="text-[#a91d4f]"
              />

              <ArrowUpRight
                size={16}
                className="text-neutral-300 transition group-hover:text-[#a91d4f]"
              />
            </div>

            <p className="mt-8 text-sm font-semibold">
              Need Help?
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Talk to our team
            </p>
          </Link>

          <a
            href="mailto:geethy@gmail.com"
            className="group rounded-2xl border border-neutral-200 px-6 py-8 transition hover:border-[#c73572]/30 hover:bg-[#fbf0f5] lg:px-8"
          >
            <div className="flex items-start justify-between">
              <Mail
                size={20}
                className="text-[#a91d4f]"
              />

              <ArrowUpRight
                size={16}
                className="text-neutral-300 transition group-hover:text-[#a91d4f]"
              />
            </div>

            <p className="mt-8 text-sm font-semibold">
              Email Us
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              geethy@gmail.com
            </p>
          </a>

          <Link
            href="/contact"
            className="group rounded-2xl border border-neutral-200 px-6 py-8 transition hover:border-[#c73572]/30 hover:bg-[#fbf0f5] lg:px-8"
          >
            <div className="flex items-start justify-between">
              <MapPin
                size={20}
                className="text-[#a91d4f]"
              />

              <ArrowUpRight
                size={16}
                className="text-neutral-300 transition group-hover:text-[#a91d4f]"
              />
            </div>

            <p className="mt-8 text-sm font-semibold">
              Visit Us
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Our stores across UAE
            </p>
          </Link>

        </div>
      </section>


      {/* ========================================================= */}
      {/* FINAL CTA                                                   */}
      {/* ========================================================= */}

      <section className="relative w-full overflow-hidden bg-[#f8edf2] px-6 py-24 text-center sm:px-10 sm:py-28 lg:px-16 lg:py-36">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#c73572]/10" />

        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-[#c73572]/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl">

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#c73572]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c73572]">
              The Mulberries Edit
            </p>

            <span className="h-px w-8 bg-[#c73572]" />
          </div>

          <h2 className="mt-7 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
            Discover something
            <br />
            <span className="font-normal italic text-[#c73572]">
              you&apos;ll love.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
            Explore our complete collection and discover products selected
            with quality, elegance and everyday style in mind.
          </p>

          <Link
            href="/products"
            className="group mt-9 inline-flex items-center gap-4 rounded-full bg-[#111111] px-7 py-4 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#c73572] hover:shadow-md"
          >
            Start Shopping

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={15} />
            </span>
          </Link>

          <div className="mt-16 flex items-center justify-between border-t border-[#c73572]/10 pt-5 sm:mt-20">
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
      </section>

    </main>
  );
}


/* ========================================================= */
/* SMALL DECORATIVE ARROW                                    */
/* ========================================================= */

function ArrowDownIcon() {
  return (
    <svg
      width="15"
      height="18"
      viewBox="0 0 15 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.5 1V16M7.5 16L1.5 10M7.5 16L13.5 10"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}