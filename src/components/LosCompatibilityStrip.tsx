export function LosCompatibilityStrip() {
  return (
    <aside
      id="los"
      className="mt-10 mb-10 flex flex-col items-center gap-5 sm:mt-12 sm:mb-0 sm:flex-row sm:justify-center sm:gap-8"
      aria-label="LOS compatibility"
    >
      <div className="glass-stamp" aria-hidden>
        <span className="glass-stamp__ring">
          MISMO
          <br />
          3.4
        </span>
      </div>
      <p className="max-w-xl text-center text-[15px] leading-relaxed text-organ-800 sm:text-left sm:text-base">
        Works alongside your existing LOS. Run your entire process in Mooric, then hand off a
        clean MISMO 3.4 file when it&apos;s time to submit. No migration, no rip-and-replace.
      </p>
    </aside>
  );
}
