import { useState } from "react";
import { inputClass } from "./Layout";
import { PASSWORD_MAX, PASSWORD_RULES } from "./password";

/** New-password input with a show/hide toggle and a live checklist of the rules. */
export function PasswordField({
  value,
  onChange,
  email,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  email: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  const describedBy = ["reg-password-rules", error ? "reg-password-error" : ""].filter(Boolean).join(" ");
  return (
    <div className="min-w-0">
      <label htmlFor="reg-password" className="block text-sm font-semibold text-[#2b3648]">
        Password
      </label>
      <div className="relative">
        <input
          id="reg-password"
          name="reg-password"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          maxLength={PASSWORD_MAX}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${inputClass} pr-20`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-controls="reg-password"
          className="absolute right-1.5 top-1/2 mt-[3px] -translate-y-1/2 rounded px-2.5 py-1.5 text-[13px] font-semibold text-erp-600 hover:bg-[#f0f6ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-erp"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      <ul id="reg-password-rules" className="m-0 mt-2 grid list-none gap-1 p-0 sm:grid-cols-2" aria-label="Rules for your password">
        {PASSWORD_RULES.map((rule) => {
          const met = value.length > 0 && rule.ok(value, email);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-2 text-[13px] leading-5 ${met ? "text-emerald-700" : "text-[#5b6a80]"}`}
            >
              <span aria-hidden className="inline-flex w-3.5 justify-center font-bold">
                {met ? "✓" : "•"}
              </span>
              <span>
                {rule.label}
                <span className="sr-only">{met ? " (done)" : " (not yet)"}</span>
              </span>
            </li>
          );
        })}
      </ul>
      {error ? (
        <p id="reg-password-error" className="m-0 mt-1.5 text-[13px] font-medium leading-5 text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
