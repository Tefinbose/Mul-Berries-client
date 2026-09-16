import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-neutral-600">
            These Terms & Conditions explain the rules and conditions that
            apply when you use the Mulberries website and purchase our
            products.
          </p>

          <p className="mt-4 text-sm text-neutral-500">
            Last updated: September 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="space-y-12">
          {/* 1 */}
          <section>
            <h2 className="text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              By accessing or using the Mulberries website, you agree to be
              bound by these Terms & Conditions. If you do not agree with any
              part of these terms, please do not use the website.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-semibold">
              2. About Mulberries
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              Mulberries is an e-commerce platform that allows customers to
              browse products, place orders, make payments, and access
              related services.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              Product availability, pricing, offers, shipping charges, and
              delivery estimates may change from time to time.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-semibold">
              3. Account Registration
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              Some features may require you to create an account. You are
              responsible for providing accurate and complete information
              during registration.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              You are also responsible for maintaining the confidentiality of
              your account credentials and for activities performed through
              your account.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-semibold">
              4. Products and Product Information
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              We make reasonable efforts to ensure that product descriptions,
              images, prices, specifications, and availability are accurate.
              However, minor differences may occur between displayed images
              and the actual product.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              We reserve the right to correct errors, update product
              information, or change product availability without prior
              notice.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-semibold">
              5. Pricing and Payments
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              All prices displayed on the website are subject to change.
              Applicable taxes, shipping charges, discounts, and other
              charges may be added during checkout where applicable.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              Payments may be processed through third-party payment
              providers. By proceeding with a payment, you agree to the
              applicable terms of the payment provider.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-semibold">
              6. Orders
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              Placing an order constitutes a request to purchase the selected
              products. An order may be subject to verification and
              acceptance.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              We reserve the right to cancel or refuse an order in situations
              including product unavailability, pricing errors, suspected
              fraudulent activity, payment issues, or other operational
              reasons.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-semibold">
              7. Shipping and Delivery
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              Delivery estimates shown during checkout are estimates and may
              vary depending on the destination, courier availability,
              weather, operational conditions, and other factors.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              Once an order has been shipped, tracking information may be
              provided where available.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold">
              8. Returns and Refunds
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              Returns and refunds are subject to the applicable Mulberries
              return policy and the conditions associated with the purchased
              product.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              Refund processing times may depend on the selected payment
              method and the payment provider or financial institution.
            </p>

            <Link
              href="/account/returns"
              className="mt-5 inline-block text-sm font-medium underline underline-offset-4"
            >
              View Returns & Refunds
            </Link>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-semibold">
              9. Coupons and Offers
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              Promotional offers and coupon codes may have specific
              eligibility requirements, minimum order values, expiry dates,
              product restrictions, or usage limits.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              Mulberries reserves the right to modify, suspend, or cancel a
              promotional offer where necessary.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-semibold">
              10. User Conduct
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              You agree not to misuse the website or attempt to interfere
              with its operation.
            </p>

            <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-neutral-600">
              <li>
                Do not use the website for unlawful purposes.
              </li>

              <li>
                Do not attempt to gain unauthorized access to accounts,
                systems, or administrative features.
              </li>

              <li>
                Do not submit false or misleading information.
              </li>

              <li>
                Do not attempt to disrupt, damage, or overload the website.
              </li>

              <li>
                Do not use automated methods to abuse website functionality.
              </li>
            </ul>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-semibold">
              11. Reviews and User Content
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              If the website allows users to submit reviews or other content,
              you are responsible for ensuring that the content is accurate,
              lawful, and does not violate the rights of others.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              We may remove content that violates applicable rules,
              policies, or legal requirements.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-semibold">
              12. Intellectual Property
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              The website, including its design, branding, text, graphics,
              logos, software, and other materials, may be protected by
              applicable intellectual-property laws.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              You may not reproduce, distribute, modify, or commercially
              exploit website content without appropriate authorization.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-2xl font-semibold">
              13. Third-Party Services
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              The Mulberries platform may use third-party services for
              payments, shipping, analytics, communication, authentication,
              hosting, and other functionality.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              Third-party services may have their own terms and privacy
              policies, which may apply to your use of those services.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-2xl font-semibold">
              14. Limitation of Liability
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              To the extent permitted by applicable law, Mulberries shall not
              be responsible for losses arising from circumstances outside
              its reasonable control, including interruptions, courier
              delays, payment-provider failures, network problems, or other
              third-party service disruptions.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-2xl font-semibold">
              15. Changes to These Terms
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              We may update these Terms & Conditions from time to time.
              Changes will become effective when the updated terms are
              published on the website.
            </p>

            <p className="mt-4 leading-7 text-neutral-600">
              You should periodically review this page for updates.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-2xl font-semibold">
              16. Contact Us
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              If you have questions regarding these Terms & Conditions,
              please contact our support team.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-block rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Contact Support
            </Link>
          </section>

          {/* Links */}
          <section className="border-t pt-8">
            <div className="flex flex-wrap gap-5 text-sm">
              <Link
                href="/privacy"
                className="underline underline-offset-4"
              >
                Privacy Policy
              </Link>

              <Link
                href="/contact"
                className="underline underline-offset-4"
              >
                Contact Us
              </Link>

              <Link
                href="/"
                className="underline underline-offset-4"
              >
                Back to Home
              </Link>
            </div>
          </section>

          {/* Development Notice */}
          <div className="rounded-xl border bg-neutral-50 p-5 text-sm leading-6 text-neutral-500">
            <strong className="text-neutral-800">
              Development notice:
            </strong>{" "}
            This page is currently a frontend implementation for the
            Mulberries project. Before production launch, the legal content
            should be reviewed and finalized for the actual business,
            jurisdiction, payment providers, shipping partners, return
            policy, and applicable laws.
          </div>
        </div>
      </section>
    </main>
  );
}