import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

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
        <div className="mx-auto w-full max-w-[1400px] px-3 py-2 sm:px-5 lg:px-7">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 overflow-hidden text-[11px] text-neutral-500 sm:text-xs"
          >
            <Link
              href="/"
              className="shrink-0 transition-colors hover:text-[#c73572]"
            >
              Home
            </Link>

            <ChevronRight
              size={12}
              className="shrink-0 text-neutral-400"
            />

            <Link
              href="/products"
              className="shrink-0 transition-colors hover:text-[#c73572]"
            >
              Sarees
            </Link>

            <ChevronRight
              size={12}
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

      <section className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-5">

        <div
          className="
            grid
            overflow-hidden
            rounded-sm
            border
            border-neutral-200
            bg-white
            lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]
          "
        >

          {/* ===================================================== */}
          {/* LEFT - PRODUCT IMAGE */}
          {/* ===================================================== */}

          <div
            className="
              min-w-0
              border-b
              border-neutral-200
              bg-white
              lg:border-b-0
              lg:border-r
            "
          >
            <div className="flex w-full items-center justify-center p-3 sm:p-4 lg:p-5 xl:p-6">

              {/* 
                IMPORTANT:
                Image size is intentionally controlled.
                Do not make this container larger.
              */}

              <div className="w-full max-w-[625px]">
                <ProductGallery
                  images={productImages}
                  productName={product.name}
                />
              </div>

            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT - PRODUCT DETAILS */}
          {/* ===================================================== */}

          <div className="min-w-0 bg-white">

            <div
              className="
                mx-auto
                flex
                h-full
                w-full
                max-w-[720px]
                flex-col
                px-5
                py-5
                sm:px-6
                sm:py-6
                lg:px-7
                lg:py-7
                xl:px-8
                xl:py-8
              "
            >
              <ProductDetails product={product} />
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* REVIEWS */}
      {/* ========================================================= */}

      <section className="mx-auto w-full max-w-[1400px] px-3 py-2 sm:px-5 lg:px-7">

        <div className="border border-neutral-200 bg-white">

          <div className="border-b border-neutral-200 px-4 py-4 sm:px-6">

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Customer experience
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
              Ratings & Reviews
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              See what customers think about this product.
            </p>

          </div>

          <div className="p-4 sm:p-5 lg:p-6">
            <ProductReviews />
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* RECOMMENDATIONS */}
      {/* ========================================================= */}

      <section className="mx-auto w-full max-w-[1400px] px-3 py-2 sm:px-5 lg:px-7">

        <div className="border border-neutral-200 bg-white">

          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4 sm:px-6">

            <div className="min-w-0">

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Curated for you
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
                You may also like
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                Discover more sarees from our collection.
              </p>

            </div>

            <Link
              href="/products"
              className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-[#c73572] hover:text-[#a91d4f] sm:flex"
            >
              View all
              <ChevronRight size={13} />
            </Link>

          </div>

          <div className="p-3 sm:p-5">
            <ProductRecommendations
              currentSlug={product.slug}
            />
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* RECENTLY VIEWED */}
      {/* ========================================================= */}

      <section className="mx-auto w-full max-w-[1400px] px-3 py-2 sm:px-5 lg:px-7">

        <div className="border border-neutral-200 bg-white">

          <div className="border-b border-neutral-200 px-4 py-4 sm:px-6">

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Your browsing
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
              Recently viewed
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
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

      <section className="mx-auto w-full max-w-[1400px] px-3 py-2 sm:px-5 lg:px-7">

        <div className="border border-neutral-200 bg-white">

          <div className="border-b border-neutral-200 px-4 py-4 sm:px-6">

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Complete your look
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
              You might also love
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Explore complementary pieces selected for you.
            </p>

          </div>

          <div className="p-3 sm:p-5">
            <CrossSellProducts
              currentSlug={product.slug}
            />
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* MOBILE BACK BUTTON */}
      {/* ========================================================= */}

      <section className="px-3 pb-20 pt-2 sm:px-5 lg:hidden">

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
          <ArrowLeft size={14} />
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