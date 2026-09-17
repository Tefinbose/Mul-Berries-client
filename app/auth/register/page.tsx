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
    <main className="min-h-screen bg-stone-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden bg-stone-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-tight text-white"
          >
            Mulberries
          </Link>

          <div className="max-w-md">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-stone-400">
              Join Mulberries
            </p>

            <h1 className="text-5xl font-semibold leading-tight text-white">
              Discover products
              <br />
              you'll love.
            </h1>

            <p className="mt-6 leading-7 text-stone-400">
              Create your account to save your favorites, track orders and
              enjoy a smoother shopping experience.
            </p>
          </div>

          <p className="text-sm text-stone-500">
            © 2026 Mulberries. All rights reserved.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-12 block text-center text-3xl font-semibold tracking-tight text-stone-900 lg:hidden"
            >
              Mulberries
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Account
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                Create account
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Create your Mulberries account to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Names */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    First Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                    />

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white py-3.5 px-4 text-sm outline-none transition focus:border-stone-900"
                  />
                </div>
              </div>

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
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-stone-900"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
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
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-stone-900"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
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
                className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-stone-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-stone-900 hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-stone-400">
              By creating an account, you agree to our terms and privacy
              policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}