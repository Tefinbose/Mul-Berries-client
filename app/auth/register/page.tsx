"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "@/services/authApi";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check password
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Combine first name and last name
      const fullName =
        `${formData.firstName} ${formData.lastName}`.trim();

      // Call backend API
      const response = await registerApi({
        name: fullName,
        email: formData.email,
        password: formData.password,
      });

      // Store JWT token
      localStorage.setItem("token", response.token);

      // Optional: store user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      // Tell the navbar the user is now logged in
      window.dispatchEvent(new Event("auth-change"));

      console.log("Registration successful:", response);

      alert("Account created successfully!");

      // Redirect to homepage
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
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

        {/* BRAND PANEL (desktop) */}
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
              Join Mulberries
            </span>
          </div>

          <div className="relative max-w-md">
            <p className="text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
              Discover products
              <br />
              you&apos;ll love.
            </p>

            <p className="mt-5 leading-7 text-white/70">
              Create your account to save your favorites, track orders and
              enjoy a smoother shopping experience.
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
                Save your favorites to a wishlist
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
                Track your orders from checkout to delivery
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
                Check out faster with saved addresses
              </li>
            </ul>
          </div>

          <p className="relative text-sm text-white/50">
            © 2026 Mulberries. All rights reserved.
          </p>
        </aside>

        {/* FORM SIDE */}
        <section className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-10 xl:px-16">
          <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(23,23,23,0.04),0_16px_48px_-16px_rgba(23,23,23,0.14)] ring-1 ring-neutral-200/70 sm:p-9 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">

            <div className="mb-7 sm:mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
                Create account
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                Create your Mulberries account to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Names */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-neutral-800"
                  >
                    First name
                  </label>

                  <div className="group relative">
                    <User
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-[#c73572]"
                    />

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      autoComplete="given-name"
                      required
                      className="h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-[#faf9f6] pl-11 pr-4 text-base text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-[#c73572] focus:bg-white focus:ring-4 focus:ring-[#c73572]/10 sm:text-sm lg:bg-white"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-neutral-800"
                  >
                    Last name
                  </label>

                  <div className="group relative">
                    <User
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-[#c73572]"
                    />

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      autoComplete="family-name"
                      required
                      className="h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-[#faf9f6] pl-11 pr-4 text-base text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-[#c73572] focus:bg-white focus:ring-4 focus:ring-[#c73572]/10 sm:text-sm lg:bg-white"
                    />
                  </div>
                </div>
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Password
                </label>

                <div className="group relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-[#c73572]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-[#faf9f6] pl-11 pr-12 text-base text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-[#c73572] focus:bg-white focus:ring-4 focus:ring-[#c73572]/10 sm:text-sm lg:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
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

                <p className="mt-2 text-xs text-neutral-500">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Confirm password
                </label>

                <div className="group relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-[#c73572]"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-[#faf9f6] pl-11 pr-12 text-base text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-[#c73572] focus:bg-white focus:ring-4 focus:ring-[#c73572]/10 sm:text-sm lg:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-[#171717]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Register */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-6 text-sm font-semibold text-white transition hover:bg-[#c73572] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c73572]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-neutral-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-[#171717] underline-offset-4 transition-colors hover:text-[#c73572] hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-neutral-400">
              By creating an account, you agree to our terms and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-[#c73572]"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}