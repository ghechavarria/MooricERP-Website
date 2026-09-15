import { motion } from "framer-motion";

const painPoints = [
  {
    stat: "3×",
    body: "the same borrower data re-typed into intake, the 1003, and the LOS",
  },
  {
    stat: "17",
    body: "emails to clear one condition, with no single place that says where it stands",
  },
  {
    stat: "5+",
    body: "tools that don't talk — spreadsheet, folders, calendar, notes, email. You are the integration",
  },
  {
    stat: "9",
    unit: "PM",
    body: "when you find out a lock expired or a CD date slipped — hard dates don't remind themselves",
  },
] as const;

export function ProblemSection() {
  return (
    <section id="problem" className="v4-section" aria-labelledby="problem-heading">
      <div className="layout-shell">
        <div className="v4-rail">
          <div className="v4-split--stack">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45 }}
            >
              <p className="v4-kicker">The overhead</p>
              <h2 id="problem-heading" className="v4-h2" style={{ maxWidth: "18em" }}>
                Where Does Your Time Go?
              </h2>
            </motion.div>
            <motion.p
              className="m-0 max-w-[32em] text-[17px] leading-[1.65] text-[#48566b] text-pretty"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.06 }}
            >
              It&apos;s not the borrowers, the guidelines, or the deals. It&apos;s the overhead
              between them — the same file handled five different ways, in five different places.
            </motion.p>
          </div>
          <div className="v4-cols-4 mt-[52px]">
            {painPoints.map((item, i) => (
              <motion.article
                key={item.stat}
                className="v4-card px-[26px] py-7"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <p className="m-0 text-[38px] font-bold leading-none tracking-[-0.04em] text-erp">
                  {item.stat}
                  {"unit" in item ? (
                    <span className="text-[0.5em]">{item.unit}</span>
                  ) : null}
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-[#48566b]">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
