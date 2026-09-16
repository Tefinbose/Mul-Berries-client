"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Gowns",
    slug: "gowns",
    image: "/categories/gowns.jpg",
  },
  {
    name: "Traditional",
    slug: "traditional",
    image: "/categories/traditional.jpg",
  },
  {
    name: "Indowestern",
    slug: "indowestern",
    image: "/categories/indowestern.jpg",
  },
  {
    name: "Tops",
    slug: "tops",
    image: "/categories/tops.jpg",
  },
  {
    name: "Cotton Fabrics",
    slug: "cotton-fabrics",
    image: "/categories/cotton-fabrics.jpg",
  },
  {
    name: "Plus Size",
    slug: "plus-size",
    image: "/categories/plus-size.jpg",
  },
  {
    name: "Kaftans",
    slug: "kaftans",
    image: "/categories/kaftans.jpg",
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    image: "/categories/jewelry.jpg",
  },
  {
    name: "Trendy",
    slug: "trendy",
    image: "/categories/trendy.jpg",
  },
  {
    name: "Festive",
    slug: "festive",
    image: "/categories/festive.jpg",
  },
];

export default function ShopByCategory() {
  return (
    <section className="w-full bg-[#f5f3ee] px-3 py-5 sm:px-5 lg:px-6 lg:py-7">
      <div className="w-full overflow-hidden rounded-[4px] bg-white">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#212121] sm:text-xl">
              Shop by Category
            </h2>

            <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
              Explore our latest collections
            </p>
          </div>

          <Link
            href="/categories"
            className="
              flex
              items-center
              gap-1.5
              rounded-[3px]
              bg-[#c73572]
              px-4
              py-2
              text-xs
              font-semibold
              text-white
              transition-colors
              hover:bg-[#a91d4f]
              sm:px-5
              sm:py-2.5
              sm:text-sm
            "
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* =====================================================
            CATEGORY ROW
        ====================================================== */}

        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="
              flex
              min-w-max
              gap-5
              px-4
              py-6
              sm:gap-7
              sm:px-6
              sm:py-7
              lg:justify-between
              lg:gap-4
            "
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CATEGORY CARD
============================================================ */

function CategoryCard({
  category,
}: {
  category: {
    name: string;
    slug: string;
    image: string;
  };
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="
        group
        flex
        w-[105px]
        shrink-0
        flex-col
        items-center
        text-center
        sm:w-[125px]
        lg:w-[120px]
      "
    >
      {/* Image */}

      <div
        className="
          relative
          h-[105px]
          w-[105px]
          overflow-hidden
          rounded-full
          bg-[#f5f3ee]
          ring-1
          ring-neutral-200
          transition-all
          duration-300
          group-hover:ring-2
          group-hover:ring-[#c73572]/40
          sm:h-[120px]
          sm:w-[120px]
        "
      >
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />
      </div>

      {/* Category name */}

      <h3
        className="
          mt-3
          line-clamp-2
          text-xs
          font-medium
          text-[#212121]
          transition-colors
          group-hover:text-[#c73572]
          sm:text-sm
        "
      >
        {category.name}
      </h3>
    </Link>
  );
}