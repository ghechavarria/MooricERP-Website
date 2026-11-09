import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { HeroCopy } from "./HeroCopy";
import { SITE_PHOTOS } from "../config/photos";

/** The homepage video on YouTube (https://youtu.be/BI5DlHQgo5w). */
export const HERO_YOUTUBE_ID = "BI5DlHQgo5w";

const SLIDES = ["Overview", "Video"] as const;
const SWIPE_PX = 50;
/** Space between slides; larger than the clip margin so a neighbour never peeks in. */
const SLIDE_GAP = "4rem";

function OverviewSlide() {
  return (
    <div className="v4-rail v4-hero-grid">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <HeroCopy />
      </motion.div>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <div className="v4-hero-video">
          <video src={SITE_PHOTOS.hero.video} autoPlay muted loop playsInline preload="auto" aria-hidden />
          <div className="v4-hero-video__veil" aria-hidden />
          <div className="v4-hero-video__copy">
            <p>Intelligent mortgage platform</p>
            <p>Empowering better closings</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * The YouTube video, full rail width at 16:9. Until someone presses play it is
 * only a thumbnail, so nothing loads from YouTube (no cookies, no scripts) for
 * people who never watch. Plays in YouTube's privacy-enhanced player.
 */
function VideoSlide({ active }: { active: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${HERO_YOUTUBE_ID}/maxresdefault.jpg`);

  // Leaving the slide stops the video.
  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);

  return (
    <div className="v4-rail">
      <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-[#082044] shadow-[0_40px_80px_-40px_rgb(10_22_45/0.5)]">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${HERO_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
            title="Mooric ERP video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
            aria-label="Play the Mooric ERP video"
          >
            <img
              src={thumb}
              onError={() => setThumb(`https://i.ytimg.com/vi/${HERO_YOUTUBE_ID}/hqdefault.jpg`)}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-[#082044]/25 transition group-hover:bg-[#082044]/10" aria-hidden />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-xl transition group-hover:scale-105 sm:h-20 sm:w-20"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-erp sm:h-8 sm:w-8">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The homepage hero as a two-slide carousel: the overview, then the video.
 * It never moves on its own. Arrows, dots, swipe and the arrow keys move it;
 * the hidden slide is inert so keyboard focus stays on the visible one, and the
 * frame takes the height of the visible slide.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStart = useRef<number | null>(null);

  const go = useCallback((next: number) => setIndex((next + SLIDES.length) % SLIDES.length), []);

  // Match the frame to the visible slide, and follow it as it resizes.
  useLayoutEffect(() => {
    const el = slideRefs.current[index];
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") go(index - 1);
    else if (event.key === "ArrowRight") go(index + 1);
    else return;
    event.preventDefault();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") dragStart.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) >= SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      id="top"
      className="v4-hero"
      aria-labelledby="hero-heading"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
    >
      <div className="layout-shell">
        <div
          // Clip sideways only, with room for the cards' shadows; vertically the
          // frame takes the visible slide's height and the shadow may spill below.
          className="transition-[height] duration-500 ease-out [overflow-clip-margin:2rem] [overflow-x:clip] [overflow-y:visible] motion-reduce:transition-none"
          style={height === undefined ? undefined : { height }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragStart.current = null)}
        >
          <div
            className="flex items-start transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ gap: SLIDE_GAP, transform: `translateX(calc(-${index} * (100% + ${SLIDE_GAP})))` }}
          >
            {SLIDES.map((name, i) => (
              <div
                key={name}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${SLIDES.length}: ${name}`}
                aria-hidden={i !== index}
                inert={i !== index}
                className="w-full min-w-0 shrink-0"
              >
                {i === 0 ? <OverviewSlide /> : <VideoSlide active={index === i} />}
              </div>
            ))}
          </div>
        </div>

        <div className="v4-rail mt-8 flex items-center justify-center gap-4 sm:mt-10" aria-label="Choose a slide">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfd9e6] bg-white text-[#0a0e14] transition hover:border-erp hover:text-erp"
          >
            <Arrow dir="prev" />
          </button>
          <div className="flex items-center gap-1">
            {SLIDES.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}: ${name}`}
                aria-current={i === index ? "true" : undefined}
                className="flex h-11 w-11 items-center justify-center"
              >
                <span
                  aria-hidden
                  className={`block h-2.5 rounded-full transition-all ${i === index ? "w-7 bg-erp" : "w-2.5 bg-[#cfd9e6] hover:bg-[#9fb3cc]"}`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfd9e6] bg-white text-[#0a0e14] transition hover:border-erp hover:text-erp"
          >
            <Arrow dir="next" />
          </button>
        </div>
      </div>
    </section>
  );
}
