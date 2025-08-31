import Footer from "@/components/footer";
import LegalDocument from "@/components/legal-document";
import { privacyDoc } from "./content";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 pb-12 max-w-4xl pt-8">
        <LegalDocument doc={privacyDoc} />
      </main>
      <Footer />
    </div>
  );
}