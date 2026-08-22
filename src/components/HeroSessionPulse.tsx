import { useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useState } from "react";

const statusLines = [
  "Preparing your loan file preview…",
  "Tracing document milestones through the pipeline…",
  "Routing conditions to the right owner…",
  "Keeping borrower and lender milestones aligned…",
  "Securing an audit-friendly trail for this visit…",
];

const statusLinesShort = [
  "Prepping your file preview…",
  "Tracing milestones…",
  "Routing conditions…",
  "Aligning borrower + lender…",
  "Securing the audit trail…",
];

const ECG_BEAT_PX = 100;
const bpm = 25;
const beatMs = Math.round(60000 / bpm);
const statusLineMs = 3200;

function ecgWavePath(width: number, amplitude: number, baseline: number, step: number): string {
  let d = `M0 ${baseline}`;
  for (let x = step; x <= width; x += step) {
    d += ` L${x} ${baseline + Math.sin((x / ECG_BEAT_PX) * Math.PI * 2) * amplitude}`;
  }
  return d;
}

const ecgWaveScrollPath = ecgWavePath(2800, 10, 20, 4);

function DriftingEcg({
  pathD,
  stroke,
  strokeWidth,
  heightClass,
  viewHeight,
  vignette,
  reduceMotion,
  compact = false,
}: {
  pathD: string;
  stroke: string;
  strokeWidth: number;
  heightClass: string;
  viewHeight: number;
  vignette: string;
  reduceMotion: boolean | null;
  compact?: boolean;
}) {
  const gid = useId().replace(/:/g, "");

  return (
    <div
      className={`relative flex min-w-0 items-stretch overflow-hidden ${compact ? "w-full" : "flex-1"} ${heightClass}`}
    >
      <svg
        viewBox={`0 0 360 ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className={`relative z-[1] block w-full shrink-0 ${heightClass}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <clipPath id={`${gid}-clip`}>
            <rect x="0" y="0" width="360" height={viewHeight} />
          </clipPath>
          <linearGradient id={`${gid}-edgeshade`} x1="0" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.04" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="0.1" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="0.18" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.82" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="0.9" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="0.96" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${gid}-edgemask`} maskUnits="userSpaceOnUse" x="0" y="0" width="360" height={viewHeight}>
            <rect width="360" height={viewHeight} fill={`url(#${gid}-edgeshade)`} />
          </mask>
        </defs>
        <g clipPath={`url(#${gid}-clip)`} mask={`url(#${gid}-edgemask)`}>
          <g
            className={reduceMotion ? undefined : "hero-ecg-drift"}
            style={
              reduceMotion
                ? undefined
                : ({
                    "--ecg-beat": `${beatMs}ms`,
                    "--ecg-beat-width": "100px",
                  } as CSSProperties)
            }
          >
            <path
              className="integrated-ecg-path"
              d={pathD}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit="8"
              shapeRendering="geometricPrecision"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>
      </svg>
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: vignette }}
        aria-hidden
      />
    </div>
  );
}

function SessionPulseBadge() {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <span className="h-2 w-2 shrink-0 rounded-full bg-erp" aria-hidden />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-organ-700">
        Live session pulse
      </span>
    </div>
  );
}

function SessionPulseWave({
  reduceMotion,
  compact = false,
  className = "",
}: {
  reduceMotion: boolean | null;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative min-w-0 shrink-0 ${compact ? "w-[7rem] max-w-[7rem]" : "flex-1"} ${className}`}
    >
      <DriftingEcg
        pathD={ecgWaveScrollPath}
        stroke="rgba(107,100,92,0.45)"
        strokeWidth={compact ? 1.5 : 1.75}
        heightClass={compact ? "h-6" : "h-7 sm:h-8"}
        viewHeight={40}
        vignette="linear-gradient(90deg, #fff 0%, rgb(255 255 255 / 0.85) 12%, transparent 28%, transparent 72%, rgb(255 255 255 / 0.85) 88%, #fff 100%)"
        reduceMotion={reduceMotion}
        compact={compact}
      />
    </div>
  );
}

function SessionPulseBar({
  tick,
  reduceMotion,
}: {
  tick: number;
  reduceMotion: boolean | null;
}) {
  return (
    <div aria-hidden className="relative z-20 shrink-0 bg-white">
      <div className="layout-header-px flex h-11 flex-row items-center gap-4 border-b border-organ-200/70 sm:h-12 sm:gap-5">
        <SessionPulseBadge />
        <p className="min-w-0 flex-1 truncate font-mono text-[10px] text-organ-700 max-[400px]:hidden sm:hidden">
          {statusLinesShort[tick % statusLinesShort.length]}
        </p>
        <p className="hidden min-w-0 flex-1 truncate font-mono text-[11px] text-organ-700 sm:block sm:text-xs">
          {statusLines[tick % statusLines.length]}
        </p>
        <SessionPulseWave reduceMotion={reduceMotion} compact className="max-[400px]:ml-auto sm:hidden" />
        <SessionPulseWave
          reduceMotion={reduceMotion}
          className="hidden min-w-0 max-w-xs flex-1 sm:block lg:max-w-md"
        />
      </div>
    </div>
  );
}

const tickerPhrases = [
  "Built for independent loan officers",
  "1003 auto-filled from documents",
  "Conditions tracked in one place",
  "TRID · Title · HOI · Appraisal deadlines",
  "Central Loan Memory on every file",
  "No more Excel pipelines",
] as const;

function HeroTicker({ reduceMotion }: { reduceMotion: boolean | null }) {
  function TickerTrack({ suffix }: { suffix: string }) {
    return (
      <span className="flex items-center gap-10">
        {tickerPhrases.map((phrase) => (
          <span key={`${suffix}-${phrase}`} className="flex items-center gap-10">
            <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/90">
              {phrase}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-white/55" aria-hidden />
          </span>
        ))}
      </span>
    );
  }

  if (reduceMotion) {
    return (
      <div aria-hidden className="shrink-0 overflow-hidden border-t border-erp-600 bg-erp py-2.5">
        <p className="layout-header-px text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/90">
          {tickerPhrases[0]}
        </p>
      </div>
    );
  }

  return (
    <div aria-hidden className="group shrink-0 overflow-hidden border-t border-erp-600 bg-erp py-2.5">
      <div className="hero-ticker-track flex w-max gap-10">
        <TickerTrack suffix="a" />
        <TickerTrack suffix="b" />
      </div>
    </div>
  );
}

export function HeroSessionPulse({ children }: { children?: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => setTick((n) => n + 1), statusLineMs);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col bg-transparent text-white">
      <SessionPulseBar tick={tick} reduceMotion={reduceMotion} />

      {children != null ? (
        <div className="hero-stack-band relative z-0 flex min-h-0 flex-1 flex-col justify-center overflow-visible bg-transparent text-ink-950">
          <div className="relative z-[1] flex min-h-0 w-full min-w-0 flex-1 flex-col">
            {children}
          </div>
        </div>
      ) : null}

      <div className="relative z-20 shrink-0">
        <HeroTicker reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}
