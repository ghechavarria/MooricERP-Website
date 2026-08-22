import { motion } from "framer-motion";
import { OrganicPhoto } from "./OrganicPhoto";
import { HeroCopy } from "./HeroCopy";
import { HeroSessionPulse } from "./HeroSessionPulse";
import { SITE_PHOTOS } from "../config/photos";

function HeroStats({ className = "" }: { className?: string }) {
  return (
    <ul className={`hero-demo-stats ${className}`.trim()} aria-label="Product highlights">
      <li>
        <p className="hero-demo-stats__num">~1 hr</p>
        <p className="hero-demo-stats__label">saved per file on structuring</p>
      </li>
      <li>
        <p className="hero-demo-stats__num">1003</p>
        <p className="hero-demo-stats__label">auto-filled from documents</p>
      </li>
      <li>
        <p className="hero-demo-stats__num">0</p>
        <p className="hero-demo-stats__label">spreadsheets to maintain</p>
      </li>
    </ul>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative scroll-mt-[4.25rem] overflow-hidden border-b border-white/[0.06] bg-[linear-gradient(to_bottom_right,#050910,#081120,#0a1626)]"
      aria-labelledby="hero-heading"
    >
      <div className="relative flex min-h-0 flex-col min-[1100px]:min-h-[calc(100svh-4.25rem)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_72%_20%,rgba(37,99,235,0.22),transparent_55%),radial-gradient(ellipse_70%_55%_at_12%_85%,rgba(30,64,175,0.18),transparent_55%),radial-gradient(ellipse_55%_40%_at_50%_-10%,rgba(96,165,250,0.14),transparent_60%)]"
          aria-hidden
        />
        <div className="relative flex w-full min-h-0 flex-1 flex-col">
          <HeroSessionPulse>
            <p className="sr-only">
              Decorative session strip above; main headline and editorial photo follow.
            </p>
            <div className="hero-photo-stack">
              <div className="hero-photo-stage">
                <OrganicPhoto
                  src={SITE_PHOTOS.hero.src}
                  alt={SITE_PHOTOS.hero.alt}
                  objectPosition={SITE_PHOTOS.hero.objectPosition}
                  caption={SITE_PHOTOS.hero.caption}
                  side="right"
                  eager
                  rip
                  className="organic-photo--hero"
                />
              </div>
              <div className="hero-photo-headline">
                <HeroCopy mode="lead" className="hero-copy--on-photo" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="hero-copy-rail layout-header relative z-[2] ml-0 mr-auto flex w-full min-w-0 flex-col max-[1099px]:order-1 max-[1099px]:flex-none min-[1100px]:max-w-[45%] min-[1100px]:flex-1 min-[1100px]:pr-10"
            >
              <div className="hero-copy-pane">
                <div className="hero-copy-stage hero-copy-stage--panel w-full min-w-0 max-[1099px]:mx-auto max-[1099px]:max-w-[880px]">
                  <HeroCopy mode="support" />
                </div>
                <HeroStats className="hero-demo-stats--spread" />
              </div>
            </motion.div>
          </HeroSessionPulse>
        </div>
      </div>
    </section>
  );
}
