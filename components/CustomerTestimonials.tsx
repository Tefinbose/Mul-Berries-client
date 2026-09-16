"use client";

import { ArrowUpRight, CheckCircle2, ChevronRight, Star } from "lucide-react";
import { motion } from "motion/react";

/* ================= TYPES ================= */

type Testimonial = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

type StarsProps = {
  rating: number;
};

type ReviewCardProps = {
  review: Testimonial;
};

type ReviewColumnProps = {
  reviews: Testimonial[];
  reverse?: boolean;
  duration?: number;
};

/* ================= TESTIMONIALS ================= */
/*
  These are placeholder reviews.
  Replace them with your actual Google reviews before publishing.
*/

const testimonials: Testimonial[] = [
  {
    name: "Google Customer",
    rating: 5,
    date: "Google Review",
    text: "Beautiful collection, good quality products and a smooth shopping experience.",
  },
  {
    name: "Google Customer",
    rating: 5,
    date: "Google Review",
    text: "Very happy with the collection and customer service. The overall experience was excellent.",
  },
  {
    name: "Google Customer",
    rating: 5,
    date: "Google Review",
    text: "Good quality, helpful staff and a lovely selection of products.",
  },
  {
    name: "Google Customer",
    rating: 4,
    date: "Google Review",
    text: "A great place to explore different styles and collections. Good service and experience.",
  },
];

/* ================= GOOGLE ICON ================= */

const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <img
    src="/icons/google.svg"
    alt="Google"
    width={size}
    height={size}
    className="shrink-0"
  />
);

/* ================= STARS ================= */

const Stars = ({ rating }: StarsProps) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={15}
        className={
          star <= rating
            ? "fill-[#f59e0b] text-[#f59e0b]"
            : "text-neutral-300"
        }
      />
    ))}
  </div>
);

/* ================= REVIEW CARD ================= */

const ReviewCard = ({ review }: ReviewCardProps) => (
  <article className="mb-3 border border-neutral-200 bg-white p-5 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:shadow-lg">
    {/* CUSTOMER */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* CUSTOMER INITIAL */}
        {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f3f6] text-sm font-bold text-neutral-700">
          {review.name.charAt(0).toUpperCase()}
        </div> */}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {review.name}
          </p>

          <p className="mt-0.5 text-[11px] text-neutral-500">
            {review.date}
          </p>
        </div>
      </div>

      {/* GOOGLE */}
      <div className="flex shrink-0 items-center gap-1 rounded bg-[#f8f8f8] px-2 py-1">
        <GoogleIcon size={14} />

        <span className="text-[11px] font-semibold text-neutral-700">
          Google
        </span>
      </div>
    </div>

    {/* STARS */}
    <div className="mt-5">
      <Stars rating={review.rating} />
    </div>

    {/* REVIEW */}
    <p className="mt-4 text-sm leading-6 text-neutral-600">
      "{review.text}"
    </p>

    {/* VERIFIED */}
    <div className="mt-5 flex items-center gap-1.5 border-t border-neutral-100 pt-4">
      <CheckCircle2
        size={14}
        className="text-[#2874f0]"
      />

      <span className="text-[11px] font-medium text-neutral-500">
        Google customer review
      </span>
    </div>
  </article>
);

/* ================= MOVING COLUMN ================= */

const ReviewColumn = ({
  reviews,
  reverse = false,
  duration = 28,
}: ReviewColumnProps) => {
  const items = [...reviews, ...reviews];

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        animate={{
          y: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{
          scale: 1,
        }}
        className="will-change-transform"
      >
        {items.map((review, index) => (
          <ReviewCard
            key={`${review.name}-${index}`}
            review={review}
          />
        ))}
      </motion.div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function CustomerTestimonials() {
  return (
    <section className="bg-[#f1f3f6] py-14 sm:py-16 lg:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="border border-neutral-200 bg-white">
          <div className="flex flex-col gap-5 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a91d4f]">
                Customer Experience
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                What our customers say
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Real feedback helps us build a better Mulberries experience.
              </p>
            </div>

            {/* GOOGLE REVIEWS BUTTON */}

            <a
              href="YOUR_GOOGLE_REVIEWS_LINK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:border-[#2874f0] hover:text-[#2874f0]"
            >
              View Google Reviews

              <ArrowUpRight size={16} />
            </a>
          </div>

          {/* ================= RATING SUMMARY ================= */}

          <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* GOOGLE RATING */}

            <div className="flex items-center gap-4 px-5 py-6 sm:px-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f1f3f6]">
                <GoogleIcon size={30} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Google Reviews
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl font-bold text-neutral-900">
                    4.8
                  </span>

                  <Stars rating={5} />
                </div>

                <p className="mt-1 text-xs text-neutral-500">
                  Customer ratings
                </p>
              </div>
            </div>

            {/* TRUSTED EXPERIENCE */}

            <div className="flex items-center gap-4 px-5 py-6 sm:px-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f8e9ef]">
                <CheckCircle2
                  size={26}
                  className="text-[#a91d4f]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Trusted Experience
                </p>

                <p className="mt-1 text-base font-semibold text-neutral-900">
                  Customer first
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Quality & service focused
                </p>
              </div>
            </div>

            {/* OUR PROMISE */}

            <div className="flex items-center gap-4 px-5 py-6 sm:px-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f1f3f6]">
                <Star
                  size={25}
                  className="fill-[#f59e0b] text-[#f59e0b]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Our Promise
                </p>

                <p className="mt-1 text-base font-semibold text-neutral-900">
                  Made with care
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Every customer matters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOVING REVIEWS ================= */}

        <div className="relative mt-3 h-[520px] overflow-hidden">

          {/* TOP FADE */}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-[#f1f3f6] to-transparent" />

          {/* BOTTOM FADE */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-[#f1f3f6] to-transparent" />

          {/* DESKTOP */}

          <div className="hidden h-full grid-cols-4 gap-3 sm:grid">

            <ReviewColumn
              reviews={[
                testimonials[0],
                testimonials[1],
              ]}
              reverse
              duration={30}
            />

            <ReviewColumn
              reviews={[
                testimonials[2],
                testimonials[3],
              ]}
              duration={34}
            />

            <ReviewColumn
              reviews={[
                testimonials[1],
                testimonials[3],
              ]}
              reverse
              duration={32}
            />

            <ReviewColumn
              reviews={[
                testimonials[0],
                testimonials[2],
              ]}
              duration={36}
            />

          </div>

          {/* MOBILE */}

          <div className="h-full sm:hidden">
            <ReviewColumn
              reviews={testimonials}
              reverse
              duration={35}
            />
          </div>
        </div>

        {/* ================= BOTTOM CTA ================= */}

        <div className="mt-3 flex flex-col items-center justify-between gap-4 border border-neutral-200 bg-white px-5 py-5 sm:flex-row sm:px-7">

          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Your experience matters to us
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Share your experience with Mulberries on Google.
            </p>
          </div>

          <a
            href="YOUR_GOOGLE_REVIEWS_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#2874f0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f65d1]"
          >
            Write a Google Review

            <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}