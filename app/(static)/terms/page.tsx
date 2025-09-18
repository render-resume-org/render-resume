import Footer from "@/components/layout/footer";
import LegalDocument from "@/features/content/components/legal-document";
import { termsDoc } from "./content";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 pb-12 max-w-4xl pt-8">
        <LegalDocument doc={termsDoc} />
      </main>
      <Footer />
    </div>
  );
}