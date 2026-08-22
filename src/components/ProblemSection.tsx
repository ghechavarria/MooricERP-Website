import { motion } from "framer-motion";
import { OrganicPhoto } from "./OrganicPhoto";
import { SITE_PHOTOS } from "../config/photos";

const painPoints = [
  {
    stat: "3×",
    title: "The same data, re-typed",
    body: "Intake notes, the 1003, the LOS — you enter the same borrower information again and again, and every re-entry is a chance for an error underwriting will catch later.",
  },
  {
    stat: "17",
    title: "Emails to clear one condition",
    body: "Which conditions are cleared? Which are still open? The answer lives across email threads, phone calls, and memory — not in one place you can trust.",
  },
  {
    stat: "5+",
    title: "Tools that don't talk",
    body: "Excel for the pipeline, folders for documents, a calendar for deadlines, notes for borrower context, email for everything else. You are the integration.",
  },
  {
    stat: "9",
    unit: "PM",
    title: "When you find out something slipped",
    body: "A CD deadline, an expiring lock, an HOA questionnaire nobody chased — hard dates don't remind themselves, so the anxiety never fully switches off.",
  },
] as const;

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="section-marketing overflow-hidden border-b border-white/10 bg-navy text-white"
      aria-labelledby="problem-heading"
    >
      <div className="layout-shell">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="max-w-5xl lg:max-w-2xl"
          >
            <p className="font-mono text-[13px] font-normal uppercase tracking-[0.28em] text-erp">01 · The problem</p>
            <h2
              id="problem-heading"
              className="display-heading mt-4 text-white"
            >
              Where does your day actually go?
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Ask independent LOs and broker shops. It’s not the borrowers, the guidelines, or the
              deals — it’s the overhead between them. The same file, handled five different ways, in
              five different places.
            </p>
          </motion.div>
          <OrganicPhoto
            src={SITE_PHOTOS.problem.src}
            alt={SITE_PHOTOS.problem.alt}
            objectPosition={SITE_PHOTOS.problem.objectPosition}
            caption={SITE_PHOTOS.problem.caption}
            side="right"
          />
        </div>
        <div className="problem-metric-grid mt-8 sm:mt-16">
          {painPoints.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="py-4 sm:p-8"
            >
              <div className="flex items-baseline gap-3 sm:block">
                <p className="shrink-0 whitespace-nowrap font-display text-3xl font-extrabold leading-none text-erp sm:text-5xl">
                  {item.stat}
                  {"unit" in item ? (
                    <span className="relative -top-[0.22em] ml-px inline-block text-[0.5em] tracking-wide">
                      {item.unit}
                    </span>
                  ) : null}
                </p>
                <h3 className="text-base font-bold uppercase tracking-wide text-white sm:mt-4 sm:text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="mt-1.5 text-sm leading-snug text-slate-400 sm:mt-3 sm:leading-relaxed">{item.body}</p>
            </motion.article>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-lg text-slate-300">
            <span className="font-semibold text-white">None of this is loan officer work.</span> It’s
            overhead — and it’s exactly what Mooric ERP is built to take off your plate.
          </p>
          <a
            href="#features"
            className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.16em] text-erp"
          >
            See how ↓
          </a>
        </div>
      </div>
    </section>
  );
}
