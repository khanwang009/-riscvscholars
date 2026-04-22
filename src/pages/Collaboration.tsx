import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileSearch, Send, ShieldCheck } from "lucide-react";
import Seo from "../components/Seo";
import { Button } from "../components/ui";

export default function Collaboration() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Seo
        title="Collaboration Flow | RISC-V Scholars"
        description="Understand how RISC-V Scholars builds public-source profiles, handles institution claims, and screens structured collaboration requests before introductions."
        pathname="/collaboration"
      />
      <div className="text-center mb-16">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3">
          Collaboration gateway
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
          A curated intake flow, not an open directory of inboxes.
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          The platform exists to move RISC-V academic collaboration from fragmented browsing into a
          source-based, structured, and low-noise request path.
        </p>
      </div>

      <div className="space-y-10">
        {[
          {
            icon: FileSearch,
            title: "1. How profiles are created",
            body: "Profiles are assembled from public institutional websites, open repositories, publications, and other sourceable material. They are meant to help Chinese labs understand the overseas institution before any approach is attempted.",
          },
          {
            icon: ShieldCheck,
            title: "2. How institutions claim and refine a profile",
            body: "Institutional representatives can submit a claim request, verify identity, and provide corrected or expanded collaboration information. Claiming is a stewardship workflow, not an open wiki edit.",
          },
          {
            icon: Send,
            title: "3. How Chinese labs submit requests",
            body: "Chinese labs do not receive raw contact data. They submit a structured request describing their organization, research focus, capabilities, target profile, and desired collaboration format.",
          },
        ].map((item) => (
          <section key={item.title} className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center text-primary">
              <item.icon className="w-6 h-6" />
            </div>
            <div className="border-b border-border pb-10">
              <h2 className="text-2xl font-serif mb-3">{item.title}</h2>
              <p className="text-gray-700 leading-relaxed">{item.body}</p>
            </div>
          </section>
        ))}

        <section className="bg-surface-alt border border-border p-8">
          <h2 className="text-2xl font-serif mb-4">When the platform advances an introduction</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "The request is concrete about collaboration goals and expected format.",
              "The applicant team demonstrates technical or institutional readiness.",
              "The request matches the overseas institution's stated collaboration signals.",
            ].map((criterion) => (
              <div key={criterion} className="bg-white border border-border p-4">
                <CheckCircle2 className="w-5 h-5 text-accent mb-3" />
                <p className="text-sm text-gray-700 leading-relaxed">{criterion}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border bg-white p-8">
          <h2 className="text-2xl font-serif mb-4">What the platform does not do</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "It is not a real-time messaging tool or community feed.",
              "It does not promise automatic matching or high-frequency manual brokerage.",
              "It is not a project management system for bilateral work after an introduction is made.",
              "It does not expose institutional contact information by default.",
            ].map((item) => (
              <div key={item} className="text-sm text-gray-700 leading-relaxed border-l-2 border-border pl-4">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/directory">
          <Button variant="outline" className="gap-2">
            Browse profiles <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/submit-request">
          <Button className="gap-2">
            Start a request <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
