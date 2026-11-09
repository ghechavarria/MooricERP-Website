import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ContactModalProvider } from "./context/ContactModalContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProblemSection } from "./components/ProblemSection";
import { CapabilityRailSection } from "./components/CapabilityRailSection";
import { ConditionsSection, IncomeSection, IntakeSection } from "./components/ProductFeatureSections";
import { PipelineSection } from "./components/PipelineSection";
import { CentralLoanMemorySection } from "./components/CentralLoanMemorySection";
import { LOPersonalAssistantSection } from "./components/LOPersonalAssistantSection";
import { ClosedSection } from "./components/ClosedSection";
import { LosCompatibilityStrip } from "./components/LosCompatibilityStrip";
import { TeamSection } from "./components/TeamSection";
import { ContactCTA } from "./components/ContactCTA";
import { ContactFormModal } from "./components/ContactFormModal";
import { Footer } from "./components/Footer";
import { ROUTES } from "./config/signup";

// Signup pages are only registered, and only built into chunks, when the switch is on.
// The direct comparison lets Vite replace it with a constant and drop the dead imports.
const signupPages =
  import.meta.env.VITE_SIGNUP_ENABLED === "true"
    ? [
        { path: ROUTES.pricing, Page: lazy(() => import("./pages/PricingPage")) },
        { path: ROUTES.register, Page: lazy(() => import("./pages/RegisterPage")) },
        { path: ROUTES.account, Page: lazy(() => import("./pages/AccountPage")) },
        { path: ROUTES.checkoutReturn, Page: lazy(() => import("./pages/CheckoutReturnPage")) },
      ]
    : [];

// Terms of Use and Privacy Policy are always routed: signup links to them, and they
// stand on their own. Lazy, so they add nothing to the home page's bundle.
const legalPages = [
  { path: ROUTES.terms, Page: lazy(() => import("./pages/legal/TermsPage")) },
  { path: ROUTES.privacy, Page: lazy(() => import("./pages/legal/PrivacyPage")) },
];

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <CapabilityRailSection />
      <IntakeSection />
      <IncomeSection />
      <ConditionsSection />
      <PipelineSection />
      <CentralLoanMemorySection />
      <LOPersonalAssistantSection />
      <ClosedSection />
      <LosCompatibilityStrip />
      <ContactCTA />
    </>
  );
}

function TeamPage() {
  return (
    <>
      <TeamSection />
      <ContactCTA page="team" />
    </>
  );
}

export default function App() {
  return (
    <ContactModalProvider>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-white">
        <ScrollToHash />
        <Header />
        <main className="min-w-0 flex-1 overflow-x-clip">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/team" element={<TeamPage />} />
            {[...legalPages, ...signupPages].map(({ path, Page }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={null}>
                    <Page />
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </main>
        <Footer />
        <ContactFormModal />
      </div>
    </ContactModalProvider>
  );
}
