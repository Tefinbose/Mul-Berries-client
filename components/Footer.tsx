import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-9 px-6 py-14 md:grid-cols-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">MULBERRIES</h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-400">
            Premium products, thoughtfully selected for modern living.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">Shop</h3>
          <div className="mt-3 space-y-2.5 text-sm leading-5 text-neutral-400">
            <Link href="/products" className="block hover:text-white">
              Products
            </Link>
            <Link href="/categories" className="block hover:text-white">
              Categories
            </Link>
            <Link href="/wishlist" className="block hover:text-white">
              Wishlist
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">Company</h3>
          <div className="mt-3 space-y-2.5 text-sm leading-5 text-neutral-400">
            <Link href="/about" className="block hover:text-white">
              About
            </Link>
            <Link href="/contact" className="block hover:text-white">
              Contact
            </Link>
            <Link href="/privacy" className="block hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">Customer Care</h3>
          <div className="mt-3 space-y-2.5 text-sm leading-5 text-neutral-400">
            <Link href="/account/orders" className="block hover:text-white">
              Track Order
            </Link>
            <Link href="/account/returns" className="block hover:text-white">
              Returns
            </Link>
            <Link href="/faq" className="block hover:text-white">
              FAQ
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-9 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-start lg:px-12">
          <div>
            <Image
              src="/logo.png"
              alt="Mulberries"
              width={220}
              height={70}
              className="h-auto w-44 object-contain object-left brightness-0 invert"
            />
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Follow our social network
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-5 text-neutral-400">
              <a href="#" className="transition hover:text-white">Facebook</a>
              <a href="#" className="transition hover:text-white">Instagram</a>
              <a href="#" className="transition hover:text-white">YouTube</a>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Subscribe our newsletter
            </p>
            <form className="mt-4 flex max-w-md">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Email"
                className="min-w-0 flex-1 border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
              />
              <button
                type="submit"
                className="bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:bg-neutral-200"
              >
                Sign up
              </button>
            </form>
          </div>

          <div className="grid gap-5 text-sm leading-5 text-neutral-400 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Email us</p>
              <a href="mailto:contact@mulberries.shop" className="mt-2 block transition hover:text-white">
                contact@mulberries.shop
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Customer support</p>
              <a href="tel:+91971504715912" className="mt-2 block transition hover:text-white">
                971504715912
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Opening hours</p>
              <p className="mt-2">Monday - Friday: 09:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-neutral-500 sm:text-sm">
          © {new Date().getFullYear()} Mulberries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}