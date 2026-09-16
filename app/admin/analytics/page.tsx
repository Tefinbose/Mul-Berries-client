"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  IndianRupee,
  Package,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type Period = "7 Days" | "30 Days" | "90 Days" | "1 Year";

const salesData = {
  "7 Days": [
    { label: "Mon", sales: 32000, orders: 28 },
    { label: "Tue", sales: 41000, orders: 34 },
    { label: "Wed", sales: 38000, orders: 31 },
    { label: "Thu", sales: 52000, orders: 42 },
    { label: "Fri", sales: 47000, orders: 38 },
    { label: "Sat", sales: 61000, orders: 51 },
    { label: "Sun", sales: 53000, orders: 44 },
  ],

  "30 Days": [
    { label: "Week 1", sales: 185000, orders: 142 },
    { label: "Week 2", sales: 224000, orders: 168 },
    { label: "Week 3", sales: 267000, orders: 193 },
    { label: "Week 4", sales: 312000, orders: 226 },
  ],

  "90 Days": [
    { label: "Month 1", sales: 720000, orders: 524 },
    { label: "Month 2", sales: 845000, orders: 612 },
    { label: "Month 3", sales: 982000, orders: 704 },
  ],

  "1 Year": [
    { label: "Jan", sales: 480000, orders: 352 },
    { label: "Feb", sales: 520000, orders: 381 },
    { label: "Mar", sales: 610000, orders: 438 },
    { label: "Apr", sales: 580000, orders: 421 },
    { label: "May", sales: 690000, orders: 492 },
    { label: "Jun", sales: 740000, orders: 531 },
    { label: "Jul", sales: 810000, orders: 582 },
    { label: "Aug", sales: 920000, orders: 648 },
    { label: "Sep", sales: 875000, orders: 621 },
    { label: "Oct", sales: 980000, orders: 704 },
    { label: "Nov", sales: 1120000, orders: 812 },
    { label: "Dec", sales: 1280000, orders: 921 },
  ],
};

const topProducts = [
  {
    name: "Royal Red Kanjivaram Silk Saree",
    sales: 86,
    revenue: 773914,
  },
  {
    name: "Royal Purple Banarasi Silk Saree",
    sales: 72,
    revenue: 719928,
  },
  {
    name: "Yellow & Pink Bridal Silk Saree",
    sales: 64,
    revenue: 607936,
  },
  {
    name: "Maroon Pure Silk Saree",
    sales: 58,
    revenue: 481342,
  },
  {
    name: "Teal Designer Silk Saree",
    sales: 47,
    revenue: 397953,
  },
];

const categoryData = [
  {
    name: "Silk Sarees",
    orders: 184,
    revenue: 1654000,
    percentage: 42,
  },
  {
    name: "Designer Sarees",
    orders: 126,
    revenue: 1089000,
    percentage: 28,
  },
  {
    name: "Bridal Collection",
    orders: 98,
    revenue: 824000,
    percentage: 21,
  },
  {
    name: "Kerala Collection",
    orders: 43,
    revenue: 186000,
    percentage: 9,
  },
];

const funnelData = [
  {
    label: "Visitors",
    value: 24860,
    percentage: 100,
  },
  {
    label: "Product Views",
    value: 14820,
    percentage: 59.6,
  },
  {
    label: "Added to Cart",
    value: 4860,
    percentage: 19.6,
  },
  {
    label: "Checkout Started",
    value: 2910,
    percentage: 11.7,
  },
  {
    label: "Orders Completed",
    value: 1842,
    percentage: 7.4,
  },
];

type InsightType = "warning" | "success" | "danger" | "info";

const alerts: {
  type: InsightType;
  title: string;
  description: string;
}[] = [
  {
    type: "warning",
    title: "Low Stock",
    description: "Some products are running low on inventory.",
  },
  {
    type: "success",
    title: "Strong Sales",
    description: "Sales are performing well this period.",
  },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7 Days");

  const currentData = salesData[period];

  const totalSales = useMemo(() => {
    return currentData.reduce(
      (total, item) => total + item.sales,
      0
    );
  }, [currentData]);

  const totalOrders = useMemo(() => {
    return currentData.reduce(
      (total, item) => total + item.orders,
      0
    );
  }, [currentData]);

  const averageOrderValue =
    totalOrders > 0
      ? Math.round(totalSales / totalOrders)
      : 0;

  const maxSales = Math.max(
    ...currentData.map((item) => item.sales)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Understand your store performance and customer
            behaviour.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <CalendarDays
              size={17}
              className="text-neutral-500"
            />

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as Period)
              }
              className="bg-transparent text-sm font-medium outline-none"
            >
              <option value="7 Days">Last 7 Days</option>
              <option value="30 Days">Last 30 Days</option>
              <option value="90 Days">Last 90 Days</option>
              <option value="1 Year">Last 1 Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          title="Total Revenue"
          value={`₹${totalSales.toLocaleString("en-IN")}`}
          change="+18.4%"
          positive
          icon={<IndianRupee size={20} />}
        />

        <AnalyticsCard
          title="Total Orders"
          value={totalOrders.toLocaleString("en-IN")}
          change="+12.8%"
          positive
          icon={<ShoppingBag size={20} />}
        />

        <AnalyticsCard
          title="Customers"
          value="1,284"
          change="+14.3%"
          positive
          icon={<Users size={20} />}
        />

        <AnalyticsCard
          title="Average Order Value"
          value={`₹${averageOrderValue.toLocaleString(
            "en-IN"
          )}`}
          change="-2.4%"
          positive={false}
          icon={<TrendingDown size={20} />}
        />
      </div>

      {/* Sales Overview */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Sales Overview
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Revenue and order performance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            Revenue
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <div className="flex h-72 items-end gap-3 sm:gap-6">
            {currentData.map((item) => {
              const height =
                (item.sales / maxSales) * 100;

              return (
                <div
                  key={item.label}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <div className="relative flex h-full w-full items-end justify-center">
                    <div
                      className="group relative w-full max-w-16 rounded-t-xl bg-neutral-900 transition-all hover:bg-neutral-700"
                      style={{
                        height: `${height}%`,
                      }}
                    >
                      <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                        ₹
                        {item.sales.toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-neutral-500">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales summary */}
        <div className="mt-8 grid gap-4 border-t border-neutral-100 pt-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-neutral-500">
              Revenue
            </p>

            <p className="mt-1 text-xl font-semibold">
              ₹{totalSales.toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">
              Orders
            </p>

            <p className="mt-1 text-xl font-semibold">
              {totalOrders.toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">
              Average Order Value
            </p>

            <p className="mt-1 text-xl font-semibold">
              ₹{averageOrderValue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </section>

      {/* Product + Category Analytics */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Top Products */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Top Products
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Best performing products.
              </p>
            </div>

            <Package
              size={20}
              className="text-neutral-400"
            />
          </div>

          <div className="mt-6 space-y-5">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-semibold">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {product.sales} units sold
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold">
                    ₹
                    {product.revenue.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Performance */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Category Performance
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Revenue by product category.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {categoryData.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {category.orders} orders
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ₹
                      {category.revenue.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {category.percentage}%
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900"
                    style={{
                      width: `${category.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Conversion Funnel */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Conversion Funnel
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Track customers from visiting your store to
            completing an order.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {funnelData.map((item, index) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold">
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-semibold">
                    {item.value.toLocaleString("en-IN")}
                  </span>

                  <span className="ml-2 text-xs text-neutral-500">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-900"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business Intelligence */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Business Intelligence
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Important insights detected from your store
            activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {alerts.map((alert) => (
            <InsightCard
              key={alert.title}
              type={alert.type}
              title={alert.title}
              description={alert.description}
            />
          ))}
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Store Performance
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Important ecommerce performance indicators.
          </p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Conversion Rate"
            value="7.4%"
            change="+1.2%"
            positive
          />

          <Metric
            label="Cart Abandonment"
            value="39.8%"
            change="-4.3%"
            positive
          />

          <Metric
            label="Repeat Customers"
            value="28.6%"
            change="+5.8%"
            positive
          />

          <Metric
            label="Return Rate"
            value="4.2%"
            change="-0.8%"
            positive
          />
        </div>
      </section>
    </div>
  );
}

/* Analytics Card */

function AnalyticsCard({
  title,
  value,
  change,
  positive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
          {icon}
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            positive
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}

          {change}
        </div>
      </div>

      <p className="mt-5 text-sm text-neutral-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-semibold text-neutral-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-neutral-400">
        Compared with previous period
      </p>
    </div>
  );
}

/* Insight Card */

function InsightCard({
  type,
  title,
  description,
}: {
  type: "warning" | "success" | "danger" | "info";
  title: string;
  description: string;
}) {
  const styles = {
    warning: {
      container: "border-yellow-200 bg-yellow-50",
      icon: "bg-yellow-100 text-yellow-700",
    },

    success: {
      container: "border-green-200 bg-green-50",
      icon: "bg-green-100 text-green-700",
    },

    danger: {
      container: "border-red-200 bg-red-50",
      icon: "bg-red-100 text-red-700",
    },

    info: {
      container: "border-blue-200 bg-blue-50",
      icon: "bg-blue-100 text-blue-700",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`rounded-2xl border p-5 ${style.container}`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.icon}`}
      >
        {type === "success" ? (
          <TrendingUp size={18} />
        ) : type === "danger" ? (
          <TrendingDown size={18} />
        ) : type === "warning" ? (
          <Package size={18} />
        ) : (
          <IndianRupee size={18} />
        )}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-neutral-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        {description}
      </p>
    </div>
  );
}

/* Metric */

function Metric({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="border-b border-neutral-100 pb-5 sm:border-b-0 sm:border-r sm:pr-6 last:border-0">
      <p className="text-sm text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-neutral-900">
        {value}
      </p>

      <div
        className={`mt-2 flex items-center gap-1 text-xs font-medium ${
          positive
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {positive ? (
          <ArrowUpRight size={14} />
        ) : (
          <ArrowDownRight size={14} />
        )}

        {change} from previous period
      </div>
    </div>
  );
}