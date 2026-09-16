import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Sarees",
    slug: "sarees",
    image: "/categories/sarees.jpg",
  },
  {
    name: "Silk Sarees",
    slug: "silk-sarees",
    image: "/categories/silk-sarees.jpg",
  },
  {
    name: "Designer Sarees",
    slug: "designer-sarees",
    image: "/categories/designer-sarees.jpg",
  },
  {
    name: "Bridal Sarees",
    slug: "bridal-sarees",
    image: "/categories/bridal-sarees.jpg",
  },
  {
    name: "Festive Sarees",
    slug: "festive-sarees",
    image: "/categories/festive-sarees.jpg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/categories/accessories.jpg",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen w-full bg-[#f1f3f6]">
      {/* Breadcrumb */}
      <div className="w-full border-b border-neutral-200 bg-white">
        <div className="w-full px-4 py-3 text-xs text-neutral-500 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="transition-colors hover:text-[#c73572]"
            >
              Home
            </Link>

            <ChevronRight size={13} />

            <span className="text-neutral-900">Categories</span>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <section className="w-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#212121] sm:text-xl">
              Shop by Category
            </h1>

            <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
              Explore our collections
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1.5 rounded-[3px] bg-[#c73572] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#a91d4f] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            View Products
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category Navigation */}
        <div className="w-full overflow-x-auto border-b border-neutral-200">
          <div className="flex min-w-max">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="border-r border-neutral-100 px-5 py-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#fff7fa] hover:text-[#c73572] sm:px-7"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid w-full grid-cols-2 gap-px bg-neutral-200 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group bg-white p-4 text-center transition-colors hover:bg-[#fffafd] sm:p-6 lg:p-7"
            >
              {/* Image */}
              <div className="mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-full bg-[#f5f3ee]">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Name */}
              <h2 className="mt-5 text-sm font-semibold text-[#212121] transition-colors group-hover:text-[#c73572] sm:text-base">
                {category.name}
              </h2>

              {/* Explore */}
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-neutral-500">
                <span>Explore</span>

                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Collection Links */}
      <section className="mt-4 w-full bg-white">
        <div className="border-b border-neutral-200 px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-[#212121]">
            Browse Our Collections
          </h2>

          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
            Find the perfect style for every occasion.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex items-center justify-between border-r border-b border-neutral-100 px-4 py-5 transition-colors hover:bg-[#fffafd] sm:px-6"
            >
              <span className="text-sm font-medium text-neutral-800 transition-colors group-hover:text-[#c73572]">
                {category.name}
              </span>

              <ArrowRight
                size={14}
                className="shrink-0 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#c73572]"
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}