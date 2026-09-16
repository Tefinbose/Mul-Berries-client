"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <AlertTriangle
            size={28}
            className="text-neutral-700"
          />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 leading-7 text-neutral-500">
          We couldn't load this page right now. Please try again
          or return to the Mulberries homepage.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}