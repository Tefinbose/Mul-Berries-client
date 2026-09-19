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

      console.log("LOGIN RESPONSE:", response);

      if (!response.success) {
        setError(
          response.message || "Login failed"
        );
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

      // Redirect after successful login
      router.push("/");
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
    <main className="min-h-screen bg-stone-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =========================
            LEFT SIDE
        ========================== */}
        <div className="hidden bg-stone-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-tight text-white"
          >
            Mulberries
          </Link>

          <div className="max-w-md">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-stone-400">
              Welcome Back
            </p>

            <h1 className="text-5xl font-semibold leading-tight text-white">
              Everything you love,
              <br />
              in one place.
            </h1>

            <p className="mt-6 leading-7 text-stone-400">
              Sign in to access your wishlist,
              orders, saved addresses and
              personalized shopping experience.
            </p>
          </div>

          <p className="text-sm text-stone-500">
            © 2026 Mulberries. All rights reserved.
          </p>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-12 block text-center text-3xl font-semibold tracking-tight text-stone-900 lg:hidden"
            >
              Mulberries
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Account
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                Sign in
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Welcome back. Please enter your details.
              </p>
            </div>

            {/* =========================
                ERROR MESSAGE
            ========================== */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* =========================
                FORM
            ========================== */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
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
                    className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-stone-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-stone-600 hover:text-black"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
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
                    className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
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
                className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-stone-500">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-stone-900 hover:underline"
              >
                Create an account
              </Link>
            </p>

            {/* Guest Checkout */}
            <div className="mt-8 border-t border-stone-200 pt-6 text-center">
              <p className="text-xs text-stone-500">
                You can also continue shopping without
                an account.
              </p>

              <Link
                href="/products"
                className="mt-2 inline-block text-sm font-medium text-stone-800 hover:underline"
              >
                Continue as guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}