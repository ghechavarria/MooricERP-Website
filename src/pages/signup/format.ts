/** Formats whole cents as US dollars, dropping ".00" for whole amounts. */
export const formatMoney = (cents: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

/** Used when the ERP doesn't say which zone Stripe uses (older ERP, or no status yet). */
export const DEFAULT_TIMEZONE = "America/New_York";

const usableZone = (zone: string | null | undefined): string => {
  if (!zone) return DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return zone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
};

const parse = (iso: string | null | undefined): Date | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "Dec 9, 2026" in the given zone, for tight spaces such as a status pill. Blank when unusable. */
export const formatShortDate = (iso: string | null | undefined, zone?: string | null): string => {
  const date = parse(iso);
  if (!date) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: usableZone(zone) });
};

/**
 * "December 5, 2026 (EST)", in the time zone the Stripe account uses (the ERP
 * reports it), so the page agrees with Stripe and with the ERP's emails. Empty
 * for a missing or bad date.
 */
export const formatDate = (iso: string | null | undefined, zone?: string | null): string => {
  const date = parse(iso);
  if (!date) return "";
  const timeZone = usableZone(zone);
  const day = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone });
  const label =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "";
  return label ? `${day} (${label})` : day;
};
