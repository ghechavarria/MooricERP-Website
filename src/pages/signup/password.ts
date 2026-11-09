/**
 * Password rules for new accounts. Firebase's password policy should be set to the
 * same rules (minimum length 12; upper case, lower case, number and symbol
 * required) so the server enforces them too; see docs/signup-pages.md.
 */
export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

export type PasswordRule = { id: string; label: string; ok: (password: string, email: string) => boolean };

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: `At least ${PASSWORD_MIN} characters`, ok: (p) => p.length >= PASSWORD_MIN },
  { id: "upper", label: "An upper-case letter", ok: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "A lower-case letter", ok: (p) => /[a-z]/.test(p) },
  { id: "number", label: "A number", ok: (p) => /[0-9]/.test(p) },
  { id: "symbol", label: "A symbol, such as ! @ # or -", ok: (p) => /[^A-Za-z0-9]/.test(p) },
  {
    id: "email",
    label: "Doesn't contain your email name",
    ok: (p, email) => {
      const name = email.trim().toLowerCase().split("@")[0] ?? "";
      return name.length < 3 || !p.toLowerCase().includes(name);
    },
  },
];

/** The first unmet rule as an error message, or "" when the password is acceptable. */
export const passwordProblem = (password: string, email: string): string => {
  if (password.length > PASSWORD_MAX) return `Use no more than ${PASSWORD_MAX} characters.`;
  const failed = PASSWORD_RULES.find((rule) => !rule.ok(password, email));
  return failed ? `Your password needs: ${failed.label.charAt(0).toLowerCase()}${failed.label.slice(1)}.` : "";
};
