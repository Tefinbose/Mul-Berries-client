import {
  BadgeCheck,
  Heart,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Premium fabrics",
    description:
      "Thoughtfully selected fabrics that feel as beautiful as they look.",
  },
  {
    icon: BadgeCheck,
    title: "Quality you can trust",
    description:
      "Every piece is carefully selected for quality, finish and detail.",
  },
  {
    icon: Heart,
    title: "Curated with care",
    description:
      "Collections chosen to bring timeless style to every occasion.",
  },
  {
    icon: ShieldCheck,
    title: "A trusted experience",
    description:
      "A simple and reliable shopping experience from selection to delivery.",
  },
];

export default function WhyPeopleChooseUs() {
  return (
    <section className="w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

      {/* Main Card */}
      <div className="w-full overflow-hidden rounded-[28px] border border-neutral-200/80 bg-[#f7f7f2] shadow-sm">

        <div className="grid w-full lg:grid-cols-[0.9fr_1.1fr]">

          {/* Content */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 xl:px-16">

            <div className="flex items-center gap-2">
              <span className="h-px w-7 bg-neutral-950" />

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                The Mulberries Promise
              </p>
            </div>

            <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Why people
              <br />
              <span className="text-neutral-500">
                love Mulberries.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
              We believe beautiful products should come with an equally
              thoughtful shopping experience. Every collection is selected
              with quality, elegance and everyday wearability in mind.
            </p>

            {/* Benefits */}
            <div className="mt-9 grid gap-0 sm:grid-cols-2">

              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className={`
                      flex gap-4 border-neutral-200/80 py-5
                      ${index >= 2 ? "border-t" : ""}
                      ${
                        index % 2 === 1
                          ? "sm:border-l sm:pl-6"
                          : "sm:pr-6"
                      }
                    `}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
                      <Icon
                        size={16}
                        strokeWidth={1.7}
                        className="text-neutral-800"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-neutral-950">
                        {benefit.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-neutral-500">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[420px] overflow-hidden bg-neutral-900 sm:min-h-[500px] lg:min-h-[620px]">

            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85"
              alt="Elegant saree from the Mulberries collection"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

            {/* Image Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/65">
                Thoughtfully selected
              </p>

              <p className="mt-2 max-w-sm text-lg font-medium leading-6 text-white sm:text-xl">
                Timeless pieces made to become part of your story.
              </p>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}