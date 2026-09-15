export function LosCompatibilityStrip() {
  return (
    <aside className="v4-section--tight" aria-label="LOS compatibility">
      <div className="layout-shell">
        <div className="v4-rail v4-los-banner">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-erp" aria-hidden />
          <p className="m-0 text-[clamp(1.125rem,1.7vw,1.5rem)] font-semibold tracking-[-0.01em] text-[#0a2f6b] text-balance">
            Works alongside your existing LOS — no migration, no rip-and-replace
          </p>
        </div>
      </div>
    </aside>
  );
}
