import { Link } from "react-router-dom";

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="6.5"
        width="18"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="m10 9.75 5 2.75-5 2.75z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#e4ebf4] bg-white">
      <div className="layout-shell flex flex-col items-center justify-between gap-8 py-[1.8rem] sm:flex-row">
        <Link
          to="/#top"
          className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl py-1 pl-1 pr-2"
        >
          <span
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px]"
            aria-hidden
          >
            <img
              src="/images/square-logo-blue.svg"
              alt=""
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
              decoding="async"
            />
          </span>
          <span className="pointer-events-none h-8 w-px shrink-0 bg-organ-200" aria-hidden />
          <span className="flex min-w-0 flex-col items-start gap-1">
            <span className="font-display text-[1.0625rem] font-extrabold uppercase leading-none tracking-[0.04em]">
              <span className="text-organ-950">Mooric </span>
              <span className="text-erp">ERP</span>
            </span>
            <span className="font-display text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-[#5c6b80]">
              Corporation
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2.5">
          <a
            href="https://www.linkedin.com/company/mooricerp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mooric ERP on LinkedIn"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfd8e3] text-[#5a6573] transition hover:border-erp hover:text-erp"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.youtube.com/@MooricERP"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mooric Corporation on YouTube"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfd8e3] text-[#5a6573] transition hover:border-erp hover:text-erp"
          >
            <YouTubeIcon />
          </a>
        </div>
        <p className="font-mono text-xs text-[#5c6b80]">© {new Date().getFullYear()} Mooric ERP</p>
      </div>
    </footer>
  );
}
