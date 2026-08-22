import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ContactModalProvider } from "./context/ContactModalContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductionGlanceSection } from "./components/ProductionGlanceSection";
import { ProblemSection } from "./components/ProblemSection";
import { Features } from "./components/Features";
import { PipelineSection } from "./components/PipelineSection";
import { CentralLoanMemorySection } from "./components/CentralLoanMemorySection";
import { LOPersonalAssistantSection } from "./components/LOPersonalAssistantSection";
import { BrokerProcessFlowSection } from "./components/BrokerProcessFlowSection";
import { TeamSection } from "./components/TeamSection";
import { ContactCTA } from "./components/ContactCTA";
import { ContactFormModal } from "./components/ContactFormModal";
import { Footer } from "./components/Footer";

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
      <ProductionGlanceSection />
      <ProblemSection />
      <ContactCTA sectionId="early-access" headingId="early-access-heading" tone="bright" />
      <Features />
      <PipelineSection />
      <CentralLoanMemorySection />
      <LOPersonalAssistantSection />
      <BrokerProcessFlowSection />
      <ContactCTA />
    </>
  );
}

function TeamPage() {
  return (
    <>
      <TeamSection />
      <ContactCTA page="team" tone="teal" />
    </>
  );
}

export default function App() {
  return (
    <ContactModalProvider>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-organ-50">
        <ScrollToHash />
        <Header />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </main>
        <Footer />
        <ContactFormModal />
      </div>
    </ContactModalProvider>
  );
}
