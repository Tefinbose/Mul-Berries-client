"use client";

import { RefreshCw } from "lucide-react";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({
  reset,
}: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="bg-[#f5f3ee]">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-lg text-center">
            {/* Logo */}
            <p className="text-sm font-semibold tracking-[0.3em] text-neutral-900">
              MULBERRIES
            </p>

            {/* Error message */}
            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              Something went wrong
            </h1>

            <p className="mt-4 leading-7 text-neutral-500">
              We're having trouble loading Mulberries right now.
              Please try again.
            </p>

            {/* Retry button */}
            <button
              type="button"
              onClick={() => reset()}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}