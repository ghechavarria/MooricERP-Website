import { ROUTES } from "../../config/signup";
import { LegalPage } from "./LegalPage";
import { TERMS } from "./termsContent";

/** /terms */
export default function TermsPage() {
  return <LegalPage doc={TERMS} testId="page-terms" other={{ to: ROUTES.privacy, label: "Privacy Policy" }} />;
}
