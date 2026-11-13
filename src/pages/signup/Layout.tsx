import type { ReactNode } from "react";

export const inputClass =
  "mt-1.5 block w-full rounded-md border border-[#cfd9e6] bg-white px-3.5 py-3 text-base text-[#0a0e14] " +
  "placeholder:text-[#8a97ab] focus:border-erp focus:outline-none focus:ring-2 focus:ring-erp/30 " +
  "aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-red-600/20";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-erp";

export const primaryButton = `v4-btn v4-btn--primary disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const ghostButton = `v4-btn v4-btn--ghost disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const linkClass = "font-semibold text-erp-600 underline underline-offset-2 hover:text-erp-700";

/**
 * Page frame shared by the signup pages: one rail, a kicker, an h1, an optional lead.
 * `centered` centres the heading block and the content column.
 */
export function PageShell({
  testId,
  kicker,
  title,
  lead,
  centered = false,
  children,
}: {
  testId: string;
  kicker: string;
  title: string;
  lead?: string;
  centered?: boolean;
  children?: ReactNode;
}) {
  return (
    <section data-testid={testId} className="layout-shell py-12 sm:py-16">
      <div className={`v4-rail min-w-0${centered ? " text-center" : ""}`}>
        <p className="v4-kicker">{kicker}</p>
        <h1 className={`v4-h2 break-words${centered ? " mx-auto" : ""}`}>{title}</h1>
        {lead ? <p className={`v4-lead${centered ? " mx-auto" : ""}`}>{lead}</p> : null}
        <div className={`mt-8 min-w-0 sm:mt-10${centered ? " text-left" : ""}`}>{children}</div>
      </div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-[#e4ebf4] bg-white p-5 shadow-card sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="m-0 rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-[15px] leading-6 text-red-900"
    >
      {children}
    </p>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="m-0 rounded-md border border-[#cfe0f7] bg-[#f4f9fc] px-3.5 py-3 text-[15px] leading-6 text-[#27456b]"
    >
      {children}
    </p>
  );
}

/** Shown when Firebase is not configured or the API says signup is off. */
export function NotAvailable() {
  return (
    <Card className="max-w-[34rem]">
      <h2 className="m-0 text-xl font-bold text-[#0a0e14]">Signup is not available right now</h2>
      <p className="mb-0 mt-3 text-[15px] leading-6 text-[#48566b]">
        Please check back soon. If you need help in the meantime, use Contact on this site.
      </p>
    </Card>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  error,
  hint,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "email";
  error?: string;
  hint?: string;
  maxLength?: number;
}) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold text-[#2b3648]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={inputClass}
      />
      {hint ? (
        <p id={`${id}-hint`} className="m-0 mt-1.5 text-[13px] leading-5 text-[#5b6a80]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="m-0 mt-1.5 text-[13px] font-medium leading-5 text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
