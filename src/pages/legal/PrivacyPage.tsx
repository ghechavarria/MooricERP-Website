import { ROUTES } from "../../config/signup";
import { LegalPage } from "./LegalPage";
import { PRIVACY } from "./privacyContent";

/** /privacy */
export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} testId="page-privacy" other={{ to: ROUTES.terms, label: "Terms of Use" }} />;
}
