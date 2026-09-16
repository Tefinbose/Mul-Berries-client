import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ShieldCheck } from "lucide-react";

import ProductDetails from "@/components/ProductDetails";
import ProductGallery from "@/components/ProductGallery";
import ProductRecommendations from "@/components/ProductRecommendations";
import ProductReviews from "@/components/ProductReviews";
import RecentlyViewed from "@/components/RecentlyViewed";
import CrossSellProducts from "@/components/CrossSellProducts";

import { getProductBySlug, products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productImages = [product.image];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f1f3f6] text-neutral-900">

      {/* ========================================================= */}
      {/* BREADCRUMB */}
      {/* ========================================================= */}

      <section className="border-b border-neutral-200 bg-white">
        <div className="w-full px-3 py-3 sm:px-4 lg:px-5 xl:px-6">

          <nav
            aria-label="Breadcrumb"
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              overflow-hidden
              text-[11px]
              text-neutral-500
              sm:text-xs
            "
          >
            <Link
              href="/"
              className="shrink-0 transition hover:text-[#c73572]"
            >
              Home
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0 text-neutral-400"
            />

            <Link
              href="/products"
              className="shrink-0 transition hover:text-[#c73572]"
            >
              Sarees
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0 text-neutral-400"
            />

            <span className="min-w-0 truncate font-medium text-neutral-800">
              {product.name}
            </span>
          </nav>

        </div>
      </section>

      {/* ========================================================= */}
      {/* PRODUCT MAIN */}
      {/* ========================================================= */}

      <section className="w-full px-2 py-2 sm:px-3 sm:py-3 lg:px-5 lg:py-4 xl:px-6">

        <div
          className="
            grid
            min-w-0
            overflow-hidden
            border
            border-neutral-200
            bg-white
            lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]
          "
        >

          {/* ===================================================== */}
          {/* PRODUCT GALLERY */}
          {/* ===================================================== */}

          <div
            className="
              min-w-0
              border-b
              border-neutral-200
              lg:border-b-0
              lg:border-r
            "
          >
            <ProductGallery
              images={productImages}
              productName={product.name}
            />
          </div>

          {/* ===================================================== */}
          {/* PRODUCT DETAILS */}
          {/* ===================================================== */}

          <div
            className="
              min-w-0
              bg-white
              p-4
              sm:p-6
              lg:p-8
              xl:p-10
            "
          >
            <ProductDetails product={product} />
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* TRUST / SERVICE INFORMATION */}
      {/* ========================================================= */}

      <section className="w-full px-2 pb-2 sm:px-3 lg:px-5 xl:px-6">

        <div
          className="
            grid
            border
            border-neutral-200
            bg-white
            sm:grid-cols-3
          "
        >

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              border-b
              border-neutral-200
              px-4
              py-4
              sm:border-b-0
              sm:border-r
            "
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fbf0f5] text-[#c73572]">
              <ShieldCheck size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold">
                Secure shopping
              </p>

              <p className="mt-0.5 text-[10px] text-neutral-500">
                Safe and secure checkout
              </p>
            </div>
          </div>

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              border-b
              border-neutral-200
              px-4
              py-4
              sm:border-b-0
              sm:border-r
            "
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f3f6] text-neutral-700">
              <span className="text-sm">✓</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold">
                Quality assured
              </p>

              <p className="mt-0.5 text-[10px] text-neutral-500">
                Carefully selected products
              </p>
            </div>
          </div>

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              px-4
              py-4
            "
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f3f6] text-neutral-700">
              <span className="text-sm">↺</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold">
                Easy support
              </p>

              <p className="mt-0.5 text-[10px] text-neutral-500">
                We're here when you need us
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* CUSTOMER REVIEWS */}
      {/* ========================================================= */}

      <section className="w-full px-2 py-2 sm:px-3 lg:px-5 xl:px-6">

        <div className="border border-neutral-200 bg-white">

          {/* Heading */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-neutral-200
              px-4
              py-5
              sm:flex-row
              sm:items-end
              sm:justify-between
              sm:px-6
            "
          >

            <div className="min-w-0">

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Customer experience
              </p>

              <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                Ratings & Reviews
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-neutral-500 sm:text-sm">
                See what customers think about this product.
              </p>

            </div>

          </div>

          {/* Reviews */}

          <div className="p-4 sm:p-6">

            <ProductReviews />

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* RECOMMENDATIONS */}
      {/* ========================================================= */}

      <section className="w-full px-2 py-2 sm:px-3 lg:px-5 xl:px-6">

        <div className="border border-neutral-200 bg-white">

          {/* Heading */}

          <div
            className="
              flex
              items-end
              justify-between
              gap-4
              border-b
              border-neutral-200
              px-4
              py-5
              sm:px-6
            "
          >

            <div className="min-w-0">

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Curated for you
              </p>

              <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                You may also like
              </h2>

              <p className="mt-1.5 text-xs text-neutral-500 sm:text-sm">
                Discover more sarees from our collection.
              </p>

            </div>

            <Link
              href="/products"
              className="
                hidden
                shrink-0
                items-center
                gap-1
                text-xs
                font-semibold
                text-[#c73572]
                transition
                hover:text-[#a91d4f]
                sm:flex
              "
            >
              View all
              <ChevronRight size={14} />
            </Link>

          </div>

          {/* Products */}

          <div className="p-4 sm:p-6">

            <ProductRecommendations
              currentSlug={product.slug}
            />

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* RECENTLY VIEWED */}
      {/* ========================================================= */}

      <section className="w-full px-2 py-2 sm:px-3 lg:px-5 xl:px-6">

        <div className="border border-neutral-200 bg-white">

          <div className="border-b border-neutral-200 px-4 py-5 sm:px-6">

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Your browsing
            </p>

            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              Recently viewed
            </h2>

            <p className="mt-1.5 text-xs text-neutral-500 sm:text-sm">
              Continue exploring products you recently viewed.
            </p>

          </div>

          <div className="px-2 py-3 sm:px-4 sm:py-5">

            <RecentlyViewed />

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* CROSS SELL */}
      {/* ========================================================= */}

      <section className="w-full px-2 py-2 sm:px-3 lg:px-5 xl:px-6">

        <div className="border border-neutral-200 bg-white">

          <div className="border-b border-neutral-200 px-4 py-5 sm:px-6">

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Complete your look
            </p>

            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              You might also love
            </h2>

            <p className="mt-1.5 text-xs text-neutral-500 sm:text-sm">
              Explore complementary pieces selected for you.
            </p>

          </div>

          <div className="p-4 sm:p-6">

            <CrossSellProducts
              currentSlug={product.slug}
            />

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* MOBILE BACK BUTTON */}
      {/* ========================================================= */}

      <section className="px-2 pb-24 pt-2 sm:px-3 lg:hidden">

        <Link
          href="/products"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            border
            border-neutral-300
            bg-white
            px-5
            py-3
            text-xs
            font-semibold
            text-neutral-800
            transition
            hover:border-[#c73572]
            hover:text-[#c73572]
          "
        >
          <ArrowLeft size={15} />
          Back to sarees
        </Link>

      </section>

    </main>
  );
}

/* ============================================================= */
/* STATIC PARAMS */
/* ============================================================= */

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}