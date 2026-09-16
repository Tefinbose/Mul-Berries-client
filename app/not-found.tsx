"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-white px-6">
      <div className="w-full max-w-xl text-center">
        {/* 404 */}
        <p className="text-7xl font-semibold tracking-tight text-neutral-200 md:text-9xl">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Page not found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md leading-7 text-neutral-500">
          The page you're looking for doesn't exist or may have
          been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <Home size={16} />
            Back to Home
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
          >
            <Search size={16} />
            Browse Products
          </Link>
        </div>

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={15} />
          Go back
        </button>
      </div>
    </main>
  );
}