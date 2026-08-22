import { motion, useReducedMotion } from "framer-motion";

function BlueprintGround() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full text-accent/40" aria-hidden>
      <circle
        cx="50%"
        cy="50%"
        r="28%"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 10"
      />
      <circle
        cx="50%"
        cy="50%"
        r="46%"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="2 8"
      />
      <line x1="8%" y1="50%" x2="92%" y2="50%" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <rect x="6%" y="12%" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <rect
        x="calc(94% - 12px)"
        y="12%"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <rect
        x="6%"
        y="calc(88% - 12px)"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <rect
        x="calc(94% - 12px)"
        y="calc(88% - 12px)"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export function HeroMotionBand() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden border-y border-accent/50 bg-[#050A14]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_110%_85%_at_100%_-5%,rgba(45,165,200,0.7),rgba(30,110,145,0.4)_40%,transparent_68%),radial-gradient(ellipse_100%_90%_at_-5%_105%,rgba(50,95,185,0.65),rgba(28,60,130,0.38)_44%,transparent_70%),radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(8,20,45,0.3),transparent_70%)]"
        aria-hidden
      />

      <BlueprintGround />

      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent shadow-[0_0_24px_rgba(191,211,230,0.45)]"
          aria-hidden
          initial={{ top: "18%" }}
          animate={{ top: ["18%", "78%", "22%", "70%", "18%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          aria-hidden
        />
      )}

      <div className="layout-shell relative z-10 flex flex-col items-center py-36 text-center sm:py-48 lg:py-56">
        <div className="flex w-full flex-col items-center sm:w-[55%]">
        <motion.p
          className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-accent-light"
          initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
            <circle cx="12" cy="4.5" r="1.6" stroke="currentColor" strokeWidth="1.75" />
            <path d="M12 6.2 5.5 20.5M12 6.2 18.5 20.5M8.2 14.5h7.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          Mortgage pipeline
        </motion.p>

        <div className="relative mt-10 w-full">
          {!reduceMotion ? (
            <motion.span
              className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
              aria-hidden
              animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.96, 1.06, 0.96] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
          <motion.p
            className="relative z-10 bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_100%] bg-clip-text font-display text-3xl font-extrabold uppercase tracking-[0.12em] text-transparent sm:text-5xl sm:tracking-[0.18em] md:text-6xl md:tracking-[0.2em] lg:text-7xl lg:tracking-[0.22em] animate-shimmer-slow"
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Mooric ERP
          </motion.p>
        </div>

        <p className="relative z-10 mt-12 w-full text-sm leading-relaxed text-slate-200/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
          The entire broker-side process — pipeline, conditions, and closing deadlines — one
          workspace, built for how independent LOs and broker shops actually work.
        </p>
        </div>
      </div>
    </div>
  );
}
