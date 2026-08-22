import { motion } from "framer-motion";

function IconVolume() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 18V10M10 18V6M16 18v-8M20 18H3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconLoanSize() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDays() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 3h11v3.2L12 12l5.5 5.8V21h-11v-3.2L12 12 6.5 6.2V3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const productionStats = [
  { label: "Volume", value: "12 loans", Icon: IconVolume },
  { label: "Avg. loan size", value: "$385K", Icon: IconLoanSize },
  { label: "Avg. days to close", value: "32", Icon: IconDays },
] as const;

/** Sits directly under the hero’s blue moving ticker strip */
export function ProductionGlanceSection() {
  return (
    <section
      id="production-glance"
      className="section-neu relative text-ink-950"
      aria-label="Your production at a glance"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="layout-shell relative z-10 grid items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.9fr)] lg:gap-16"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[13px] font-normal uppercase tracking-[0.22em] text-erp">
            Your production at a glance
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-ink-950 text-balance">
            Closed loan performance, without building a spreadsheet
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-organ-800 sm:text-lg">
            Volume, average loan size, and time to close — broken down by month, quarter, or year.
            The numbers you need to understand your own book, already in the platform.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {productionStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.06 }}
              className="neu-pad neu-pad--press px-6 py-5 sm:px-7"
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 text-erp">
                  <stat.Icon />
                </span>
                <div>
                  <p className="font-mono text-[12px] font-normal uppercase tracking-[0.18em] text-organ-700">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold tabular-nums tracking-tight text-ink-950 sm:text-4xl">
                    <span className="text-erp">{stat.value}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
