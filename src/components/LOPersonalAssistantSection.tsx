import { motion } from "framer-motion";

function IconAsk() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12a8 8 0 1 1-3.2-6.4M21 4v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconNotes() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconReminders() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 9a2.2 2.2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWorkspace() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const capabilities = [
  {
    title: "Ask anything about a file",
    body: "Income, conditions, timeline, borrower notes — no re-explaining the file every time.",
    Icon: IconAsk,
  },
  {
    title: "Add notes on the go",
    body: "A borrower detail, a conversation, a next step — attached to the file, not scattered across apps.",
    Icon: IconNotes,
  },
  {
    title: "Set reminders in place",
    body: "Follow up with a borrower, check a condition, confirm an appraisal — reminders live where the loan lives.",
    Icon: IconReminders,
  },
  {
    title: "Stay in one place",
    body: "No context-switching between the file, a notes app, a calendar, and an email thread.",
    Icon: IconWorkspace,
  },
] as const;

export function LOPersonalAssistantSection() {
  return (
    <section id="assistant" className="v4-section" aria-labelledby="assistant-heading">
      <div className="layout-shell">
        <div className="v4-rail text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="v4-kicker">Loan officer personal assistant</p>
            <h2 id="assistant-heading" className="v4-h2 mx-auto" style={{ maxWidth: "20em" }}>
              An Assistant That Knows Every File
            </h2>
            <p className="v4-lead mx-auto" style={{ maxWidth: "44em" }}>
              Not a chatbot. Not a help center. A work partner in the same workspace as the loan, with
              full context from the moment you open it.
            </p>
          </motion.div>
          <div className="v4-cols-4 mt-[52px] text-left">
            {capabilities.map((item, i) => (
              <motion.article
                key={item.title}
                className="v4-card--white rounded-[18px] border border-[#e4ebf4] px-[26px] py-7"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="v4-icon h-[38px] w-[38px]">
                  <item.Icon />
                </span>
                <h3 className="mb-[9px] mt-4 text-base font-semibold text-[#0a0e14]">{item.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-[#55637a]">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
