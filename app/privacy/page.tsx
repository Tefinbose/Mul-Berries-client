import Link from "next/link";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "When you use Mulberries, we may collect information that you provide directly to us, such as your name, email address, phone number, billing address, shipping address and account information.",
      "We may also collect information related to your orders, payments, returns, reviews and customer support requests.",
      "Some technical information may also be collected automatically when you use our website, such as browser type, device information, IP address and website usage information.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect to provide and improve our services.",
      "This may include processing orders, delivering products, processing payments, managing returns and refunds, providing customer support and communicating important account or order updates.",
      "We may also use information to improve our website, understand customer behavior and provide relevant products or offers.",
    ],
  },
  {
    title: "3. Account Information",
    content: [
      "If you create a Mulberries account, you are responsible for keeping your account credentials secure.",
      "You should notify us if you believe that your account has been accessed without authorization.",
      "You can update certain account information through your account settings.",
    ],
  },
  {
    title: "4. Payments",
    content: [
      "Payments may be processed through third-party payment providers.",
      "Mulberries does not need to store complete payment-card details on its own servers when payment processing is handled by an authorized payment provider.",
      "Payment providers may process information according to their own privacy policies and terms.",
    ],
  },
  {
    title: "5. Cookies and Similar Technologies",
    content: [
      "We may use cookies and similar technologies to keep you signed in, remember preferences, improve website functionality and understand how our website is used.",
      "You may be able to control cookies through your browser settings. Disabling certain cookies may affect some website functionality.",
    ],
  },
  {
    title: "6. Order and Delivery Information",
    content: [
      "Information required to deliver an order may be shared with relevant delivery and logistics providers.",
      "This may include your name, phone number, delivery address and information necessary to track and complete the shipment.",
    ],
  },
  {
    title: "7. Communications",
    content: [
      "We may contact you regarding your account, orders, payments, deliveries, returns, refunds and other service-related matters.",
      "Where permitted by applicable law, we may also send promotional communications. You can use the available unsubscribe options for promotional communications.",
    ],
  },
  {
    title: "8. Data Security",
    content: [
      "We take reasonable measures to protect information against unauthorized access, alteration, disclosure or destruction.",
      "However, no method of transmission or electronic storage can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "9. Data Retention",
    content: [
      "We retain information for as long as reasonably necessary to provide our services, complete transactions, comply with legal obligations, resolve disputes and enforce our agreements.",
    ],
  },
  {
    title: "10. Your Rights",
    content: [
      "Depending on applicable law, you may have rights relating to your personal information, including requesting access, correction or deletion of certain information.",
      "You may contact our support team regarding privacy-related requests.",
    ],
  },
  {
    title: "11. Third-Party Services",
    content: [
      "Our website may use third-party services such as payment providers, delivery providers, analytics services and cloud infrastructure providers.",
      "These services may process information according to their own terms and privacy policies.",
    ],
  },
  {
    title: "12. Children's Privacy",
    content: [
      "Our services are not intended to knowingly collect personal information from children where such collection is restricted by applicable law.",
      "If you believe that a child has provided personal information to us improperly, please contact our support team.",
    ],
  },
  {
    title: "13. Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time.",
      "When changes are made, the updated version will be published on this page with the revised effective date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="border-b bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral-500">
            This Privacy Policy explains how Mulberries may collect,
            use and protect information when you use our website and
            services.
          </p>

          <p className="mt-5 text-xs text-neutral-400">
            Last updated: September 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-14">

        {/* Introduction */}
        <div className="rounded-2xl border bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-lg font-semibold">
            Your privacy matters
          </h2>

          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Mulberries respects your privacy and aims to handle your
            information responsibly. This policy describes the
            general types of information that may be collected and
            how that information may be used when you interact with
            our e-commerce platform.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4">
                {section.content.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-neutral-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <section className="mt-14 rounded-2xl border bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            Contact us about privacy
          </h2>

          <p className="mt-3 text-sm leading-7 text-neutral-600">
            If you have questions about this Privacy Policy or how
            your information is handled, please contact our support
            team.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Contact Support
          </Link>
        </section>

        {/* Navigation */}
        <div className="mt-12 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            ← Back to Home
          </Link>

          <Link
            href="/terms"
            className="text-sm font-medium underline underline-offset-4"
          >
            Terms & Conditions →
          </Link>
        </div>

        {/* Development Notice */}
        <div className="mt-10 rounded-xl border border-dashed p-4 text-xs leading-5 text-neutral-500">
          <strong>Development notice:</strong> This is a frontend
          draft for the Mulberries project. Before the website goes
          live, this policy should be reviewed and finalized based
          on the actual business, payment providers, logistics
          providers, data practices and applicable laws.
        </div>

      </div>
    </main>
  );
}