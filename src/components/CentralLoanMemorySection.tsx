import { motion } from "framer-motion";
import brainPictogram from "../assets/icons/brain-pictogram-5.svg";
import { OrganicPhoto } from "./OrganicPhoto";
import { SITE_PHOTOS } from "../config/photos";

const contrasts = [
  {
    title: "Most tools treat each step as a separate task",
    body: "Upload a pay stub, check a box, move on. The system forgets what it already learned about the borrower.",
  },
  {
    title: "Mooric ERP builds Central Loan Memory",
    body: "As documents come in and information is added, the system retains a complete understanding of the borrower — income complexity, credit story, property situation, all of it.",
  },
  {
    title: "Recommendations based on the full file",
    body: "When you structure the loan or choose a program, you are not starting from scratch. Mooric surfaces the right recommendation the way an experienced Loan Officer would — based on the full picture, not just the last document uploaded.",
  },
] as const;

const tracks = [
  {
    label: "1003",
    body: "Complete the application without three rounds of borrower follow-up",
    icon: StatDocIcon,
  },
  {
    label: "Conditions",
    body: "Cleared, outstanding, and overdue — one view, no email archaeology",
    icon: StatChecklistIcon,
  },
  {
    label: "Closing",
    body: "TRID, title, HOI, and appraisal deadlines tracked in one place",
    icon: StatCalendarIcon,
  },
] as const;

const fragmentedExamples: Record<(typeof tracks)[number]["label"], string> = {
  "1003": "Pay stub upload",
  Conditions: "Conditions sheet",
  Closing: "Closing checklist",
};

const memoryStat = {
  value: "~1 hr",
  caption:
    "saved per file on loan structuring alone — the system already knows the borrower when you build the deal.",
} as const;

const complianceNote = {
  eyebrow: "Compliance-ready by design",
  body: 'Every document, extracted field, and update is logged against the file — when an auditor, investor, or underwriter asks "why," the answer is already on record.',
} as const;

function StatDocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function StatChecklistIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 11l2 2 4-4M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3v2M17 3v2M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 13h2v2H8v-2zm6 0h2v2h-2v-2z" fill="currentColor" />
    </svg>
  );
}

function IconWithoutMemory({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21.7803 3.28033C22.0732 2.98744 22.0732 2.51256 21.7803 2.21967C21.4874 1.92678 21.0126 1.92678 20.7197 2.21967L18.7077 4.23161C17.0483 3.05263 14.7323 3.20693 13.2448 4.6945L12.1767 5.76252C11.4933 6.44594 11.4933 7.55398 12.1767 8.2374L15.7625 11.8232C16.446 12.5066 17.554 12.5066 18.2374 11.8232L19.3054 10.7552C20.793 9.26761 20.9473 6.9517 19.7684 5.29228L21.7803 3.28033ZM18.1945 5.75516L18.2173 5.77798L18.2197 5.78033L18.222 5.78267L18.2448 5.80542C19.3187 6.87936 19.3187 8.62056 18.2448 9.6945L17.1767 10.7625C17.0791 10.8602 16.9208 10.8602 16.8232 10.7625L13.2374 7.17674C13.1398 7.07911 13.1398 6.92082 13.2374 6.82318L14.3054 5.75516C15.3794 4.68122 17.1206 4.68122 18.1945 5.75516ZM10.7803 11.2803C11.0732 10.9874 11.0732 10.5126 10.7803 10.2197C10.4874 9.92678 10.0126 9.92678 9.71967 10.2197L8.00001 11.9393L7.53035 11.4697C7.23746 11.1768 6.76258 11.1768 6.46969 11.4697L4.69456 13.2448C3.20701 14.7324 3.0527 17.0483 4.23163 18.7077L2.21967 20.7197C1.92678 21.0126 1.92678 21.4874 2.21967 21.7803C2.51256 22.0732 2.98744 22.0732 3.28033 21.7803L5.29229 19.7684C6.95171 20.9473 9.26766 20.793 10.7552 19.3055L12.5303 17.5303C12.8232 17.2374 12.8232 16.7626 12.5303 16.4697L12.0607 16L13.7803 14.2803C14.0732 13.9874 14.0732 13.5126 13.7803 13.2197C13.4874 12.9268 13.0126 12.9268 12.7197 13.2197L11 14.9393L9.06067 13L10.7803 11.2803ZM7.46631 13.527L7.46967 13.5303L7.47305 13.5337L10.4664 16.527L10.4697 16.5303L10.473 16.5336L10.9394 17L9.69456 18.2448C8.62062 19.3187 6.87942 19.3187 5.80548 18.2448L5.75522 18.1945C4.68128 17.1206 4.68128 15.3794 5.75522 14.3055L7.00002 13.0607L7.46631 13.527Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconBrokenLink({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.7 19.3l-1-1c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l1 1c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3C21.1 20.3 21.1 19.7 20.7 19.3z" />
      <path d="M14 22c0 0.6 0.4 1 1 1s1-0.4 1-1v-2c0-0.6-0.4-1-1-1s-1 0.4-1 1V22z" />
      <path d="M22 14h-2c-0.6 0-1 0.4-1 1s0.4 1 1 1h2c0.6 0 1-0.4 1-1S22.6 14 22 14z" />
      <path d="M20.7 8.4c0-1.4-0.5-2.6-1.5-3.6c-1-1-2.2-1.5-3.6-1.5S13 3.8 12 4.8L9.8 7c-0.4 0.4-0.4 1 0 1.4s1 0.4 1.4 0l2.2-2.2c1.2-1.2 3.2-1.2 4.4 0c0.6 0.6 0.9 1.4 0.9 2.2c0 0.8-0.3 1.6-0.9 2.2l-2.2 2.2c-0.4 0.4-0.4 1 0 1.4c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3l2.2-2.2C20.2 11 20.7 9.8 20.7 8.4z" />
      <path d="M3.3 15.6c0 1.4 0.5 2.6 1.5 3.6c1 1 2.2 1.5 3.6 1.5s2.6-0.5 3.6-1.5l2.2-2.2c0.4-0.4 0.4-1 0-1.4s-1-0.4-1.4 0l-2.2 2.2c-1.2 1.2-3.2 1.2-4.4 0c-0.6-0.6-0.9-1.4-0.9-2.2c0-0.8 0.3-1.6 0.9-2.2l2.2-2.2c0.4-0.4 0.4-1 0-1.4s-1-0.4-1.4 0L4.8 12C3.8 13 3.3 14.2 3.3 15.6z" />
      <path d="M5.7 4.3l-1-1c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l1 1C4.5 5.9 4.7 6 5 6s0.5-0.1 0.7-0.3C6.1 5.3 6.1 4.7 5.7 4.3z" />
      <path d="M10 4V2c0-0.6-0.4-1-1-1S8 1.4 8 2v2c0 0.6 0.4 1 1 1S10 4.6 10 4z" />
      <path d="M4 10c0.6 0 1-0.4 1-1S4.6 8 4 8H2C1.4 8 1 8.4 1 9s0.4 1 1 1H4z" />
    </svg>
  );
}

function IconBrain({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${brainPictogram})`,
        WebkitMaskImage: `url(${brainPictogram})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

function MemoryPipelineBackdrop() {
  return (
    <svg
      className="memory-outcome-mooric__art"
      viewBox="0 0 280 200"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <path
        d="M -4 172 C 28 172, 48 88, 88 78 C 128 68, 148 138, 188 128 C 228 118, 248 42, 288 28"
        className="memory-outcome-mooric__pipe"
      />
      <path
        d="M -4 172 C 28 172, 48 88, 88 78 C 128 68, 148 138, 188 128 C 228 118, 248 42, 288 28"
        className="memory-outcome-mooric__pipe-light"
      />
    </svg>
  );
}

function MemoryEyebrow({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono text-[13px] font-normal uppercase tracking-[0.2em] text-[#2563eb] ${className}`}>
      04 · Core differentiator
    </p>
  );
}

function MemoryIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="memory-intro max-w-3xl"
    >
      <MemoryEyebrow />
      <h2 id="memory-heading" className="section-heading text-white">
        Central Loan Memory
      </h2>
      <p className="mt-4 max-w-[680px] text-lg leading-relaxed text-slate-300">
        This is what ties the entire broker-side process together in one system. Mooric ERP does not
        reset between tasks — it remembers the file end to end.
      </p>
    </motion.div>
  );
}

function MemoryStatBlock({
  className = "",
  compact = false,
  dark = false,
}: {
  className?: string;
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <p
        className={`shrink-0 font-mono font-semibold tabular-nums ${
          dark ? "text-erp" : "text-[#16a34a]"
        } ${compact ? "text-[2.75rem] leading-none tracking-tight" : "text-4xl sm:text-5xl"}`}
      >
        {memoryStat.value}
      </p>
      <p
        className={`leading-relaxed ${dark ? "text-slate-300" : "text-[#1e293b]"} ${
          compact ? "text-[14.5px]" : "text-sm sm:text-base"
        }`}
      >
        {memoryStat.caption}
      </p>
    </div>
  );
}

function MemoryPayoffFooter({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid gap-7 border-t border-[#e7ebf1] bg-white px-7 py-5 sm:grid-cols-[1fr_auto_1.2fr] sm:items-center sm:gap-7 sm:px-8 ${className}`}
    >
      <MemoryStatBlock compact />
      <div className="hidden h-full min-h-[44px] w-px bg-[#d6dce6] sm:block" aria-hidden />
      <div>
        <p className="font-mono text-[13px] font-normal uppercase tracking-[0.22em] text-[#2563eb]">
          {complianceNote.eyebrow}
        </p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#1e293b]">{complianceNote.body}</p>
      </div>
    </div>
  );
}

function WithoutMemoryCopy({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Without memory</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-600">{contrasts[0].title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{contrasts[0].body}</p>
      <blockquote className="mt-5 border-l-2 border-dashed border-slate-300 pl-4">
        <p className="text-sm font-semibold text-slate-500">Last document wins</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Context from earlier steps is gone when you structure the loan — you work from the last
          upload, not the full borrower story.
        </p>
      </blockquote>
    </div>
  );
}

function ConceptStepLanes() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="mt-12"
    >
      <article className="overflow-hidden rounded-3xl border border-[#e7ebf1] bg-white shadow-card-md">
        <div className="sm:grid sm:grid-cols-2 sm:grid-flow-col sm:grid-rows-[auto_auto_repeat(3,auto)_auto]">
          <div className="contents">
            <div className="border-b border-[#e7ebf1] bg-[#eef1f5] px-7 py-6 sm:border-r sm:px-8">
              <WithoutMemoryCopy />
            </div>
            <div
              className="hidden border-b border-[#e7ebf1] bg-[#f8fafc] px-7 py-5 text-slate-400 sm:flex sm:items-center sm:justify-center sm:border-r sm:px-8"
              aria-label="Without memory"
            >
              <IconWithoutMemory size={32} />
            </div>
            {tracks.map((track, i) => (
              <div
                key={`without-${track.label}`}
                className={`hidden border-b border-[#e7ebf1] p-5 sm:block sm:border-r sm:p-6 ${
                  i % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                }`}
              >
                <div className="flex items-start gap-3 rounded-xl border border-dashed border-slate-300 bg-[#eef1f5]/60 px-4 py-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7ebf1] text-slate-400">
                    <track.icon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{track.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {fragmentedExamples[track.label]}
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                      context resets here
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="memory-outcome-lost border-b border-[#e7ebf1] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <div className="memory-outcome-lost__card">
                <span className="memory-outcome-lost__icon">
                  <IconBrokenLink size={18} />
                </span>
                <div className="min-w-0 text-left">
                  <p className="memory-outcome-lost__label">Outcome without memory</p>
                  <p className="memory-outcome-lost__headline">Borrower context — lost</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contents">
            <div className="border-b border-[#e7ebf1] bg-white/60 px-7 py-6 sm:px-8">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">
                With Mooric
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[#020618]">{contrasts[1].title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#1e293b]">{contrasts[1].body}</p>
            </div>
            <div
              className="hidden border-b border-[#e7ebf1] bg-[#f8fafc] px-7 py-5 text-erp sm:flex sm:items-center sm:justify-center sm:px-8"
              aria-label="With Mooric"
            >
              <IconBrain size={32} />
            </div>
            {tracks.map((track, i) => (
              <div
                key={`with-${track.label}`}
                className={`border-b border-[#e7ebf1] p-5 sm:p-6 ${
                  i % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                }`}
              >
                <div className="flex items-start gap-3 rounded-xl border border-[#e7ebf1] bg-white px-4 py-3.5 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-[0_0_14px_rgba(0,117,255,0.28)]">
                    <track.icon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{track.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{track.body}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="memory-outcome-mooric p-5 sm:p-6">
              <div className="memory-outcome-mooric__mesh" aria-hidden>
                <MemoryPipelineBackdrop />
              </div>
              <div className="memory-outcome-mooric__card">
                <p className="memory-outcome-mooric__label">Outcome with Mooric</p>
                <p className="memory-outcome-mooric__headline">
                  Full borrower context —{" "}
                  <span className="memory-outcome-mooric__badge">
                    <span className="memory-outcome-mooric__badge-dot" aria-hidden />
                    Retained
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article className="mt-4 overflow-hidden rounded-3xl border border-[#e7ebf1] bg-white shadow-card-md">
        <div className="bg-[#2563eb]/[0.06] px-7 py-5 sm:px-8 sm:py-6">
          <h4 className="text-sm font-semibold text-[#020618]">{contrasts[2].title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-[#334155]">{contrasts[2].body}</p>
        </div>

        <MemoryPayoffFooter />
      </article>
    </motion.div>
  );
}

export function CentralLoanMemorySection() {
  return (
    <section
      id="memory"
      className="section-marketing relative overflow-hidden border-0 bg-[#0a1626]"
      aria-labelledby="memory-heading"
    >
      <div className="layout-shell relative z-10">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
          <MemoryIntro />
          <OrganicPhoto
            src={SITE_PHOTOS.memory.src}
            alt={SITE_PHOTOS.memory.alt}
            objectPosition={SITE_PHOTOS.memory.objectPosition}
            caption={SITE_PHOTOS.memory.caption}
            side="left"
            className="lg:order-first"
          />
        </div>
        <ConceptStepLanes />
      </div>
    </section>
  );
}
