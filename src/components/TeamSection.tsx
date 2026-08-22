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
      <div className="team-portrait neu-pad relative mx-auto aspect-[4/5] max-w-[220px] overflow-hidden">
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
      <div className="neu-pad team-lockup">
        <h3>{name}</h3>
        <p>{title}</p>
      </div>
    </motion.article>
  );
}

export function TeamSection() {
  return (
    <section
      id="team"
      className="section-marketing section-neu"
      aria-labelledby="team-heading"
    >
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
              <p className="inline-flex items-center justify-center gap-2.5 font-mono text-sm font-normal uppercase tracking-[0.22em] text-erp sm:text-base">
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
              <h2 id="team-heading" className="section-heading mt-4">
                Our team
              </h2>
            </div>
            <p className="mx-auto mt-4 w-full text-lg leading-relaxed text-organ-800">
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
