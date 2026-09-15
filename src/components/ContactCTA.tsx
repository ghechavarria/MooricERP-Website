import { motion } from "framer-motion";
import { useContactModal } from "../context/ContactModalContext";
import { SHOW_CONTACT_ACTIONS } from "../config/contactActions";

export function ContactCTA({
  sectionId = "contact",
  headingId = "cta-heading",
  page = "home",
}: {
  sectionId?: string;
  headingId?: string;
  page?: "home" | "team";
}) {
  const { openContactModal } = useContactModal();

  return (
    <section id={sectionId} className="v4-section--cta" aria-labelledby={headingId}>
      <div className="layout-shell">
        <motion.div
          className="v4-rail v4-cta-band"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="m-0 font-mono text-[11.5px] uppercase tracking-[0.2em] text-[#c3ddff]">
              {page === "team" ? "The people behind it" : "Your next step"}
            </p>
            <h2
              id={headingId}
              className="mt-[18px] max-w-[20em] text-[clamp(1.75rem,3vw,2.625rem)] font-bold leading-[1.14] tracking-[-0.025em] text-white text-balance"
            >
              {page === "team" ? "Talk with the team" : "See Mooric ERP in Action"}
            </h2>
            <p className="mt-5 max-w-[34em] text-[17px] leading-[1.65] text-[#dce9ff] text-pretty">
              {page === "team"
                ? "Questions about Mooric, how we work with independent LOs, or getting on early access? Leave your info — we'll follow up personally."
                : "Walk through a loan with Mooric and see how intake, income, conditions, documents, and closing come together — all in one place"}
            </p>
          </div>
          <div className={`flex flex-col items-center gap-3${SHOW_CONTACT_ACTIONS ? "" : " hidden"}`}>
            <button
              type="button"
              className="inline-flex items-center whitespace-nowrap rounded-[7px] bg-white px-[38px] py-[18px] text-[15.5px] font-semibold text-[#0a3fae] transition hover:bg-[#f4f8ff]"
              onClick={() => openContactModal("walkthrough")}
            >
              {page === "team" ? "Get in touch" : "Book a demo"}
            </button>
            <span className="text-[13px] text-[#c3ddff]">Response within one business day</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
