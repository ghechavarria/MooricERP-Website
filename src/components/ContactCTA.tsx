import { motion } from "framer-motion";
import { useContactModal } from "../context/ContactModalContext";
import { SHOW_CONTACT_ACTIONS } from "../config/contactActions";

export function ContactCTA({
  sectionId = "contact",
  headingId = "cta-heading",
  tone = "deep",
  page = "home",
}: {
  sectionId?: string;
  headingId?: string;
  tone?: "bright" | "deep" | "silver";
  page?: "home" | "team";
}) {
  const { openContactModal } = useContactModal();

  return (
    <section
      id={sectionId}
      className={`section-marketing ${tone === "silver" ? "bg-accent text-[#082F7C]" : tone === "deep" ? "bg-[#082F7C] text-white" : "bg-erp text-white"}`}
      aria-labelledby={headingId}
    >
      <div className="layout-shell flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className={`font-mono text-sm uppercase tracking-[0.22em] sm:text-base sm:tracking-[0.24em] ${tone === "silver" ? "text-[#082F7C]/80" : "text-white/90"}`}>
            {page === "team" ? "The people behind it" : tone === "deep" ? "Your next step" : "Let's talk"}
          </p>
          <h2
            id={headingId}
            className={`display-heading mt-5 ${tone === "silver" ? "text-[#082F7C]" : "text-white"}`}
          >
            {page === "team"
              ? "Talk with the team — first month free."
              : tone === "deep"
                ? "See Mooric ERP on a real file — first month free."
                : "Get early access — first month free."}
          </h2>
          <p className={`mt-6 max-w-xl text-lg leading-relaxed sm:text-xl ${tone === "silver" ? "text-[#082F7C]/90" : "text-white/90"}`}>
            {page === "team"
              ? "Questions about Mooric, how we work with independent LOs, or getting on early access? Leave your info — we'll follow up personally."
              : tone === "deep"
                ? "You've seen the stages. If one workspace from prospect to closed sounds right, leave your info — we'll follow up personally."
                : "Interested in one workspace for the entire broker-side process? Leave your info and we'll reach out personally."}
          </p>
        </motion.div>
        <div className={`flex shrink-0 flex-col gap-4${SHOW_CONTACT_ACTIONS ? "" : " hidden"}`}>
          <button
            type="button"
            className={
              tone === "silver"
                ? "rounded-md border-2 border-[#082F7C] bg-[#082F7C] px-10 py-5 text-base font-bold uppercase tracking-wide text-white transition hover:bg-transparent hover:text-[#082F7C] sm:px-12 sm:py-5 sm:text-lg"
                : "rounded-md border-2 border-white bg-white px-10 py-5 text-base font-bold uppercase tracking-wide text-[#082F7C] transition hover:bg-transparent hover:text-white sm:px-12 sm:py-5 sm:text-lg"
            }
            onClick={() => openContactModal("walkthrough")}
          >
            {page === "team" ? "Get in touch" : tone === "deep" ? "Request a walkthrough" : "Get early access"}
          </button>
          <span className={`text-center text-sm sm:text-left ${tone === "silver" ? "text-[#082F7C]/70" : "text-white/80"}`}>
            Response within one business day
          </span>
        </div>
      </div>
    </section>
  );
}

