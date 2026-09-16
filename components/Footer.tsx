import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <h2 className="text-xl font-semibold">MULBERRIES</h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-400">
            Premium products, thoughtfully selected for modern living.
          </p>
        </div>

        <div>
          <h3 className="font-medium">Shop</h3>
          <div className="mt-4 space-y-3 text-sm text-neutral-400">
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
          <h3 className="font-medium">Company</h3>
          <div className="mt-4 space-y-3 text-sm text-neutral-400">
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
          <h3 className="font-medium">Customer Care</h3>
          <div className="mt-4 space-y-3 text-sm text-neutral-400">
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
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} Mulberries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}