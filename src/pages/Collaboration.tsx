import { CheckCircle2, Search, Send, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui";

export default function Collaboration() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">A Curated Gateway, Not Just a Directory</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          RISC-V Scholars solves the "cold-start" problem in global academic partnerships by replacing unstructured outreach with clear signals and structured protocols.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">1. How We Profile Institutions</h2>
          </div>
          <div className="pl-14 border-l-2 border-border ml-5 space-y-4 text-gray-700">
            <p>
              We don't wait for institutions to sign up. Our platform actively indexes public archival data, academic publications, and open-source contributions to build baseline profiles.
            </p>
            <p>
              Each profile indicates whether the institution is a <strong>Collaboration-entry profile</strong> (strong, active signals for engaging new partners) or a <strong>Browse-first profile</strong> (for ecosystem reference mainly).
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">2. Claiming & Verification</h2>
          </div>
          <div className="pl-14 border-l-2 border-border ml-5 space-y-4 text-gray-700">
            <p>
              To prevent misrepresentation, overseas labs can <Link to="/claim-profile" className="text-primary hover:underline font-medium">Claim their Profile</Link>. This is not an open wiki edit. It is a verification request.
            </p>
            <p>
              Once verified, the institution officially signals its desired mode of collaboration and specifies the exact criteria for its ideal Chinese counterparts, ensuring it doesn't receive spam or misaligned requests.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
              <Send className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">3. Submitting a Collaboration Request</h2>
          </div>
          <div className="pl-14 border-l-2 border-border ml-5 space-y-4 text-gray-700">
            <p>
              Chinese labs browse the directory and find an overseas institution with aligned research targets. Instead of scraping a generic email address, they submit a structured proposal via our gateway.
            </p>
            <div className="bg-surface p-6 rounded border border-border mt-4">
              <h4 className="font-bold mb-2">Our Curation Focus:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" /> Intent clarity (e.g., source contribution vs. joint funding)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" /> Technical and institutional readiness</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" /> Alignment with the overseas lab's stated signals</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">4. Advancing to Bi-lateral Engagement</h2>
          </div>
          <div className="pl-14 border-l-2 border-border ml-5 space-y-4 text-gray-700">
            <p>
              If a request meets the curation criteria, the platform initiates a formal, structured initial contact with the claimed verified representative of the overseas lab.
            </p>
            <p>
              We function to filter noise, ensure professional academic standards, and respect the operational rhythm of both sides of the partnership.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-20 text-center">
        <Link to="/submit-request">
          <Button className="px-8 py-3 text-lg h-auto">Start a Collaboration Request</Button>
        </Link>
      </div>
    </div>
  );
}
