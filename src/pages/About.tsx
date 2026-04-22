import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Seo
        title="About, Source Policy & Correction Path | RISC-V Scholars"
        description="Read the editorial policy, source policy, and correction path behind the RISC-V Scholars archive and collaboration gateway."
        pathname="/about"
      />
      <div className="mb-12 border-b border-border pb-8">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3">
          About & policy
        </div>
        <h1 className="text-4xl font-serif text-primary mb-4">
          Editorial rules for a low-ops, source-based gateway.
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          RISC-V Scholars is designed to be credible before it becomes large. The platform is
          intentionally opinionated about source quality, correction paths, and how collaboration
          requests should flow.
        </p>
      </div>

      <div className="space-y-12 text-gray-800 leading-relaxed">
        <section id="explainer">
          <h2 className="text-2xl font-serif mb-4">Platform identity</h2>
          <p className="mb-4">
            The platform is a scholar-facing collaboration gateway for overseas RISC-V institutions
            and Chinese laboratories. It is neither a news portal nor an open academic social
            graph.
          </p>
          <p>
            The intended output of the first phase is simple: a smaller number of better bilateral
            first conversations.
          </p>
        </section>

        <section id="source-policy">
          <h2 className="text-2xl font-serif mb-4">Source policy</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              Every profile begins from public sources such as institutional websites, public code
              repositories, and discoverable academic material.
            </li>
            <li>
              Source links and a last-updated field should be visible on profile pages so users can
              judge freshness and provenance.
            </li>
            <li>
              The site favors structured fields over broad editorial claims whenever a judgment can
              be grounded in sourceable evidence.
            </li>
          </ul>
        </section>

        <section id="editorial-policy">
          <h2 className="text-2xl font-serif mb-4">Editorial policy</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              The platform prioritizes overseas institutional clarity and control before growth or
              traffic expansion.
            </li>
            <li>
              Profiles are written to help Chinese labs understand fit, not to maximize promotional
              language.
            </li>
            <li>
              We do not claim private access, guaranteed introductions, or automated matchmaking
              capability.
            </li>
          </ul>
        </section>

        <section id="correction-policy">
          <h2 className="text-2xl font-serif mb-4">Correction and takedown path</h2>
          <p className="mb-4">
            Institutions that believe a profile is outdated, incomplete, or misrepresentative
            should use the claim flow to submit verified corrections or request changes.
          </p>
          <p className="mb-4">
            Corrections are reviewed as part of stewardship, not as anonymous edits. This keeps the
            archive structured and reduces the risk of low-trust profile drift.
          </p>
          <Link to="/claim-profile" className="text-primary hover:underline font-medium">
            Go to claim and correction intake
          </Link>
        </section>

        <section id="non-goals">
          <h2 className="text-2xl font-serif mb-4">What this version intentionally avoids</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>Login systems, private inboxes, or member dashboards.</li>
            <li>Project management workflows after an introduction is made.</li>
            <li>Large-scale social or community features.</li>
            <li>Automatic recommendation engines without human screening.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
