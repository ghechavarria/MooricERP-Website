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
  tone?: "bright" | "deep" | "teal";
  page?: "home" | "team";
}) {
  const { openContactModal } = useContactModal();

  return (
    <section
      id={sectionId}
      className={`section-marketing text-white ${tone === "teal" ? "bg-[#0053b5]" : tone === "deep" ? "bg-[#082F7C]" : "bg-erp"}`}
      aria-labelledby={headingId}
    >
      <div className="layout-shell flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-white/90 sm:text-base sm:tracking-[0.24em]">
            {page === "team" ? "The people behind it" : tone === "deep" ? "Your next step" : "Let's talk"}
          </p>
          <h2
            id={headingId}
            className="display-heading mt-5 text-white"
          >
            {page === "team"
              ? "Talk with the team — first month free."
              : tone === "deep"
                ? "See Mooric ERP on a real file — first month free."
                : "Get early access — first month free."}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
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
              tone === "bright"
                ? "rounded-md border-2 border-white bg-transparent px-10 py-5 text-base font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-erp sm:px-12 sm:py-5 sm:text-lg"
                : `rounded-md border-2 border-white bg-white px-10 py-5 text-base font-bold uppercase tracking-wide transition hover:bg-transparent hover:text-white sm:px-12 sm:py-5 sm:text-lg ${tone === "teal" ? "text-[#0053b5]" : "text-[#082F7C]"}`
            }
            onClick={() => openContactModal("walkthrough")}
          >
            {page === "team" ? "Get in touch" : tone === "deep" ? "Request a walkthrough" : "Get early access"}
          </button>
          <span className="text-center text-sm text-white/80 sm:text-left">
            Response within one business day
          </span>
        </div>
      </div>
    </section>
  );
}

