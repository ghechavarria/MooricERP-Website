import { motion } from "framer-motion";
import { useState } from "react";

const members = [
  { name: "Yeqiao Guo", slug: "yeqiao-guo", title: "Chief Executive Officer" },
  { name: "James Jones", slug: "james-jones", title: "Chief Operating Officer" },
  { name: "Zhen Wu", slug: "zhen-wu", title: "Chief Financial Officer" },
  { name: "Erik Ruiz", slug: "erik-ruiz", title: "Chief Information Security Officer" },
  { name: "Grace Hechavarria", slug: "grace-hechavarria", title: "Chief Information Officer" },
  { name: "Joanne Rossi", slug: "joanne-rossi", title: "Chief Quality and Compliance Officer" },
  { name: "Andrew Li", slug: "andrew-li", title: "SVP Product Development" },
] as const;

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function TeamMemberCard({
  name,
  slug,
  title,
  index,
}: {
  name: string;
  slug: string;
  title: string;
  index: number;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="w-[calc(50%-0.75rem)] sm:w-52 md:w-56"
    >
      <div className="relative mx-auto aspect-[4/5] max-w-[220px] overflow-hidden rounded-[18px] border border-[#e4ebf4] bg-[#f8fafd]">
        <span className="absolute inset-x-0 bottom-0 z-[1] h-[5px] bg-erp" aria-hidden />
        {!photoFailed ? (
          <picture>
            <source type="image/webp" srcSet={`/images/team/${slug}.webp`} />
            <img
              src={`/images/team/${slug}.jpg`}
              alt=""
              width={440}
              height={550}
              sizes="220px"
              className="h-full w-full object-cover object-center"
              loading={index < 4 ? "eager" : "lazy"}
              fetchPriority={index < 2 ? "high" : "auto"}
              decoding="async"
              onError={() => setPhotoFailed(true)}
            />
          </picture>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-slate-800 font-display text-4xl font-bold text-accent-light"
            aria-hidden
          >
            {initialsFrom(name)}
          </div>
        )}
      </div>
      <div className="mx-auto mt-[1.1rem] flex w-full max-w-[220px] flex-col items-center rounded-[0.9rem] border border-[#e4ebf4] bg-[#f8fafd] px-5 py-5 text-center">
        <h3 className="m-0 font-display text-[1.05rem] font-bold leading-snug tracking-[-0.02em] text-[#0a0e14]">
          {name}
        </h3>
        <p className="mt-[0.35rem] text-xs font-semibold leading-snug text-erp text-balance">{title}</p>
      </div>
    </motion.article>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="v4-section" aria-labelledby="team-heading">
      <div className="layout-shell">
        <div className="mx-auto w-full max-w-5xl @container/team">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full text-center"
          >
            <div className="mx-auto max-w-3xl">
              <p className="v4-kicker inline-flex items-center justify-center gap-2.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 sm:h-6 sm:w-6" aria-hidden>
                  <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.75" />
                  <circle cx="16" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.75" />
                  <path
                    d="M3.8 19c.5-2.8 2.2-4.4 4.2-4.4 1.3 0 2.4.7 3.2 1.8.8-1.1 1.9-1.8 3.2-1.8 2 0 3.7 1.6 4.2 4.4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
                The people
              </p>
              <h2 id="team-heading" className="v4-h2 mx-auto">
                Our team
              </h2>
            </div>
            <p className="mx-auto mt-4 w-full text-lg leading-relaxed text-[#48566b]">
              Mortgage technology veterans building the platform{" "}
              <br className="hidden @max-[979px]/team:block" />
              independent loan officers actually need.
            </p>
          </motion.div>

          <div className="mt-14 flex flex-wrap justify-center gap-x-5 gap-y-10 sm:mt-16 sm:gap-x-6 lg:gap-x-7">
            {members.map((m, i) => (
              <TeamMemberCard key={m.slug} name={m.name} slug={m.slug} title={m.title} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
