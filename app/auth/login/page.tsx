"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/services/authApi";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove previous error when user starts typing again
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginApi(formData);

      if (!response.success) {
        setError(response.message || "Login failed");
        return;
      }

      /*
       * Save authentication information.
       *
       * The token will be used later for protected
       * API requests such as:
       *
       * /api/cart
       * /api/wishlist
       * /api/addresses
       * /api/orders
       * /api/auth/me
       */

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      // Tell the navbar the user is now logged in
      window.dispatchEvent(new Event("auth-change"));

      // ==========================================
      // ROLE-BASED REDIRECT
      // ==========================================

      const role = response.user?.role;

      if (role === "staff" || role === "superadmin") {
        // Staff and superadmin go to staff dashboard
        router.push("/staff/dashboard");
      } else if (
        role === "admin" ||
        role === "manager"
      ) {
        // Admin and manager go to admin dashboard
        router.push("/admin");
      } else {
        // Normal customer - check for redirect param
        const redirectUrl =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("redirect")
            : null;

        router.push(redirectUrl || "/");
      }

      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f5f3ee]">
      {/*
        The navbar (announcement bar + header) sits above this page,
        so the height is offset by it: 117px on mobile, 125px on desktop.
      */}
      <div className="mx-auto grid min-h-[calc(100dvh-117px)] w-full max-w-[1440px] lg:min-h-[calc(100dvh-125px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">

        {/* =========================
            BRAND PANEL (desktop)
        ========================== */}

        <aside className="relative m-4 hidden overflow-hidden rounded-[28px] bg-[linear-gradient(150deg,#3a1856_0%,#57277d_48%,#a72d6c_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:m-6 xl:p-14">

          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#c73572]/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10"
          />

          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              Welcome back
            </span>
          </div>

          <div className="relative max-w-md">
            <p className="text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
              Everything you love,
              <br />
              in one place.
            </p>

            <p className="mt-5 leading-7 text-white/70">
              Sign in to access your wishlist,
              orders, saved addresses and
              personalized shopping experience.
            </p>

            <ul className="mt-8 space-y-3.5 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                Your wishlist, saved and ready
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                Track every order in one place
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                Saved addresses for faster checkout
              </li>
            </ul>
          </div>

          <p className="relative text-sm text-white/50">
            © 2026 Mulberries. All rights reserved.
          </p>
        </aside>

        {/* =========================
            FORM SIDE
        ========================== */}

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-10 xl:px-16">
          <div className="w-full max-w-[440px] rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(23,23,23,0.04),0_16px_48px_-16px_rgba(23,23,23,0.14)] ring-1 ring-neutral-200/70 sm:p-9 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">

            {/* Heading */}

            <div className="mb-7 sm:mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
                Sign in
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                Welcome back. Please enter your details.
              </p>
            </div>

            {/* =========================
                ERROR MESSAGE
            ========================== */}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="break-words text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* =========================
                FORM
            ========================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-[#c73572]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-[#faf9f6] pl-11 pr-4 text-base text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-[#c73572] focus:bg-white focus:ring-4 focus:ring-[#c73572]/10 sm:text-sm lg:bg-white"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-neutral-800"
                  >
                    Password
                  </label>

                  <Link
                    href="/auth/forgot-password"
                    className="-my-1 py-1 text-sm font-medium text-neutral-500 transition-colors hover:text-[#c73572]"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="group relative">

                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-[#c73572]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-[#faf9f6] pl-11 pr-12 text-base text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-[#c73572] focus:bg-white focus:ring-4 focus:ring-[#c73572]/10 sm:text-sm lg:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-[#171717]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-6 text-sm font-semibold text-white transition hover:bg-[#c73572] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c73572]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>

            </form>

            {/* Register */}

            <p className="mt-6 text-center text-sm text-neutral-500">
              Don&apos;t have an account?{" "}

              <Link
                href="/auth/register"
                className="font-semibold text-[#171717] underline-offset-4 transition-colors hover:text-[#c73572] hover:underline"
              >
                Create an account
              </Link>
            </p>

            {/* Guest Checkout */}

            <div className="mt-6 border-t border-neutral-200 pt-6 text-center">

              <p className="text-xs text-neutral-500">
                You can also checkout or continue shopping without an account.
              </p>

              <Link
                href="/checkout?guest=true"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-neutral-300 text-sm font-medium text-[#171717] transition hover:border-[#171717] hover:bg-neutral-50"
              >
                Continue to Guest Checkout
              </Link>

            </div>

          </div>
        </section>

      </div>
    </main>
  );
}