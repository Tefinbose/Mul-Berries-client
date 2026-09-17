import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const styles = [
  {
    title: "Wedding Edit",
    description: "Elegant silk sarees for unforgettable celebrations.",
    image: "/products/yellow-pink-bridal.jpg",
    href: "/categories/bridal-sarees",
  },
  {
    title: "Festive Edit",
    description: "Rich colours and timeless details made for festivities.",
    image: "/products/ivory-gold-festive.jpg",
    href: "/categories/festive-sarees",
  },
  {
    title: "Everyday Grace",
    description: "Simple, effortless sarees for everyday elegance.",
    image: "/products/traditional-kerala-kasavu.jpg",
    href: "/categories/kerala-sarees",
  },
];

export default function StyleInspiration() {
  return (
    <section className="w-full py-12 sm:py-14 lg:py-20">
      <div className="site-container">
      {/* Heading */}
      <div className="w-full">
        <div className="max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
            The Mulberries Edit
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Style Inspiration
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Find inspiration for every celebration, occasion and everyday
            moment.
          </p>
        </div>
      </div>

      {/* Editorial Cards */}
      <div className="mt-7 grid w-full gap-4 md:grid-cols-3">
        {styles.map((style) => (
          <Link
            key={style.title}
            href={style.href}
            className="
              group
              relative
              block
              w-full
              overflow-hidden
              rounded-[22px]
              bg-neutral-900
            "
          >
            {/* Image */}
            <div
              className="
                aspect-[16/10]
                w-full
                bg-cover
                bg-center
                transition
                duration-700
                group-hover:scale-105
              "
              style={{
                backgroundImage: `url(${style.image})`,
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {style.title}
                  </h3>

                  <p className="mt-1.5 max-w-xs text-[11px] leading-5 text-white/75 sm:text-xs">
                    {style.description}
                  </p>
                </div>

                <span
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                    backdrop-blur-sm
                    transition
                    group-hover:bg-white
                    group-hover:text-neutral-950
                    sm:h-9
                    sm:w-9
                  "
                >
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}