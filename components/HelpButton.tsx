"use client";

import { useState } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Mail,
} from "lucide-react";

export default function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HELP PANEL */}

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[280px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] sm:right-6">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Need help?
              </p>

              <p className="mt-0.5 text-[10px] text-neutral-500">
                We&apos;re here for you.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close help"
              className="flex h-8 w-8 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-3">
            <a
              href="https://wa.me/"
              className="flex items-center gap-3 border border-neutral-200 px-3 py-3 transition hover:border-[#c73572] hover:bg-[#fff7fa]"
            >
              <div className="flex h-9 w-9 items-center justify-center bg-[#f1f3f6]">
                <MessageCircle size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold">
                  WhatsApp
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Chat with us
                </p>
              </div>
            </a>

            <a
              href="tel:+910000000000"
              className="mt-2 flex items-center gap-3 border border-neutral-200 px-3 py-3 transition hover:border-[#c73572] hover:bg-[#fff7fa]"
            >
              <div className="flex h-9 w-9 items-center justify-center bg-[#f1f3f6]">
                <Phone size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold">
                  Call us
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Talk to our team
                </p>
              </div>
            </a>

            <a
              href="mailto:support@mulberries.shop"
              className="mt-2 flex items-center gap-3 border border-neutral-200 px-3 py-3 transition hover:border-[#c73572] hover:bg-[#fff7fa]"
            >
              <div className="flex h-9 w-9 items-center justify-center bg-[#f1f3f6]">
                <Mail size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold">
                  Email
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Send us a message
                </p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close help" : "Open help"}
        className="fixed bottom-5 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#c73572] text-white shadow-[0_8px_25px_rgba(199,53,114,0.30)] transition hover:scale-105 hover:bg-[#a91d4f] sm:right-6"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </>
  );
}