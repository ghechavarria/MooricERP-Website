import { useContactModal } from "../context/ContactModalContext";
import { SHOW_CONTACT_ACTIONS } from "../config/contactActions";

/**
 * Site-matched hero copy. Type + spacing scale continuously with column
 * width (`.hero-copy` in index.css) so slow resizes stay smooth.
 */
export function HeroCopy({
  headingId = "hero-heading",
  className = "",
  align = "left",
  mode = "full",
}: {
  headingId?: string;
  className?: string;
  align?: "left" | "center";
  mode?: "full" | "lead" | "support";
}) {
  const { openContactModal } = useContactModal();

  return (
    <div
      className={`hero-copy${align === "center" ? " hero-copy--center" : ""}${
        mode === "support" ? " hero-copy--support" : ""
      }${mode === "lead" ? " hero-copy--lead" : ""} ${className}`.trim()}
    >
      {mode === "full" || mode === "lead" ? (
        <>
          {mode === "full" ? (
            <p className="hero-copy__badge">
              <span className="hero-copy__badge-dot" aria-hidden />
              <span>AI-powered · built for independent loan officers</span>
            </p>
          ) : null}

          <h1 id={headingId} className="hero-copy__headline">
            <span className="hero-copy__headline-line">Intelligent mortgage platform</span>
            <span className="hero-copy__headline-accent">Empowering better closings</span>
          </h1>
          {mode === "lead" ? (
            <p className="hero-copy__badge">
              <span className="hero-copy__badge-dot" aria-hidden />
              <span>AI-powered · built for independent loan officers</span>
            </p>
          ) : null}
        </>
      ) : null}

      {mode !== "lead" ? (
        <>
          <div className={mode === "support" ? "hero-copy__cluster" : undefined}>
            {mode === "support" ? (
              <h2 className="hero-copy__headline hero-copy__headline--tag">
                <span className="hero-copy__headline-line">Less chasing paperwork</span>
                <span className="hero-copy__headline-accent">More time closing loans</span>
              </h2>
            ) : null}

            <p className="hero-copy__body">
              You did not get into this business to re-enter borrower data or update five spreadsheets
              before your first coffee. Mooric ERP builds a Central Loan Memory of every file and
              handles that overhead — you focus on advising borrowers and closing.
            </p>
          </div>

          <nav className="hero-copy__actions" aria-label="Hero actions">
            <button
              type="button"
              className={`btn-primary-silver hero-copy__btn${SHOW_CONTACT_ACTIONS ? "" : " hidden"}`}
              onClick={() => openContactModal("briefing")}
            >
              Get early access — first month free
            </button>
            <a href="#features" className="hero-copy__btn hero-copy__btn--ghost">
              See why it&apos;s different
              <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </>
      ) : null}
    </div>
  );
}
