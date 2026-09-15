import { motion } from "framer-motion";

function IntakeMock() {
  return (
    <figure className="v4-mock">
      <div className="v4-mock-panel">
        <div className="flex items-center justify-between gap-3">
          <p className="m-0 text-[14.5px] font-semibold text-[#0a0e14]">Grace Kim · purchase</p>
          <p className="m-0 font-mono text-[11.5px] text-[#0060d6]">72% complete</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8eef7]">
          <motion.span
            className="block h-full rounded-full bg-erp"
            initial={{ width: 0 }}
            whileInView={{ width: "72%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
          />
        </div>
        <ul className="mt-5 flex list-none flex-col gap-[11px] p-0">
          <li className="flex items-center gap-[11px] text-sm text-[#2b3648]">
            <span className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full bg-[#e6f8ee] text-[11px] text-[#15803d]">
              ✓
            </span>
            Paystubs · 2 uploaded
          </li>
          <li className="flex items-center gap-[11px] text-sm text-[#2b3648]">
            <span className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full bg-[#e6f8ee] text-[11px] text-[#15803d]">
              ✓
            </span>
            W-2 · 2024, 2025
          </li>
          <li className="flex items-center gap-[11px] text-sm text-[#55637a]">
            <span className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full bg-[#fff3e4] text-[11px] text-[#b45309]">
              •
            </span>
            Bank statements · awaiting borrower
          </li>
        </ul>
      </div>
      <div className="v4-cols-2 mt-4 gap-3.5">
        <div className="v4-mock-panel px-[22px] py-5">
          <p className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#5c6b80]">
            1003 fields
          </p>
          <div className="flex flex-col gap-[9px] text-[13px] text-[#2b3648]">
            <div className="flex items-center justify-between gap-2.5">
              Date of birth
              <span className="inline-flex items-center gap-1.5 text-[#15803d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                Filled
              </span>
            </div>
            <div className="flex items-center justify-between gap-2.5">
              Base income
              <span className="inline-flex items-center gap-1.5 text-[#15803d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                Filled
              </span>
            </div>
            <div className="flex items-center justify-between gap-2.5">
              Depository assets
              <span className="inline-flex items-center gap-1.5 text-[#15803d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                Filled
              </span>
            </div>
            <div className="flex items-center justify-between gap-2.5">
              Subject address
              <span className="inline-flex items-center gap-1.5 text-[#b45309]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
                Review
              </span>
            </div>
          </div>
        </div>
        <div className="v4-mock-panel px-[22px] py-5">
          <p className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#5c6b80]">
            Flagged gaps
          </p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li className="flex gap-2.5">
              <span className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] bg-[#fff3e4] text-[11px] text-[#b45309]">
                !
              </span>
              <div>
                <p className="m-0 text-[13px] font-semibold text-[#0a0e14]">Second job needs 2-yr history</p>
                <p className="mt-0.5 text-xs text-[#5c6b80]">Ask for 2024 W-2</p>
              </div>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] bg-[#fff3e4] text-[11px] text-[#b45309]">
                !
              </span>
              <div>
                <p className="m-0 text-[13px] font-semibold text-[#0a0e14]">Large deposit unsourced</p>
                <p className="mt-0.5 text-xs text-[#5c6b80]">$14,200 on Jul 12</p>
              </div>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] bg-[#eaf2ff] text-[11px] text-[#0a4fa8]">
                i
              </span>
              <div>
                <p className="m-0 text-[13px] font-semibold text-[#0a0e14]">Gift funds detected</p>
                <p className="mt-0.5 text-xs text-[#5c6b80]">Letter template ready</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </figure>
  );
}

function IncomeMock() {
  return (
    <figure className="v4-mock">
      <div className="v4-mock-panel px-7 py-[26px]">
        <p className="mb-[18px] font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#5c6b80]">
          Qualifying income · worksheet
        </p>
        <div className="flex items-center justify-between gap-4 border-b border-[#eef2f8] py-[11px]">
          <span className="text-[14.5px] text-[#2b3648]">Base pay from paystub</span>
          <span className="font-mono text-sm text-[#0a0e14]">$7,410</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#eef2f8] py-[11px]">
          <span className="text-[14.5px] text-[#2b3648]">Overtime · two-year average</span>
          <span className="font-mono text-sm text-[#0a0e14]">$862</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#eef2f8] py-[11px]">
          <span className="inline-flex items-center gap-[9px] text-[14.5px] text-[#2b3648]">
            W-2 cross-check
            <span className="rounded-full bg-[#e6f8ee] px-[9px] py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#15803d]">
              Match
            </span>
          </span>
          <span className="font-mono text-sm text-[#5c6b80]">±0.4%</span>
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-4 border-t-2 border-[#0a0e14] pt-4">
          <span className="text-[13.5px] font-semibold tracking-[0.02em] text-[#0a0e14]">
            Monthly qualifying
          </span>
          <span className="text-[28px] font-bold tracking-[-0.025em] text-erp">$8,272</span>
        </div>
      </div>
      <div className="v4-mock-panel mt-4 px-6 py-[22px]">
        <p className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#5c6b80]">
          Program fit
        </p>
        <div className="flex flex-col gap-[9px]">
          <div className="flex items-center justify-between gap-3.5 rounded-[10px] border-l-[3px] border-[#16a34a] bg-[#f8fafd] px-4 py-3">
            <span className="text-sm font-semibold text-[#0a0e14]">Conventional · 30 yr fixed</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#15803d]">Best fit</span>
          </div>
          <div className="flex items-center justify-between gap-3.5 rounded-[10px] border-l-[3px] border-[#16a34a] bg-[#f8fafd] px-4 py-3">
            <span className="text-sm font-semibold text-[#0a0e14]">FHA · 30 yr fixed</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#15803d]">Eligible</span>
          </div>
          <div className="flex items-center justify-between gap-3.5 rounded-[10px] border-l-[3px] border-[#d97706] bg-[#f8fafd] px-4 py-3">
            <span className="text-sm font-semibold text-[#0a0e14]">Bank statement</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#b45309]">Needs 12 mo</span>
          </div>
          <div className="flex items-center justify-between gap-3.5 rounded-[10px] border-l-[3px] border-[#cbd5e1] bg-[#f8fafd] px-4 py-3">
            <span className="text-sm font-semibold text-[#5c6b80]">DSCR</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#5c6b80]">Not applicable</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

function ConditionsMock() {
  return (
    <figure className="v4-mock">
      <div className="v4-cols-3 gap-3">
        <div className="rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5c6b80]">Income</p>
          <p className="mt-2 text-[23px] font-bold leading-none text-[#0a0e14]">4</p>
          <p className="mt-1.5 text-xs text-[#15803d]">3 cleared</p>
        </div>
        <div className="rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5c6b80]">Asset</p>
          <p className="mt-2 text-[23px] font-bold leading-none text-[#0a0e14]">3</p>
          <p className="mt-1.5 text-xs text-[#15803d]">3 cleared</p>
        </div>
        <div className="rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5c6b80]">Credit</p>
          <p className="mt-2 text-[23px] font-bold leading-none text-[#0a0e14]">2</p>
          <p className="mt-1.5 text-xs text-[#15803d]">2 cleared</p>
        </div>
        <div className="rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5c6b80]">Property</p>
          <p className="mt-2 text-[23px] font-bold leading-none text-[#0a0e14]">5</p>
          <p className="mt-1.5 text-xs text-[#b45309]">2 open</p>
        </div>
        <div className="rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5c6b80]">Disclosure</p>
          <p className="mt-2 text-[23px] font-bold leading-none text-[#0a0e14]">3</p>
          <p className="mt-1.5 text-xs text-[#15803d]">3 cleared</p>
        </div>
        <div className="rounded-[14px] bg-[#eaf2ff] px-[18px] py-4 shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0a4fa8]">Underwriting</p>
          <p className="mt-2 text-[23px] font-bold leading-none text-[#0a0e14]">2</p>
          <p className="mt-1.5 text-xs text-[#c0392b]">1 overdue</p>
        </div>
      </div>
      <ul className="mt-4 flex list-none flex-col gap-[11px] p-0">
        <li className="v4-condition-row grid grid-cols-[auto_1fr_auto] items-center gap-[13px] rounded-[14px] border-l-[3px] border-[#c0392b] bg-white px-[18px] py-[15px] shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <span className="grid h-[21px] w-[21px] place-items-center rounded-full bg-[#fdeceb] text-[11px] text-[#c0392b]">
            !
          </span>
          <div>
            <p className="m-0 text-sm font-semibold text-[#0a0e14]">Appraisal report — reconciliation page</p>
            <p className="mt-[3px] text-[12.5px] text-[#5c6b80]">Clear Point AMC · chased 2 days ago</p>
          </div>
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[#c0392b]">
            Overdue
          </span>
        </li>
        <li className="v4-condition-row grid grid-cols-[auto_1fr_auto] items-center gap-[13px] rounded-[14px] border-l-[3px] border-[#d97706] bg-white px-[18px] py-[15px] shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <span className="grid h-[21px] w-[21px] place-items-center rounded-full bg-[#fff3e4] text-[11px] text-[#b45309]">
            •
          </span>
          <div>
            <p className="m-0 text-sm font-semibold text-[#0a0e14]">HOI binder &amp; flood cert</p>
            <p className="mt-[3px] text-[12.5px] text-[#5c6b80]">Sunshore Insurance · reminder set for Thu</p>
          </div>
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[#b45309]">
            Open
          </span>
        </li>
        <li className="v4-condition-row grid grid-cols-[auto_1fr_auto] items-center gap-[13px] rounded-[14px] border-l-[3px] border-[#16a34a] bg-white px-[18px] py-[15px] shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <span className="grid h-[21px] w-[21px] place-items-center rounded-full bg-[#e6f8ee] text-[11px] text-[#15803d]">
            ✓
          </span>
          <div>
            <p className="m-0 text-sm font-semibold text-[#48566b]">Title commitment &amp; CPL</p>
            <p className="mt-[3px] text-[12.5px] text-[#5c6b80]">Coastal Title &amp; Escrow · cleared Aug 4</p>
          </div>
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[#15803d]">
            Cleared
          </span>
        </li>
        <li className="v4-condition-row grid grid-cols-[auto_1fr_auto] items-center gap-[13px] rounded-[14px] border-l-[3px] border-[#16a34a] bg-white px-[18px] py-[15px] shadow-[0_1px_3px_rgb(10_22_45_/_0.07)]">
          <span className="grid h-[21px] w-[21px] place-items-center rounded-full bg-[#e6f8ee] text-[11px] text-[#15803d]">
            ✓
          </span>
          <div>
            <p className="m-0 text-sm font-semibold text-[#48566b]">Letter of explanation — large deposit</p>
            <p className="mt-[3px] text-[12.5px] text-[#5c6b80]">Borrower · signed via portal</p>
          </div>
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[#15803d]">
            Cleared
          </span>
        </li>
      </ul>
    </figure>
  );
}

export function IntakeSection() {
  return (
    <section id="intake" className="v4-section" aria-labelledby="intake-heading">
      <div className="layout-shell">
        <div className="v4-rail v4-split">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="v4-kicker">Application &amp; intake</p>
            <h2 id="intake-heading" className="v4-h2-sm">
              From Documents to Application — Powered by AI.
            </h2>
            <p className="v4-lead">
              Getting a complete file usually takes three rounds of email, and everything that arrives
              gets keyed in by hand. Send one secure link instead: the borrower uploads, Mooric reads
              what came in and fills the 1003 from it, and the gaps get flagged while they&apos;re still
              paying attention.
            </p>
            <ul className="mt-[30px] flex list-none flex-col gap-3.5 p-0">
              <li className="v4-bullet">A portal the borrower actually finishes — with their own progress bar</li>
              <li className="v4-bullet">1003 fields written from the documents, reviewed side by side</li>
              <li className="v4-bullet">Missing items surfaced before underwriting has to ask</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            <IntakeMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function IncomeSection() {
  return (
    <section id="income" className="v4-section" aria-labelledby="income-heading">
      <div className="layout-shell">
        <div className="v4-rail v4-split--flip">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <IncomeMock />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            <p className="v4-kicker">Income &amp; program fit</p>
            <h2 id="income-heading" className="v4-h2-sm">
              Get Income Right the First Time.
            </h2>
            <p className="v4-lead">
              Income is where deals die. Get the number wrong and you find out in underwriting — after
              you&apos;ve already told the borrower what they qualify for. Mooric works it out from the
              documents on file and shows every line, so you can check it in seconds instead of rebuilding
              it in a spreadsheet.
            </p>
            <ul className="mt-[30px] flex list-none flex-col gap-3.5 p-0">
              <li className="v4-bullet">
                Salaried, hourly, self-employed, bank statement, rental — the math the file calls for
              </li>
              <li className="v4-bullet">Every line shown, with the document it came from</li>
              <li className="v4-bullet">Programs the borrower fits — and the ones they don&apos;t, with the reason</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ConditionsSection() {
  return (
    <section id="conditions" className="v4-section" aria-labelledby="conditions-heading">
      <div className="layout-shell">
        <div className="v4-rail v4-split">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="v4-kicker">Conditions &amp; follow-up</p>
            <h2 id="conditions-heading" className="v4-h2-sm">
              See Your Files at a Glance.
            </h2>
            <p className="v4-lead">
              Today that answer lives across email threads, phone calls, and memory. In Mooric, every
              underwriting condition is filed under one of six categories with its status, its owner, and
              the chase history attached — so nothing has to be reconstructed from your inbox.
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-[9px] text-[14.5px] text-[#2b3648]">
                <span className="h-[9px] w-[9px] rounded-full bg-[#16a34a]" />
                Cleared 14
              </span>
              <span className="inline-flex items-center gap-[9px] text-[14.5px] text-[#2b3648]">
                <span className="h-[9px] w-[9px] rounded-full bg-[#d97706]" />
                Outstanding 4
              </span>
              <span className="inline-flex items-center gap-[9px] text-[14.5px] text-[#2b3648]">
                <span className="h-[9px] w-[9px] rounded-full bg-[#c0392b]" />
                Overdue 1
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            <ConditionsMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
