import { useContactModal } from "../context/ContactModalContext";
import { SHOW_CONTACT_ACTIONS } from "../config/contactActions";

export function HeroCopy({ headingId = "hero-heading" }: { headingId?: string }) {
  const { openContactModal } = useContactModal();

  return (
    <div>
      <span className="inline-flex items-center gap-2.5 rounded-full border border-[#d3e2fb] bg-white px-[15px] py-1.5 text-[12.5px] font-medium text-[#0060d6]">
        <span className="v4-dot h-1.5 w-1.5 shrink-0 rounded-full bg-erp" aria-hidden />
        Built for independent loan officers &amp; brokers
      </span>
      <h1 id={headingId} className="v4-h1">
        <span className="block">Less Chasing.</span>
        <span className="block">More Closings.</span>
      </h1>
      <p className="v4-lead" style={{ fontSize: "1.15625rem", lineHeight: 1.62, marginTop: "1.625rem" }}>
        Mooric ERP runs the whole broker-side file — intake, income, conditions, closing dates — from
        one workspace that remembers everything it has already learned about the borrower.
      </p>
      <div className="mt-[34px] flex flex-wrap items-center gap-3.5">
        <button
          type="button"
          className={`v4-btn v4-btn--primary${SHOW_CONTACT_ACTIONS ? "" : " hidden"}`}
          onClick={() => openContactModal("briefing")}
        >
          Book a demo
        </button>
        <a href="#capabilities" className="v4-btn v4-btn--ghost">
          See what it does →
        </a>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-x-6 gap-y-5 border-t border-[#e4ebf4] pt-8 max-[479px]:grid-cols-1">
        <div>
          <p className="m-0 text-[26px] font-bold tracking-[-0.02em] text-[#0a0e14]">~1 hr</p>
          <p className="mt-1.5 text-[13.5px] text-[#55637a]">saved per file on structuring</p>
        </div>
        <div>
          <p className="m-0 text-[26px] font-bold tracking-[-0.02em] text-[#0a0e14]">1003</p>
          <p className="mt-1.5 text-[13.5px] text-[#55637a]">auto-filled from documents</p>
        </div>
        <div>
          <p className="m-0 text-[26px] font-bold tracking-[-0.02em] text-[#0a0e14]">0</p>
          <p className="mt-1.5 text-[13.5px] text-[#55637a]">spreadsheets to maintain</p>
        </div>
      </div>
    </div>
  );
}
