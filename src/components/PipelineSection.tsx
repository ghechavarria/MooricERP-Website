import { motion } from "framer-motion";

const stages = [
  { label: "Prospect", count: "6", active: true },
  { label: "Origination", count: "4", active: true },
  { label: "Disclosures & lock", count: "3", active: true },
  { label: "Processing", count: "5", active: true },
  { label: "Closing & funding", count: "2", active: false },
] as const;

const milestones = [
  { label: "File created", date: "Jul 8", state: "done" },
  { label: "Initial LE issued", date: "Jul 11", state: "done" },
  { label: "Conditional approval", date: "Jul 29", state: "done" },
  { label: "Initial CD", date: "In progress", state: "now" },
  { label: "Clear to close", date: "—", state: "todo" },
] as const;

const countdowns = [
  { label: "Rate lock expires", value: "in 3 days", tone: "danger" },
  { label: "Initial CD required by", value: "Aug 21", tone: "warn" },
  { label: "Clear to close target", value: "Aug 26", tone: "muted" },
  { label: "Target closing", value: "Aug 29", tone: "muted" },
] as const;

export function PipelineSection() {
  return (
    <section id="pipeline" className="v4-pipeline" aria-labelledby="pipeline-heading">
      <div className="layout-shell">
        <div className="v4-rail">
          <div className="v4-split--stack">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45 }}
            >
              <p className="v4-kicker">Pipeline &amp; hard dates</p>
              <h2 id="pipeline-heading" className="v4-h2" style={{ maxWidth: "18em" }}>
                Critical Dates Tracked. Closings Protected.
              </h2>
            </motion.div>
            <motion.p
              className="m-0 max-w-[32em] text-[17px] leading-[1.65] text-[#48566b] text-pretty"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.06 }}
            >
              Your pipeline shouldn&apos;t be a spreadsheet you update by hand — and the deadlines that
              actually matter shouldn&apos;t live in your head. Every file sits in a stage, every stage
              has milestones, every hard date has a countdown.
            </motion.p>
          </div>

          <motion.div
            className="mt-[52px] rounded-3xl border border-[#e4ebf4] bg-white px-9 py-[34px] shadow-[0_30px_60px_-44px_rgb(10_22_45_/_0.34)] max-[719px]:px-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="v4-cols-5">
              {stages.map((stage) => (
                <div
                  key={stage.label}
                  className={`pt-4 ${stage.active ? "border-t-[3px] border-erp" : "border-t-[3px] border-[#dbe3ee]"}`}
                >
                  <p
                    className={`m-0 font-mono text-[10px] uppercase tracking-[0.14em] ${stage.active ? "text-[#0060d6]" : "text-[#5c6b80]"}`}
                  >
                    {stage.label}
                  </p>
                  <p className="mt-[9px] text-[21px] font-bold leading-none text-[#0a0e14]">{stage.count}</p>
                </div>
              ))}
            </div>

            <div className="v4-cols-2 mt-[38px] gap-9 border-t border-[#eef2f8] pt-8">
              <div>
                <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#5c6b80]">
                  Milestones on this file
                </p>
                <ul className="m-0 list-none p-0">
                  {milestones.map((item) => (
                    <li
                      key={item.label}
                      className={`flex items-center gap-[13px] py-[11px] ${item.state === "todo" ? "" : "border-b border-[#eef2f8]"}`}
                    >
                      <span
                        className={`grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full text-[10px] ${
                          item.state === "done"
                            ? "bg-[#e6f8ee] text-[#15803d]"
                            : item.state === "now"
                              ? "bg-[#eaf2ff] text-[#0060d6]"
                              : "bg-[#f1f4f9] text-[#a3aec0]"
                        }`}
                      >
                        {item.state === "done" ? "✓" : item.state === "now" ? "→" : "·"}
                      </span>
                      <span
                        className={`min-w-0 flex-1 text-[14.5px] ${
                          item.state === "now"
                            ? "font-semibold text-[#0a0e14]"
                            : item.state === "todo"
                              ? "text-[#55637a]"
                              : "text-[#2b3648]"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`shrink-0 font-mono text-xs ${
                          item.state === "now"
                            ? "text-[#0060d6]"
                            : item.state === "todo"
                              ? "text-[#a3aec0]"
                              : "text-[#5c6b80]"
                        }`}
                      >
                        {item.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#5c6b80]">
                  Countdown
                </p>
                <div className="flex flex-col gap-[11px]">
                  {countdowns.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between gap-3.5 rounded-[14px] px-[18px] py-[15px] ${
                        item.tone === "danger"
                          ? "border border-[#f4d3cf] bg-[#fdf4f3]"
                          : item.tone === "warn"
                            ? "border border-[#f6e2c4] bg-[#fffaf1]"
                            : "border border-[#e4ebf4] bg-[#f8fafd]"
                      }`}
                    >
                      <span
                        className={`text-[14.5px] font-semibold ${item.tone === "muted" ? "text-[#2b3648]" : "text-[#0a0e14]"}`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`shrink-0 font-mono text-[12.5px] ${
                          item.tone === "danger"
                            ? "text-[#c0392b]"
                            : item.tone === "warn"
                              ? "text-[#b45309]"
                              : "text-[#55637a]"
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <p className="mt-8 max-w-[52em] text-base leading-[1.7] text-[#55637a] text-pretty">
            The daily summary opens on whatever needs you today — the overdue condition, the lock about
            to expire, the file that hasn&apos;t moved in a week.
          </p>
        </div>
      </div>
    </section>
  );
}
