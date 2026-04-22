import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Seo from "../components/Seo";
import { Button, Card } from "../components/ui";
import { institutions } from "../data/institutions";
import { researchLines } from "../data/researchLines";
import { claimStatusLabels, collaborationTypeLabels } from "../types/profile";

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const profile = institutions.find((item) => item.slug === id);

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Seo
          title="Profile Not Found | RISC-V Scholars"
          description="The requested RISC-V institution profile could not be found in the current archive."
          pathname="/directory"
          robots="noindex,follow"
        />
        <h1 className="text-3xl font-serif mb-4">Profile not found</h1>
        <p className="text-gray-600 mb-6">
          The requested profile could not be located in the current archive.
        </p>
        <Link to="/directory">
          <Button>Back to directory</Button>
        </Link>
      </div>
    );
  }

  const areaDetails = researchLines.filter((line) =>
    profile.researchAreas.includes(line.id),
  );

  return (
    <div className="bg-surface-alt min-h-screen">
      <Seo
        title={`${profile.labName} | ${profile.institutionName} | RISC-V Scholars`}
        description={profile.summary}
        pathname={`/directory/${profile.slug}`}
      />
      <div className="bg-primary text-white border-b border-primary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <Link
            to="/directory"
            className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to directory
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-accent">
                  {profile.country} / {profile.city}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 border border-white/20">
                  {claimStatusLabels[profile.claimStatus]}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 border border-white/20">
                  {profile.institutionType}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-2">
                {profile.labName}
              </h1>
              <h2 className="text-xl md:text-2xl text-white/80">{profile.institutionName}</h2>
              <p className="mt-6 text-base text-white/85 leading-relaxed max-w-3xl">
                {profile.summary}
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 p-5 h-fit">
              <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-white/60 mb-4">
                Collaboration signal
              </div>
              <p className="text-sm text-white/85 leading-relaxed mb-4">
                {profile.requestStatusNote}
              </p>
              <div className="flex flex-col gap-3">
                {profile.acceptsRequests ? (
                  <Link to="/submit-request">
                    <button className="w-full py-3 bg-accent text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                      Request collaboration
                    </button>
                  </Link>
                ) : (
                  <div className="border border-white/20 p-3 text-sm text-white/80">
                    This profile is available for study and fit assessment, but not currently open
                    to general request intake.
                  </div>
                )}

                {profile.claimStatus !== "claimed" && (
                  <Link to="/claim-profile">
                    <button className="w-full py-3 border border-white text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-colors">
                      Claim this profile
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-serif text-primary mb-4">Research focus</h3>
              <p className="text-gray-800 leading-relaxed mb-6">{profile.researchFocus}</p>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-2">
                    Research lines
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areaDetails.map((line) => (
                      <span
                        key={line.id}
                        className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 border border-border bg-surface-alt"
                      >
                        {line.shortLabel}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-2">
                    Official website
                  </div>
                  <a
                    href={profile.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-2"
                  >
                    Visit site <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-serif text-primary mb-4">Representative outputs</h3>
              <div className="flex flex-wrap gap-3">
                {profile.representativeProjects.map((project) => (
                  <span
                    key={project}
                    className="px-3 py-2 border border-border bg-surface-alt text-sm font-medium"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-serif text-primary mb-4">
                Collaboration interests
              </h3>
              <div className="space-y-4">
                {profile.collaborationInterests.map((interest) => (
                  <div key={interest} className="border-l-2 border-accent pl-4 text-gray-700">
                    {interest}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-3">
                  Preferred collaboration types
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.collaborationTypes.map((type) => (
                    <span
                      key={type}
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-primary text-white"
                    >
                      {collaborationTypeLabels[type]}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="font-serif text-xl mb-4">Profile meta</h3>
              <div className="space-y-5 text-sm text-gray-700">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-1">
                    Claim status
                  </div>
                  <div>{claimStatusLabels[profile.claimStatus]}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-1">
                    Last updated
                  </div>
                  <div>{profile.lastUpdated}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-1">
                    Editorial note
                  </div>
                  <div>{profile.editorialNote}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl mb-4">Sources</h3>
              <ul className="space-y-3">
                {profile.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-2"
                    >
                      {source.label} <ExternalLink className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 leading-relaxed mt-4">
                Profiles are assembled from public documentation and can be corrected or claimed by
                verified institutional stewards.
              </p>
            </Card>

            <Card className="p-6 bg-surface">
              <h3 className="font-serif text-xl mb-3">Correction & claim path</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                If this profile is incomplete, outdated, or institutionally misaligned, use the
                claim flow to submit corrections and collaboration preferences.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/claim-profile">
                  <Button variant="outline" className="w-full">
                    Claim or correct profile
                  </Button>
                </Link>
                <Link to="/about#correction-policy" className="text-sm text-primary hover:underline">
                  View correction policy
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
