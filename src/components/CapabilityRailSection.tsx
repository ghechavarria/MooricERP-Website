import { motion } from "framer-motion";

function IconApplication() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconIncome() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20V10M10 20V4M16 20v-7M22 20H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconConditions() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1.5 8.5 2 2 3.5-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPipeline() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6h14v14H5zM5 10h14M9 3v4M15 3v4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

const capabilities = [
  {
    href: "#intake",
    title: "Application & intake",
    body: "Borrower portal, 1003 filled from documents, gaps flagged early",
    Icon: IconApplication,
  },
  {
    href: "#income",
    title: "Income & program fit",
    body: "A qualifying number you can stand behind, matched to real programs",
    Icon: IconIncome,
  },
  {
    href: "#conditions",
    title: "Conditions & follow-up",
    body: "Six categories, one board, the chase history on every item",
    Icon: IconConditions,
  },
  {
    href: "#pipeline",
    title: "Pipeline & hard dates",
    body: "Stages, milestones, and the deadlines that can kill a closing",
    Icon: IconPipeline,
  },
] as const;

export function CapabilityRailSection() {
  return (
    <section id="capabilities" className="v4-section v4-section--tight" aria-labelledby="capabilities-heading">
      <div className="layout-shell">
        <div className="v4-rail">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="v4-kicker">Capabilities</p>
            <h2 id="capabilities-heading" className="v4-h2">
              One Workspace, Four Features that Give you Time Back.
            </h2>
          </motion.div>
          <div className="v4-cols-4 mt-11">
            {capabilities.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="v4-lift v4-card--white flex flex-col gap-3 rounded-[18px] border border-[#e4ebf4] px-6 py-[26px] text-[#0a0e14]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="v4-icon">
                  <item.Icon />
                </span>
                <span className="text-[16.5px] font-semibold">{item.title}</span>
                <span className="text-sm leading-relaxed text-[#55637a]">{item.body}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
