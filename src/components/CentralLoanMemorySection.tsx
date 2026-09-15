import { motion } from "framer-motion";

export function CentralLoanMemorySection() {
  return (
    <section id="memory" className="v4-section" aria-labelledby="memory-heading">
      <div className="layout-shell">
        <div className="v4-rail v4-split">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="v4-kicker">Central Loan Memory</p>
            <h2 id="memory-heading" className="v4-h2-sm" style={{ maxWidth: "none" }}>
              Everything Connected and Tracked.
            </h2>
            <p className="v4-lead">
              Intake, income, conditions, dates — Mooric holds the whole file in mind. That is what makes
              every capability above work, and it is why the audit trail writes itself: every document,
              extracted field, and status change is already logged with a timestamp and a source.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-[#e4ebf4] bg-[#f8fafd] px-4 py-2 text-[13px] text-[#48566b]">
                Timestamped changes
              </span>
              <span className="rounded-full border border-[#e4ebf4] bg-[#f8fafd] px-4 py-2 text-[13px] text-[#48566b]">
                Source on every field
              </span>
              <span className="rounded-full border border-[#e4ebf4] bg-[#f8fafd] px-4 py-2 text-[13px] text-[#48566b]">
                QM status tracked
              </span>
              <span className="rounded-full border border-[#e4ebf4] bg-[#f8fafd] px-4 py-2 text-[13px] text-[#48566b]">
                Disclosure timing
              </span>
            </div>
          </motion.div>

          <div className="v4-cols-2 gap-5">
            <motion.div
              className="flex flex-col overflow-hidden rounded-[22px] border border-[#e4ebf4] bg-[#f8fafd]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="flex-1 px-[26px] py-7">
                <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#5c6b80]">
                  Without memory
                </p>
                <h3 className="mb-2.5 mt-3.5 text-lg font-semibold leading-snug text-[#0a0e14]">
                  Each step is a separate task
                </h3>
                <p className="mb-5 mt-0 text-sm leading-[1.68] text-[#55637a] text-pretty">
                  Upload, check a box, move on. The system forgets what it already learned — and the last
                  document wins.
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="rounded-[11px] border border-dashed border-[#cfd9e6] bg-white px-[15px] py-[13px]">
                    <p className="m-0 text-[13.5px] font-semibold text-[#48566b]">Intake</p>
                    <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#55637a]">
                      Context resets
                    </p>
                  </div>
                  <div className="rounded-[11px] border border-dashed border-[#cfd9e6] bg-white px-[15px] py-[13px]">
                    <p className="m-0 text-[13.5px] font-semibold text-[#48566b]">Conditions</p>
                    <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#55637a]">
                      Context resets
                    </p>
                  </div>
                  <div className="rounded-[11px] border border-dashed border-[#cfd9e6] bg-white px-[15px] py-[13px]">
                    <p className="m-0 text-[13.5px] font-semibold text-[#48566b]">Closing</p>
                    <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#55637a]">
                      Context resets
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-[#efe0de] bg-[#fdf6f5] px-[26px] py-5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fbe3e0] text-[13px] text-[#c0392b]">
                  ✕
                </span>
                <p className="m-0 text-[13.5px] font-semibold leading-snug text-[#a8342a]">
                  Borrower context — lost
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col overflow-hidden rounded-[22px] border border-[#cfe0fb] bg-white shadow-[0_30px_60px_-40px_rgb(0_117_255_/_0.5)]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <div className="flex-1 px-[26px] py-7">
                <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0060d6]">
                  With Mooric
                </p>
                <h3 className="mb-2.5 mt-3.5 text-lg font-semibold leading-snug text-[#0a0e14]">
                  One file, carried forward
                </h3>
                <p className="mb-5 mt-0 text-sm leading-[1.68] text-[#48566b] text-pretty">
                  Income complexity, credit story, property situation — retained as documents arrive, and
                  used at every later stage.
                </p>
                <div className="relative flex flex-col pl-[26px]">
                  <span className="absolute bottom-3.5 left-1.5 top-3.5 w-0.5 rounded-sm bg-gradient-to-b from-erp to-[#8ec0ff]" />
                  <div className="relative py-[13px] pb-[15px]">
                    <span className="absolute left-[-24px] top-[17px] h-2.5 w-2.5 rounded-full bg-erp shadow-[0_0_0_3px_#fff]" />
                    <p className="m-0 text-[13.5px] font-semibold text-[#0a0e14]">Intake</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-[#55637a]">
                      Still informs the income math and the conditions
                    </p>
                  </div>
                  <div className="relative py-[13px] pb-[15px]">
                    <span className="absolute left-[-24px] top-[17px] h-2.5 w-2.5 rounded-full bg-erp shadow-[0_0_0_3px_#fff]" />
                    <p className="m-0 text-[13.5px] font-semibold text-[#0a0e14]">Conditions</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-[#55637a]">
                      Cleared, outstanding, overdue — one view
                    </p>
                  </div>
                  <div className="relative pt-[13px]">
                    <span className="absolute left-[-24px] top-[17px] h-2.5 w-2.5 rounded-full bg-erp shadow-[0_0_0_3px_#fff]" />
                    <p className="m-0 text-[13.5px] font-semibold text-[#0a0e14]">Closing</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-[#55637a]">
                      TRID, title, HOI, appraisal in one place
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden border-t border-[#dfeafb] bg-[#eaf2ff] px-[26px] py-5">
                <svg
                  viewBox="0 0 400 90"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden
                >
                  <path
                    d="M-10 70 C80 70 100 20 190 20 C280 20 300 60 410 34"
                    fill="none"
                    stroke="rgba(0,117,255,.28)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    className="v4-flow"
                    d="M-10 70 C80 70 100 20 190 20 C280 20 300 60 410 34"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="26 400"
                  />
                </svg>
                <p className="relative m-0 flex items-center gap-[11px] text-[13.5px] font-semibold leading-snug text-[#0a2f6b]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-erp text-[13px] text-white">
                    ✓
                  </span>
                  Full borrower context — retained
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
