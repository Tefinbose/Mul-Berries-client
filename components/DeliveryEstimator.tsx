"use client";

import { CheckCircle2, MapPin, Truck, XCircle } from "lucide-react";
import { useState } from "react";

type DeliveryResult = {
  available: boolean;
  location?: string;
  days?: string;
  charge?: number;
};

export default function DeliveryEstimator() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<DeliveryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setResult({
        available: false,
      });

      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (pincode === "682001") {
        setResult({
          available: true,
          location: "Kochi, Kerala",
          days: "2–4 business days",
          charge: 99,
        });
      } else if (pincode === "682020") {
        setResult({
          available: true,
          location: "Ernakulam, Kerala",
          days: "3–5 business days",
          charge: 99,
        });
      } else if (pincode === "000000") {
        setResult({
          available: false,
        });
      } else {
        setResult({
          available: true,
          location: "Your location",
          days: "4–7 business days",
          charge: 149,
        });
      }

      setLoading(false);
    }, 600);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center gap-2">
        <Truck size={18} />

        <h3 className="text-sm font-semibold text-neutral-900">
          Check Delivery
        </h3>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter pincode"
            className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <button
          type="button"
          onClick={checkDelivery}
          disabled={loading}
          className="rounded-lg bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {result && (
        <div className="mt-4">
          {result.available ? (
            <div className="rounded-xl bg-neutral-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />

                <p className="text-sm font-medium text-neutral-900">
                  Delivery available
                </p>
              </div>

              <div className="mt-3 space-y-2 text-sm text-neutral-500">
                <p>{result.location}</p>

                <p>
                  Estimated delivery:{" "}
                  <span className="font-medium text-neutral-900">
                    {result.days}
                  </span>
                </p>

                <p>
                  Delivery charge:{" "}
                  <span className="font-medium text-neutral-900">
                    ₹{result.charge}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <XCircle size={18} />

              Delivery is currently unavailable for this
              pincode.
            </div>
          )}
        </div>
      )}
    </div>
  );
}