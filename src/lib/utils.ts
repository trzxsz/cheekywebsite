import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price (amount + currency code) using Intl. */
export function formatPrice(
  amount: number | string,
  currencyCode = "PLN",
  locale = "pl-PL",
) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

/** Percentage discount between a compare-at and current price. */
export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
