// Writes dist/_headers with the Content-Security-Policy-Report-Only header.
//
// The policy depends on environment values (ERP API origin, Firebase auth
// domain), which netlify.toml cannot read, so it is generated at build time.
// Static headers (HSTS, nosniff, Referrer-Policy, frame protection) live in
// netlify.toml. Run after `vite build` (see the build script in package.json).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";

// Vendor hosts (fixed by the vendors, not environment URLs).
const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FILES = "https://fonts.gstatic.com";
const FIREBASE_AUTH_API = ["https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com"];
const TURNSTILE = "https://challenges.cloudflare.com";
// The homepage video: YouTube's privacy-enhanced player, and its thumbnail
// (shown until someone presses play, so nothing loads from YouTube before then).
const YOUTUBE_PLAYER = "https://www.youtube-nocookie.com";
const YOUTUBE_THUMBS = "https://i.ytimg.com";

/** Origin (scheme + host + port) of an https URL, or "" when blank/invalid/not https. */
export const httpsOrigin = (raw) => {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.origin : "";
  } catch {
    return "";
  }
};

/** The Firebase auth domain is usually a bare hostname ("proj.firebaseapp.com"). */
export const authDomainOrigin = (raw) => {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return "";
  return httpsOrigin(value.includes("://") ? value : `https://${value}`);
};

// The exact string only, the same rule as readSignupConfig in src/config/signup.ts.
export const signupEnabled = (env) => env.VITE_SIGNUP_ENABLED === "true";

const unique = (items) => [...new Set(items.filter(Boolean))];

export const buildCsp = (env = {}) => {
  const enabled = signupEnabled(env);
  const erpApi = enabled ? httpsOrigin(env.VITE_ERP_API_URL) : "";
  const authDomain = enabled ? authDomainOrigin(env.VITE_FIREBASE_AUTH_DOMAIN) : "";

  const directives = {
    "default-src": ["'self'"],
    "script-src": ["'self'", ...(enabled ? [TURNSTILE] : [])],
    // framer-motion and React style props set inline styles; Google Fonts CSS.
    "style-src": ["'self'", "'unsafe-inline'", GOOGLE_FONTS_CSS],
    "font-src": ["'self'", GOOGLE_FONTS_FILES],
    "img-src": ["'self'", "data:", YOUTUBE_THUMBS],
    "media-src": ["'self'"],
    "connect-src": ["'self'", ...(enabled ? [erpApi, ...FIREBASE_AUTH_API, authDomain] : [])],
    "frame-src": [YOUTUBE_PLAYER, ...(enabled ? ["'self'", TURNSTILE, authDomain] : [])],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  return Object.entries(directives)
    .map(([name, values]) => `${name} ${unique(values).join(" ")}`)
    .join("; ");
};

export const buildHeadersFile = (env = {}) => `/*\n  Content-Security-Policy-Report-Only: ${buildCsp(env)}\n`;

const main = () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  // loadEnv merges .env files with process.env (the Netlify build environment).
  const env = loadEnv(process.env.MODE || "production", root, "VITE_");
  if (signupEnabled(env)) {
    if (!httpsOrigin(env.VITE_ERP_API_URL)) {
      console.warn("write-headers: signup is on but VITE_ERP_API_URL is blank or not https; connect-src omits it.");
    }
    if (!authDomainOrigin(env.VITE_FIREBASE_AUTH_DOMAIN)) {
      console.warn("write-headers: signup is on but VITE_FIREBASE_AUTH_DOMAIN is blank; it is omitted.");
    }
  }
  const out = resolve(root, "dist", "_headers");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buildHeadersFile(env));
  console.log(`write-headers: wrote ${out} (signup ${signupEnabled(env) ? "on" : "off"})`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
