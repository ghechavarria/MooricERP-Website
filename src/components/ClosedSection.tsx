import { motion } from "framer-motion";
import { SITE_PHOTOS } from "../config/photos";

const stats = [
  { label: "Volume", value: "12", detail: "loans closed" },
  { label: "Avg. size", value: "$385K", detail: "per loan" },
  { label: "Days to close", value: "32", detail: "average" },
] as const;

export function ClosedSection() {
  return (
    <section id="closed" className="v4-section" aria-labelledby="closed-heading">
      <div className="layout-shell">
        <div className="v4-rail v4-split--flip">
          <motion.figure
            className="relative m-0 overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#16233a,#0f1b2e)] shadow-[0_40px_80px_-48px_rgb(10_22_45_/_0.5)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={SITE_PHOTOS.pipeline.src}
              alt={SITE_PHOTOS.pipeline.alt}
              width={1600}
              height={1200}
              className="v4-closed-photo"
              style={{ objectPosition: SITE_PHOTOS.pipeline.objectPosition }}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute bottom-6 left-[26px] rounded-full bg-[rgb(10_17_32_/_0.62)] px-[18px] py-[9px] font-mono text-[11px] uppercase tracking-[0.16em] text-white backdrop-blur-[10px]">
              Every file, one view
            </figcaption>
          </motion.figure>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            <p className="v4-kicker">Closed</p>
            <h2 id="closed-heading" className="v4-h2-sm">
              Your Loans, Your Records.
            </h2>
            <p className="v4-lead">
              When a file funds it doesn&apos;t fall off the edge of a spreadsheet. Closed loans roll
              into your production history — by month, quarter, or year. No report to build. Audit ready.
            </p>
            <div className="v4-cols-3 mt-[34px] gap-4">
              {stats.map((item) => (
                <div key={item.label} className="v4-card rounded-2xl px-5 py-[22px]">
                  <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5c6b80]">
                    {item.label}
                  </p>
                  <p className="mt-2.5 text-[26px] font-bold leading-none tracking-[-0.025em] text-[#0a0e14]">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-[12.5px] text-[#55637a]">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
