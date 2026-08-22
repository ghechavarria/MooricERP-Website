import { motion } from "framer-motion";
import { OrganicPhoto } from "./OrganicPhoto";
import { SITE_PHOTOS } from "../config/photos";

const steps = [
  {
    title: "Full pipeline visibility, one screen",
    detail:
      "From the moment you first speak to a prospect to the day the loan funds, every file has a clear status. No more spreadsheets with columns of dates to manually update. No more wondering where a file stands.",
  },
  {
    title: "Daily summary — know what needs attention today",
    detail:
      "The Summary view surfaces everything that needs your attention right now — overdue conditions, upcoming TRID deadlines, files that have been sitting without an update. Start every day knowing exactly where to focus.",
  },
  {
    title: "Closed loan performance",
    detail:
      "See your closed loan history summarized by month, quarter, or year — volume, average loan size, time to close. Simple visibility into your own production without building a report.",
  },
] as const;

export function PipelineSection() {
  return (
    <section
      id="pipeline"
      className="section-marketing overflow-hidden border-t-0 border-b-0 bg-[#0a1626] text-white"
      aria-labelledby="pipeline-heading"
    >
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-2xl page-gutter-x lg:max-w-xl lg:pr-10"
        >
          <p className="font-mono text-[13px] font-normal uppercase tracking-[0.28em] text-erp">03 · Closed</p>
          <h2
            id="pipeline-heading"
            className="display-heading mt-4 text-white"
          >
            CLOSED — Pipeline & production
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            One of the most common pain points for independent LOs and broker shops is managing a
            pipeline across spreadsheets, sticky notes, and calendar reminders. Mooric ERP brings
            all of that into a single view that follows every loan from first conversation to
            funded — end to end, no more Excel tracking.
          </p>
        </motion.div>
        <OrganicPhoto
          src={SITE_PHOTOS.pipeline.src}
          alt={SITE_PHOTOS.pipeline.alt}
          objectPosition={SITE_PHOTOS.pipeline.objectPosition}
          caption={SITE_PHOTOS.pipeline.caption}
          side="right"
          className="organic-photo--square"
        />
      </div>
      <div className="page-gutter-x mt-8 grid gap-0 border-t border-white/15 sm:mt-14 sm:grid-cols-3">
          {steps.map((s, i) => (
            <article
              key={s.title}
              className="flex gap-3 border-b border-white/15 py-4 sm:block sm:gap-5 sm:border-b-0 sm:border-r sm:p-8 sm:last:border-r-0"
            >
              <p className="shrink-0 font-display text-3xl font-extrabold leading-none text-erp sm:text-4xl">{i + 1}</p>
              <div>
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-white sm:mt-4 sm:text-lg">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-slate-400 sm:mt-3 sm:leading-relaxed">{s.detail}</p>
              </div>
            </article>
          ))}
        </div>
    </section>
  );
}
