/** Formats whole cents as US dollars, dropping ".00" for whole amounts. */
export const formatMoney = (cents: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

/**
 * "December 5, 2026 (UTC)". Always UTC, matching the payment-failed email, so the
 * page and the email never show different days. Empty for a missing or bad date.
 */
export const formatDate = (iso: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })} (UTC)`;
};
