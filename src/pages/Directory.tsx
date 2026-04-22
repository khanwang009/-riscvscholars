import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { Button } from "../components/ui";
import { institutions } from "../data/institutions";
import { researchLines } from "../data/researchLines";
import {
  claimStatusLabels,
  collaborationTypeLabels,
  type ClaimStatus,
  type CollaborationType,
} from "../types/profile";

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [collaborationFilter, setCollaborationFilter] = useState("All");
  const [claimFilter, setClaimFilter] = useState("All");
  const [openOnly, setOpenOnly] = useState(false);

  const countries = ["All", ...Array.from(new Set(institutions.map((item) => item.country)))];
  const claimStatuses: Array<"All" | ClaimStatus> = [
    "All",
    "unclaimed",
    "claim_requested",
    "claimed",
    "verified_update_pending",
  ];
  const collaborationTypes: Array<"All" | CollaborationType> = [
    "All",
    "joint_research",
    "joint_benchmark",
    "student_exchange",
    "workshop",
    "open_source_contribution",
  ];

  const filteredProfiles = institutions.filter((profile) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const searchHaystack = [
      profile.institutionName,
      profile.labName,
      profile.summary,
      profile.researchFocus,
      ...profile.projectKeywords,
      ...profile.representativeProjects,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedSearch.length === 0 || searchHaystack.includes(normalizedSearch);
    const matchesCountry = countryFilter === "All" || profile.country === countryFilter;
    const matchesArea =
      areaFilter === "All" || profile.researchAreas.includes(areaFilter);
    const matchesCollaboration =
      collaborationFilter === "All" ||
      profile.collaborationTypes.includes(collaborationFilter);
    const matchesClaim =
      claimFilter === "All" || profile.claimStatus === claimFilter;
    const matchesOpen = !openOnly || profile.acceptsRequests;

    return (
      matchesSearch &&
      matchesCountry &&
      matchesArea &&
      matchesCollaboration &&
      matchesClaim &&
      matchesOpen
    );
  });

  function clearFilters() {
    setSearchTerm("");
    setCountryFilter("All");
    setAreaFilter("All");
    setCollaborationFilter("All");
    setClaimFilter("All");
    setOpenOnly(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Seo
        title="Scholars & Labs | RISC-V Scholars"
        description="Explore overseas RISC-V academic institutions by country, research line, collaboration type, and claim status."
        pathname="/directory"
      />
      <div className="mb-10 border-b border-border pb-8">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">
          Scholars & Labs
        </div>
        <h1 className="text-4xl font-serif text-primary mb-4">
          Discover overseas RISC-V institutions with collaboration context.
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Filter by country, research line, collaboration format, claim state, and whether a
          profile currently accepts structured requests.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="border border-border bg-white p-5 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Search</label>
              <input
                type="text"
                placeholder="Institution, lab, project, research focus..."
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Country</label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={countryFilter}
                onChange={(event) => setCountryFilter(event.target.value)}
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Research line
              </label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={areaFilter}
                onChange={(event) => setAreaFilter(event.target.value)}
              >
                <option value="All">All</option>
                {researchLines.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.shortLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Collaboration type
              </label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={collaborationFilter}
                onChange={(event) => setCollaborationFilter(event.target.value)}
              >
                {collaborationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All" : collaborationTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Claim status
              </label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={claimFilter}
                onChange={(event) => setClaimFilter(event.target.value)}
              >
                {claimStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All" : claimStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(event) => setOpenOnly(event.target.checked)}
                className="w-4 h-4"
              />
              Show only profiles open to requests
            </label>

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </aside>

        <div className="flex-grow w-full">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-1">
                Results
              </div>
              <h2 className="text-2xl font-serif text-gray-900">
                {filteredProfiles.length} {filteredProfiles.length === 1 ? "profile" : "profiles"}
              </h2>
            </div>
            <p className="text-sm text-gray-600 max-w-xl">
              Profiles are built from public sources and then refined through claim and correction
              workflows.
            </p>
          </div>

          <div className="space-y-4">
            {filteredProfiles.map((profile) => {
              const areaLabels = researchLines
                .filter((line) => profile.researchAreas.includes(line.id))
                .map((line) => line.shortLabel);

              return (
                <article key={profile.slug} className="border border-border bg-white p-6">
                  <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-grow space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary mb-2">
                            {profile.country} / {profile.city} / {profile.institutionType}
                          </div>
                          <h3 className="text-2xl font-serif text-black">
                            <Link to={`/directory/${profile.slug}`} className="hover:text-primary">
                              {profile.labName}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{profile.institutionName}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-widest font-bold bg-surface-alt px-2 py-1">
                            {claimStatusLabels[profile.claimStatus]}
                          </span>
                          <span
                            className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 ${
                              profile.acceptsRequests
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {profile.acceptsRequests ? "Open to requests" : "Browse first"}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">{profile.summary}</p>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                            Research lines
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {areaLabels.map((label) => (
                              <span
                                key={label}
                                className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 border border-border"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                            Representative project
                          </div>
                          <p className="text-sm text-gray-700">{profile.representativeProjects[0]}</p>
                        </div>

                        <div>
                          <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                            Recommended format
                          </div>
                          <p className="text-sm text-gray-700">
                            {profile.collaborationTypes
                              .slice(0, 2)
                              .map((type) => collaborationTypeLabels[type])
                              .join(" / ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="xl:w-72 flex-shrink-0 border-t xl:border-t-0 xl:border-l border-dashed border-border pt-4 xl:pt-0 xl:pl-6 flex flex-col justify-between gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                          Intake note
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {profile.requestStatusNote}
                        </p>
                      </div>

                      <Link to={`/directory/${profile.slug}`}>
                        <button className="w-full py-2 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                          View profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredProfiles.length === 0 && (
              <div className="border border-dashed border-border bg-white text-center py-16 px-6">
                <h3 className="text-2xl font-serif mb-3">No profiles match the current filters.</h3>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                  Try clearing filters or broadening the collaboration format and research line
                  selections. The current archive is intentionally curated, not exhaustive.
                </p>
                <Button onClick={clearFilters}>Reset all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
