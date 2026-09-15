import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useContactModal } from "../context/ContactModalContext";
import { SHOW_CONTACT_ACTIONS } from "../config/contactActions";

const exploreLinks = [
  { label: "Capabilities", to: "/#capabilities" },
  { label: "Application & intake", to: "/#intake" },
  { label: "Income & program fit", to: "/#income" },
  { label: "Conditions & follow-up", to: "/#conditions" },
  { label: "Pipeline & hard dates", to: "/#pipeline" },
  { label: "Central Loan Memory", to: "/#memory" },
  { label: "Personal assistant", to: "/#assistant" },
];

function navTopLinks(pathname: string) {
  return [
    { label: "Pricing", to: "/#contact" },
    { label: "Team", to: "/team" },
    { label: "Contact", to: pathname === "/team" ? "/team#contact" : "/#contact" },
  ];
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M6 6l12 12M18 6L6 18"
        />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M5 7h14M5 12h14M5 17h14"
      />
    </svg>
  );
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 12 8"
      aria-hidden
      className={`shrink-0 transition-transform${open ? " rotate-180" : ""}`}
    >
      <path
        d="M1 1.5 6 6.5l5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const { openContactModal } = useContactModal();

  useEffect(() => {
    setExploreOpen(false);
    setMenuOpen(false);
    setMobileExploreOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && !exploreOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setExploreOpen(false);
        setMobileExploreOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, exploreOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1440px)");
    const onViewport = () => {
      if (mq.matches) {
        setMenuOpen(false);
        setMobileExploreOpen(false);
      } else {
        setExploreOpen(false);
      }
    };
    mq.addEventListener("change", onViewport);
    return () => mq.removeEventListener("change", onViewport);
  }, []);

  return (
    <>
    <header className="sticky inset-x-0 top-0 z-40 w-full max-w-none min-w-0 shrink-0 self-stretch border-b border-organ-200 bg-white">
      <div className="layout-header flex h-[4.25rem] items-center justify-between gap-3 min-[1440px]:gap-x-4 min-[1800px]:gap-x-6">
        <Link
          to="/#top"
          className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 sm:gap-3 sm:pr-3 min-[1440px]:gap-2.5 min-[1800px]:gap-3.5"
        >
          <span
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[10px] sm:h-10 sm:w-10 min-[1440px]:h-10 min-[1440px]:w-10 min-[1800px]:h-[2.75rem] min-[1800px]:w-[2.75rem]"
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
          <span
            className="pointer-events-none h-8 w-px shrink-0 bg-organ-200 min-[1440px]:h-8 min-[1800px]:h-9"
            aria-hidden
          />
          <span className="min-w-0 font-display text-[1.0625rem] font-extrabold uppercase leading-none tracking-[0.04em] sm:text-lg sm:tracking-[0.05em] min-[1440px]:text-base min-[1440px]:tracking-[0.04em] min-[1800px]:text-lg min-[1800px]:tracking-[0.06em]">
            <span className="text-organ-950">Mooric </span>
            <span className="text-erp">ERP</span>
          </span>
        </Link>

        <div className="hidden shrink-0 items-center gap-1.5 min-[1440px]:ml-6 min-[1440px]:flex min-[1800px]:ml-14 min-[1800px]:gap-3">
          <nav className="flex items-center gap-5 min-[1800px]:gap-7" aria-label="Primary">
            <span
              className="relative flex items-center"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                type="button"
                className="nav-link inline-flex items-center gap-1.5 border-0 bg-transparent p-0"
                aria-expanded={exploreOpen}
                aria-haspopup="true"
                onClick={() => {
                  if (window.matchMedia("(hover: none)").matches) {
                    setExploreOpen((o) => !o);
                    return;
                  }
                  setExploreOpen(true);
                }}
              >
                Explore
                <Chevron open={exploreOpen} />
              </button>
              <span
                className="explore-panel"
                style={{
                  display: exploreOpen ? "flex" : "none",
                  opacity: exploreOpen ? 1 : 0,
                  transform: exploreOpen ? "translateY(0)" : "translateY(-6px)",
                }}
              >
                {exploreLinks.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setExploreOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </span>
            </span>
            {navTopLinks(pathname).map((item) => (
              <Link key={item.label} to={item.to} className="nav-link" onClick={() => setExploreOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className={`btn-primary-silver ml-3 shrink-0 px-3 py-2 text-[13px] min-[1800px]:ml-4 min-[1800px]:px-4 min-[1800px]:py-2.5 min-[1800px]:text-sm${SHOW_CONTACT_ACTIONS ? "" : " hidden"}`}
            onClick={() => openContactModal("briefing")}
          >
            Book a demo
          </button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-md border border-organ-200 text-organ-900 transition hover:text-erp min-[1440px]:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

    </header>
    {menuOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] min-[1440px]:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <button
              type="button"
              className="absolute inset-0 z-0 bg-organ-950/45 backdrop-blur-[2px]"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <div
              id="mobile-nav-panel"
              className="absolute inset-y-0 right-0 z-10 flex w-[min(100%,20rem)] flex-col border-l border-organ-200 bg-white pl-4 pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.5rem,env(safe-area-inset-top))] shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-organ-200 pb-3 pr-1 pt-1">
                <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-organ-950">
                  Menu
                </span>
                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-md border border-organ-200 text-organ-900 transition hover:bg-organ-50"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <MenuIcon open />
                </button>
              </div>
              <nav
                className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                aria-label="Mobile"
              >
                <button
                  type="button"
                  className="flex items-center justify-between rounded-lg px-3 py-3.5 text-left text-[15px] font-medium text-[#3d4757]"
                  aria-expanded={mobileExploreOpen}
                  onClick={() => setMobileExploreOpen((o) => !o)}
                >
                  Explore
                  <Chevron open={mobileExploreOpen} />
                </button>
                {mobileExploreOpen
                  ? exploreLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-lg px-3 py-2.5 pl-6 text-[14.5px] font-medium text-[#3d4757] active:text-erp"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))
                  : null}
                {navTopLinks(pathname).map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-[#3d4757] active:text-erp"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className={`btn-primary-silver mt-3 w-full px-3 py-3.5 text-center text-base font-semibold${SHOW_CONTACT_ACTIONS ? "" : " hidden"}`}
                  onClick={() => {
                    setMenuOpen(false);
                    openContactModal("briefing");
                  }}
                >
                  Book a demo
                </button>
                <p
                  className={`mt-2 text-center text-xs text-organ-600${SHOW_CONTACT_ACTIONS ? "" : " hidden"}`}
                >
                  First month free
                </p>
              </nav>
            </div>
          </div>,
          document.body,
        )
      : null}
    </>
  );
}
