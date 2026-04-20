export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-primary mb-12 border-b border-border pb-6">
        About & Editorial Policy
      </h1>

      <div className="space-y-12 text-gray-800 leading-relaxed">
        
        <section>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Our Identity</h2>
          <p className="mb-4">
            <strong>RISC-V Scholars</strong> is a scholar-facing gateway designed specifically to facilitate transparent, structured, and mutually beneficial research collaborations between overseas RISC-V academic institutions and Chinese laboratories.
          </p>
          <p>
            We are not a news portal, nor a generic directory of contacts. We are a curation and matchmaking platform that values academic alignment, structural integration, and the preservation of academic integrity in cross-border engagements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Editorial Principles</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>Public-First Archiving:</strong> Initial profiles on this platform are constructed purely from public sources, transparent institutional sites, published papers, and public repositories (e.g., GitHub). We provide source attribution for all unclaimed profiles.
            </li>
            <li>
              <strong>Institutional Autonomy:</strong> The platform explicitly supports a "Claim Profile" mechanism. Overseas labs have the absolute right to claim their representation, clarify their collaboration signals, modify their structural parameters, or opt-out entirely.
            </li>
            <li>
              <strong>Curated Routing:</strong> We do not expose institutional direct emails to raw traffic. All incoming collaboration requests from Chinese entities are processed through our structured forms and assessed for viability before any introduction is made.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Correction & Takedown Policy</h2>
          <p className="mb-4">
            If you are affiliated with an institution listed on this platform and believe our archival data is misrepresentative, out-of-date, or you simply wish to remove the profile, please contact our editorial team.
          </p>
          <p>
            Corrections can be made automatically by utilizing the <a href="/claim-profile" className="text-primary hover:underline font-medium">Claim Profile</a> system to establish verified stewardship.
          </p>
        </section>

      </div>
    </div>
  );
}
