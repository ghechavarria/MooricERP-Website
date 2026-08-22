import { motion } from "framer-motion";
import { LosCompatibilityStrip } from "./LosCompatibilityStrip";

function IconProspect() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4.5 19c.6-3.2 2.4-5 4.5-5s3.9 1.8 4.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M16 8h5M18.5 5.5v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconSetup() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 14.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M12 4v11M8.5 11.5 12 15l3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconProcessing() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M9.62 6.11 10.37 2.29h3.26l.75 3.82 1.53.89 3.69-1.27 1.63 2.82-2.94 2.57v1.76l2.94 2.57-1.63 2.82-3.69-1.27-1.53.89-.75 3.82h-3.26l-.75-3.82-1.53-.89-3.69 1.27-1.63-2.82 2.94-2.57v-1.76L2.77 8.55 4.4 5.73 8.09 7l1.53-.89z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClosed() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 12.2 10.7 15 16.2 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const stages = [
  {
    name: "Prospect",
    line: "Every lead and conversation logged, ready to become a file.",
    Icon: IconProspect,
  },
  {
    name: "Application & Setup",
    line: "Upload borrower docs — AI completes the 1003, you review side by side.",
    Icon: IconSetup,
  },
  {
    name: "Processing",
    line: "Conditions, TRID deadlines, title, HOI, appraisal — tracked on one screen, updated as things come in.",
    Icon: IconProcessing,
  },
  {
    name: "Closed",
    line: "Clean handoff, full file history, audit-ready records.",
    Icon: IconClosed,
  },
] as const;

export function BrokerProcessFlowSection() {
  return (
    <section
      id="process"
      className="section-swiss relative scroll-mt-8 pb-0 pt-[clamp(3.5rem,2rem+3vw,5.5rem)] sm:pb-12"
      aria-labelledby="process-heading"
    >
      <div className="layout-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-[13px] font-normal uppercase tracking-[0.2em] text-erp">End to end</p>
          <h2
            id="process-heading"
            className="mt-4 font-display text-[clamp(1.75rem,1.2rem+1.8vw,3rem)] font-bold tracking-tight text-ink-950 text-balance"
          >
            One workspace for the entire broker-side process.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-organ-800">
            From first conversation to closed loan — one system, connected stages, not a pile of
            separate tools.
          </p>
        </motion.div>

        <ol className="swiss-rail mt-8 m-0 list-none p-0 sm:mt-16">
          {stages.map((stage, i) => (
            <motion.li
              key={stage.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="swiss-col"
            >
              <div className="flex items-center gap-4 lg:block">
                <p className="swiss-num" aria-hidden>
                  <stage.Icon />
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="m-0 font-mono text-[13px] font-normal uppercase tracking-[0.16em] text-erp lg:mt-6">
                  {stage.name}
                </h3>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-organ-800 lg:mt-3">{stage.line}</p>
            </motion.li>
          ))}
        </ol>
        <LosCompatibilityStrip />
      </div>
    </section>
  );
}
