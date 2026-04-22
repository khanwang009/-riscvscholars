import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { institutions } from "../data/institutions";
import { researchLines } from "../data/researchLines";

export default function ResearchLines() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Seo
        title="Research Lines | RISC-V Scholars"
        description="Review the research-line taxonomy used across the RISC-V Scholars archive, including HPC, vector systems, agile hardware, edge AI, and open platforms."
        pathname="/research-lines"
      />
      <div className="mb-12 border-b border-border pb-8">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3">
          Shared taxonomy
        </div>
        <h1 className="text-4xl font-serif text-primary mb-4">
          Research lines used throughout the archive.
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          These categories are the same source of truth used by profile pages and the directory
          filters. They exist to make fit judgment faster, not to simulate a full academic ontology.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {researchLines.map((line) => {
          const matchingProfiles = institutions.filter((profile) =>
            profile.researchAreas.includes(line.id),
          );

          return (
            <section key={line.id} className="border border-border bg-white p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary mb-2">
                    {line.shortLabel}
                  </div>
                  <h2 className="text-2xl font-serif mb-3">{line.label}</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{line.summary}</p>
                </div>
                <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500">
                  {matchingProfiles.length} profiles
                </div>
              </div>

              <div className="mb-5">
                <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-2">
                  Typical signals
                </div>
                <div className="flex flex-wrap gap-2">
                  {line.signals.map((signal) => (
                    <span
                      key={signal}
                      className="px-2 py-1 border border-border bg-surface-alt text-[10px] uppercase tracking-widest font-bold"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-2">
                  Example institutions
                </div>
                <div className="space-y-2">
                  {matchingProfiles.map((profile) => (
                    <Link
                      key={profile.slug}
                      to={`/directory/${profile.slug}`}
                      className="block border border-border px-4 py-3 hover:border-primary transition-colors"
                    >
                      <div className="font-medium text-black">{profile.labName}</div>
                      <div className="text-sm text-gray-600">
                        {profile.institutionName} / {profile.country}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
