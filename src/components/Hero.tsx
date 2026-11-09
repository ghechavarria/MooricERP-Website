import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { HeroCopy } from "./HeroCopy";
import { SITE_PHOTOS } from "../config/photos";

/** The homepage video on YouTube (https://youtu.be/BI5DlHQgo5w). */
export const HERO_YOUTUBE_ID = "BI5DlHQgo5w";

/** Where .v4-hero-grid stacks to one column (src/index.css). */
export const HERO_STACKED_QUERY = "(max-width: 1099px)";

const SWIPE_PX = 50;
/** How long each slide stays before the carousel moves on. */
const WIDE_SLIDE_MS = 10_000;
const STACKED_SLIDE_MS = 7_000;
/** Space between slides; larger than the clip margin so a neighbour never peeks in. */
const SLIDE_GAP = "6rem";

const matchesStacked = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(HERO_STACKED_QUERY).matches;

/** True while the hero is one column. False where matchMedia is missing. */
function useStacked(): boolean {
  const [stacked, setStacked] = useState(matchesStacked);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const list = window.matchMedia(HERO_STACKED_QUERY);
    const update = () => setStacked(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, []);
  return stacked;
}

/** The blue card: looping background video with "Empowering better closings". */
function HeroVideoCard() {
  return (
    <div className="v4-hero-video">
      <video src={SITE_PHOTOS.hero.video} autoPlay muted loop playsInline preload="auto" aria-hidden />
      <div className="v4-hero-video__veil" aria-hidden />
      <div className="v4-hero-video__copy">
        <p>Intelligent mortgage platform</p>
        <p>Empowering better closings</p>
      </div>
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

function PlayIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

/**
 * What sits over the thumbnail before play: a brand gradient (YouTube's largest
 * thumbnail is 1280px, so on a wide slide it is a little soft; the gradient
 * covers that), and crisp HTML text and a play button. Small boxes get just the
 * button; the text appears from the sm breakpoint and grows on wide screens.
 */
function VideoCover() {
  return (
    <span aria-hidden className="absolute inset-0 block text-left">
      {/* deep blue from the left, fading so the thumbnail shows on the right */}
      <span className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,18,40,0.97)_0%,rgba(6,24,52,0.9)_45%,rgba(8,32,68,0.45)_75%,rgba(8,32,68,0.15)_100%)] transition-opacity duration-300 group-hover:opacity-90" />
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(0,117,255,0.28),transparent_55%)]" />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(6,22,48,0.55)] to-transparent" />

      {/* phones: just the button, centred */}
      <span className="absolute inset-0 flex items-center justify-center sm:hidden">
        <span className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[14px] font-semibold text-[#0a0e14] shadow-xl">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-erp">
            <PlayIcon className="ml-0.5 h-3.5 w-3.5 fill-white" />
          </span>
          Watch the video
        </span>
      </span>

      {/* tablet and up: kicker, headline, line, button */}
      <span className="absolute inset-0 hidden flex-col justify-center gap-4 px-[clamp(1.75rem,1rem+3vw,4.5rem)] sm:flex lg:gap-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#9cc6ff]">Video</span>
        <span className="max-w-[17em] text-[clamp(1.6rem,1rem+2.4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white [text-wrap:balance]">
          See Mooric ERP in action
        </span>
        <span className="max-w-[30em] text-[clamp(0.95rem,0.85rem+0.4vw,1.125rem)] leading-relaxed text-[#cfe0f7]">
          One workspace for the whole broker-side file, from intake to closing.
        </span>
        <span className="mt-1 inline-flex w-fit items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 text-[15px] font-semibold text-[#0a0e14] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.55)] lg:text-base">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-erp lg:h-11 lg:w-11">
            <PlayIcon className="ml-0.5 h-4 w-4 fill-white lg:h-[18px] lg:w-[18px]" />
          </span>
          Watch the video
        </span>
      </span>
    </span>
  );
}

/**
 * The YouTube video, filling the box it is given (its slide's width and the
 * first slide's height). Until someone presses play it is only a thumbnail, so
 * nothing loads from YouTube for people who never watch; then it plays in
 * YouTube's privacy-enhanced player. Leaving the slide stops it.
 */
function YouTubeSlide({
  active,
  height,
  onPlayingChange,
}: {
  active: boolean;
  height?: number;
  onPlayingChange: (playing: boolean) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${HERO_YOUTUBE_ID}/maxresdefault.jpg`);

  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);

  useEffect(() => {
    onPlayingChange(playing);
  }, [playing, onPlayingChange]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.5rem] bg-[#082044] shadow-[0_40px_80px_-40px_rgb(10_22_45/0.5)]${height === undefined ? " aspect-video" : ""}`}
      style={height === undefined ? undefined : { height }}
    >
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
          <VideoCover />
        </button>
      )}
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

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

type SlideContext = { active: boolean; height?: number; onVideoPlayingChange: (playing: boolean) => void };
type Slide = { name: string; render: (ctx: SlideContext) => ReactNode };

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Slides side by side, one visible. The first slide sets the height and every
 * other slide gets it, so the frame never jumps. It moves on by itself every
 * `interval` ms, and arrows, dots, swipe and Left/Right move it too (each move
 * restarts the clock). Autoplay pauses while a mouse is over it or keyboard
 * focus is inside it; touch screens get a pause/play button with the controls.
 * It holds on a slide whose video has been started (paused or not) until the
 * visitor moves to another slide, which stops the video. It does not start for people
 * who ask for reduced motion (the button can still start it).
 * Hidden slides are inert, and only the visible slide takes clicks (the
 * transformed strip paints above later content, so it must not catch clicks
 * meant for the controls).
 */
function Carousel({ slides, label, interval }: { slides: Slide[]; label: string; interval: number }) {
  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [autoplay, setAutoplay] = useState(() => !prefersReducedMotion());
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef<number | null>(null);

  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), [slides.length]);
  const onVideoPlayingChange = useCallback((playing: boolean) => setVideoPlaying(playing), []);

  const running = autoplay && !videoPlaying && !hovered && !focused;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(index + 1), interval);
    return () => window.clearTimeout(timer);
  }, [running, index, interval, go]);

  useLayoutEffect(() => {
    const el = firstRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight || undefined);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      className="min-w-0"
    >
      <div
        // Clip sideways only, with room for the cards' shadows.
        className="[overflow-clip-margin:4rem] [overflow-x:clip] [overflow-y:visible]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
      >
        <div
          aria-live={running ? "off" : "polite"}
          className="pointer-events-none flex items-start transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ gap: SLIDE_GAP, transform: `translateX(calc(-${index} * (100% + ${SLIDE_GAP})))` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.name}
              ref={i === 0 ? firstRef : undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}: ${slide.name}`}
              aria-hidden={i !== index}
              inert={i !== index}
              className={`w-full min-w-0 shrink-0${i === index ? " pointer-events-auto" : ""}`}
            >
              {slide.render({ active: i === index, height: i === 0 ? undefined : height, onVideoPlayingChange })}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-10 flex items-center justify-center gap-4 sm:mt-14">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfd9e6] bg-white text-[#0a0e14] transition hover:border-erp hover:text-erp"
        >
          <Arrow dir="prev" />
        </button>
        <div className="flex items-center gap-1">
          {slides.map((slide, i) => (
            <button
              key={slide.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}: ${slide.name}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                aria-hidden
                className={`block h-2.5 rounded-full transition-all ${i === index ? `w-7 ${running ? "bg-erp" : "bg-[#99c7ff]"}` : "w-2.5 bg-[#cfd9e6] hover:bg-[#9fb3cc]"}`}
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
        {/* touch screens only: they cannot hover to pause */}
        <button
          type="button"
          onClick={() => setAutoplay((on) => !on)}
          disabled={videoPlaying}
          aria-label={autoplay ? "Pause slideshow" : "Play slideshow"}
          className="hidden h-11 disabled:cursor-not-allowed disabled:opacity-40 w-11 items-center justify-center rounded-full border border-[#cfd9e6] bg-white text-[#0a0e14] transition hover:border-erp hover:text-erp [@media(hover:none)]:flex"
        >
          {autoplay ? <PauseIcon /> : <PlayIcon className="ml-0.5 h-4 w-4 fill-current" />}
        </button>
      </div>
    </div>
  );
}

const youTube: Slide = {
  name: "Video",
  render: ({ active, height, onVideoPlayingChange }) => (
    <YouTubeSlide active={active} height={height} onPlayingChange={onVideoPlayingChange} />
  ),
};

/**
 * Side by side (wide screens): the whole hero is a carousel, and the YouTube
 * slide fills the space of the copy and the blue card together.
 * Stacked (1099px and narrower): the copy stays put and only the blue card
 * carousels, to the YouTube video at the card's size.
 */
export function Hero() {
  const stacked = useStacked();

  return (
    <section id="top" className="v4-hero" aria-labelledby="hero-heading">
      <div className="layout-shell">
        {stacked ? (
          <div className="v4-rail v4-hero-grid">
            <motion.div {...fadeUp()}>
              <HeroCopy />
            </motion.div>
            <motion.div {...fadeUp(0.08)} className="relative min-w-0">
              <Carousel label="Mooric ERP videos" interval={STACKED_SLIDE_MS} slides={[{ name: "Overview", render: () => <HeroVideoCard /> }, youTube]} />
            </motion.div>
          </div>
        ) : (
          <div className="v4-rail">
            <Carousel
              label="Mooric ERP introduction"
              interval={WIDE_SLIDE_MS}
              slides={[
                {
                  name: "Overview",
                  render: () => (
                    <div className="v4-hero-grid">
                      <motion.div {...fadeUp()}>
                        <HeroCopy />
                      </motion.div>
                      <motion.div {...fadeUp(0.08)} className="relative">
                        <HeroVideoCard />
                      </motion.div>
                    </div>
                  ),
                },
                youTube,
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
}
