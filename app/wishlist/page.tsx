"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";

const initialWishlist = [
  {
    id: 1,
    name: "Classic Linen Shirt",
    category: "Men",
    price: 1499,
    oldPrice: 1999,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    slug: "classic-linen-shirt",
  },
  {
    id: 2,
    name: "Leather Handbag",
    category: "Women",
    price: 2499,
    oldPrice: 3499,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    slug: "leather-handbag",
  },
  {
    id: 3,
    name: "Ceramic Vase",
    category: "Home & Living",
    price: 1299,
    oldPrice: 1899,
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    slug: "ceramic-vase",
  },
  {
    id: 4,
    name: "Silk Designer Saree",
    category: "Women",
    price: 4499,
    oldPrice: 5999,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    slug: "silk-designer-saree",
  },
  {
    id: 5,
    name: "Cotton Kurta Set",
    category: "Women",
    price: 1899,
    oldPrice: 2499,
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80",
    slug: "cotton-kurta-set",
  },
  {
    id: 6,
    name: "Premium Leather Shoes",
    category: "Men",
    price: 2999,
    oldPrice: 3999,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    slug: "premium-leather-shoes",
  },
  {
    id: 7,
    name: "Minimal Ceramic Pot",
    category: "Home & Living",
    price: 999,
    oldPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    slug: "minimal-ceramic-pot",
  },
  {
    id: 8,
    name: "Elegant Shoulder Bag",
    category: "Women",
    price: 2199,
    oldPrice: 2999,
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
    slug: "elegant-shoulder-bag",
  },
  {
    id: 9,
    name: "Classic Casual Shirt",
    category: "Men",
    price: 1399,
    oldPrice: 1899,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    slug: "classic-casual-shirt",
  },
  {
    id: 10,
    name: "Handwoven Saree",
    category: "Women",
    price: 3899,
    oldPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1610189012906-4c4c0c6f7b52?auto=format&fit=crop&w=800&q=80",
    slug: "handwoven-saree",
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const removeItem = (id: number) => {
    setWishlist((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#171717]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <section className="border-b border-[#e5e1da] bg-[#f5f3ee] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
        <div className="site-container">

          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a91d4f]">
            Your Collection
          </p>

          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-3xl">
            Wishlist
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-neutral-600 sm:text-sm">
            Save the products you love and come back to them anytime.
          </p>

        </div>
      </section>

      {/* ===================================================== */}
      {/* WISHLIST */}
      {/* ===================================================== */}

      <section className="site-container px-3 py-4 sm:px-5 sm:py-5 lg:px-6">

        {wishlist.length > 0 ? (
          <>

            {/* ================================================= */}
            {/* TOP BAR */}
            {/* ================================================= */}

            <div className="mb-3 flex items-center justify-between border-b border-[#e5e1da] pb-3">

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500 sm:text-xs">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"} saved
              </p>

              <button
                onClick={clearWishlist}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                  transition
                  hover:text-[#a91d4f]
                  sm:text-xs
                "
              >
                <Trash2 size={13} />
                Clear wishlist
              </button>

            </div>

            {/* ================================================= */}
            {/* PRODUCT GRID */}
            {/* ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-3
                sm:gap-3
                md:grid-cols-4
                lg:grid-cols-5
                lg:gap-3
                xl:gap-4
              "
            >

              {wishlist.map((product) => (
                <article
                  key={product.id}
                  className="
                    group
                    min-w-0
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#e5e1da]
                    bg-white
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_8px_24px_rgba(23,23,23,0.08)]
                  "
                >

                  {/* ========================================= */}
                  {/* IMAGE */}
                  {/* ========================================= */}

                  <div
                    className="
                      relative
                      aspect-[4/4.3]
                      w-full
                      overflow-hidden
                      bg-[#f0eee8]
                    "
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-[1.03]
                      "
                    />

                    {/* Wishlist */}

                    <button
                      onClick={() => removeItem(product.id)}
                      className="
                        absolute
                        right-2
                        top-2
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        shadow-sm
                        transition
                        hover:scale-105
                      "
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Heart
                        size={14}
                        className="fill-[#a91d4f] text-[#a91d4f]"
                      />
                    </button>

                  </div>

                  {/* ========================================= */}
                  {/* DETAILS */}
                  {/* ========================================= */}

                  <div className="p-2.5 sm:p-3">

                    {/* Category */}

                    <p className="mb-1.5 truncate text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a91d4f] sm:text-[9px]">
                      {product.category}
                    </p>

                    {/* Name */}

                    <Link
                      href={`/products/${product.slug}`}
                      className="block"
                    >
                      <h2
                        className="
                          line-clamp-2
                          min-h-[32px]
                          text-xs
                          font-semibold
                          leading-4
                          tracking-tight
                          text-[#171717]
                          transition
                          group-hover:text-[#a91d4f]
                          sm:text-sm
                          sm:leading-[18px]
                        "
                      >
                        {product.name}
                      </h2>
                    </Link>

                    {/* Delivery */}

                    <p className="mt-1.5 truncate text-[9px] leading-4 text-neutral-400">
                      Usually delivered in 3–5 days
                    </p>

                    {/* Price */}

                    <div className="mt-2 flex items-center gap-1.5">

                      <span className="text-sm font-semibold text-[#a91d4f] sm:text-base">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-[9px] text-neutral-400 line-through sm:text-[10px]">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>

                    </div>

                    {/* Actions */}

                    <div className="mt-3 flex items-center justify-between gap-2">

                      <Link
                        href={`/products/${product.slug}`}
                        className="
                          min-w-0
                          flex-1
                          rounded-md
                          bg-[#171717]
                          px-2
                          py-2
                          text-center
                          text-[9px]
                          font-semibold
                          text-white
                          transition
                          hover:bg-[#a91d4f]
                          sm:text-[10px]
                        "
                      >
                        View Product
                      </Link>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[#e5e1da]
                          text-neutral-500
                          transition
                          hover:border-[#a91d4f]
                          hover:text-[#a91d4f]
                        "
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 size={13} />
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          </>
        ) : (

          /* =================================================== */
          /* EMPTY WISHLIST */
          /* =================================================== */

          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-[#e5e1da] bg-white px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e9ef]">
              <ShoppingBag
                size={24}
                className="text-[#a91d4f]"
              />
            </div>

            <h2 className="text-xl font-semibold text-[#171717]">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-xs leading-5 text-neutral-500 sm:text-sm">
              Save products you love and they will appear here.
            </p>

            <Link
              href="/products"
              className="
                mt-5
                rounded-lg
                bg-[#171717]
                px-6
                py-2.5
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#a91d4f]
              "
            >
              Continue Shopping
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}