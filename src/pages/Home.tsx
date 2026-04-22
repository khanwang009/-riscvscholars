import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { institutions } from "../data/institutions";
import { researchLines } from "../data/researchLines";
import { claimStatusLabels } from "../types/profile";

export default function Home() {
  const featuredProfiles = institutions.slice(0, 3);
  const openProfiles = institutions.filter((profile) => profile.acceptsRequests).length;
  const claimedProfiles = institutions.filter(
    (profile) => profile.claimStatus === "claimed",
  ).length;

  return (
    <div className="bg-surface">
      <Seo
        title="RISC-V Scholars | Scholar-Facing Collaboration Gateway"
        description="Browse overseas RISC-V scholars and labs, understand research lines, and route structured collaboration requests through a curated cross-border academic gateway."
        pathname="/"
      />
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-primary">
                riscvscholars.org
              </div>
              <h1 className="text-5xl lg:text-7xl leading-[0.92] tracking-tight font-serif max-w-4xl">
                A cross-border gateway for RISC-V academic collaboration.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                We build source-based profiles of overseas RISC-V institutions, invite them to
                claim and refine those profiles, and route structured collaboration requests from
                Chinese labs through a curated intake instead of cold outreach.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/directory">
                <button className="px-6 py-3 bg-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
                  Browse Scholars & Labs
                </button>
              </Link>
              <Link to="/claim-profile">
                <button className="px-6 py-3 border border-primary text-primary text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                  Claim a Profile
                </button>
              </Link>
              <Link to="/submit-request">
                <button className="px-6 py-3 border border-border bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:border-primary transition-colors">
                  Submit a Collaboration Request
                </button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-white border border-border p-4">
                <div className="text-3xl font-serif text-primary">{institutions.length}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
                  Source-based profiles
                </div>
              </div>
              <div className="bg-white border border-border p-4">
                <div className="text-3xl font-serif text-primary">{openProfiles}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
                  Open to structured requests
                </div>
              </div>
              <div className="bg-white border border-border p-4">
                <div className="text-3xl font-serif text-primary">{claimedProfiles}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
                  Claimed or verified profiles
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border p-8 flex flex-col justify-between gap-8">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-3">
                Why this exists
              </div>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  Overseas labs are publicly visible but often hard to interpret from a Chinese
                  collaboration context.
                </p>
                <p>
                  Chinese labs need a faster way to judge fit, understand collaboration signals,
                  and submit a rigorous request.
                </p>
                <p>
                  The platform is not a mailing list or project system. It is a structured gateway
                  that reduces noise before a first bilateral conversation.
                </p>
              </div>
            </div>

            <div className="bg-surface-alt border border-border p-5">
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary mb-3">
                Source transparency
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Every profile starts from public sources, carries an update timestamp, and exposes a
                correction or claim path for institutional stewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">
                Featured scholars & labs
              </div>
              <h2 className="text-3xl font-serif">Profiles designed for judgment, not noise.</h2>
            </div>
            <Link to="/directory" className="text-sm text-primary hover:underline flex items-center gap-2">
              View all profiles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-[1px] bg-border md:grid-cols-3">
            {featuredProfiles.map((profile) => (
              <article key={profile.slug} className="bg-white p-6 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold">
                      {profile.country} / {profile.city}
                    </div>
                    <h3 className="font-serif text-2xl mt-2">{profile.labName}</h3>
                    <p className="text-sm text-gray-600">{profile.institutionName}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-surface-alt px-2 py-1">
                    {claimStatusLabels[profile.claimStatus]}
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">{profile.summary}</p>

                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Collaboration interests
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {profile.collaborationInterests.slice(0, 2).map((interest) => (
                      <li key={interest} className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{interest}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/directory/${profile.slug}`} className="mt-auto">
                  <button className="w-full py-2 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    View profile
                  </button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">
              Collaboration how-it-works
            </div>
            <h2 className="text-3xl font-serif mb-4">Structured intake replaces scattershot outreach.</h2>
            <p className="text-gray-600 leading-relaxed">
              The first version of the platform is deliberately narrow: profile discovery, claim
              and correction, and curated request submission. That keeps operations light and makes
              the first bilateral meeting the real output.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "1. Public-source profiling",
                text: "We start with public institutional material and shape it into a profile that a Chinese lab can quickly understand.",
              },
              {
                title: "2. Claim and refine",
                text: "Institutional representatives can claim a profile, verify updates, and define preferred collaboration pathways.",
              },
              {
                title: "3. Curated request routing",
                text: "Chinese labs submit a structured request. The platform screens it before deciding whether to advance an introduction.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-border p-5">
                <div className="font-serif text-xl mb-3">{item.title}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">
                Featured research lines
              </div>
              <h2 className="text-3xl font-serif">A shared taxonomy for browsing and filtering.</h2>
            </div>
            <Link to="/research-lines" className="text-sm text-primary hover:underline flex items-center gap-2">
              Explore taxonomy <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {researchLines.map((line) => (
              <div key={line.id} className="border border-border p-5 bg-surface-alt">
                <div className="font-serif text-xl mb-3">{line.shortLabel}</div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{line.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {line.signals.map((signal) => (
                    <span
                      key={signal}
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white border border-border"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-8 lg:grid-cols-2">
          <div className="border border-border bg-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500">
                For overseas institutions
              </div>
            </div>
            <h3 className="font-serif text-2xl mb-3">Claim your profile and shape the signal.</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              Verified institutional stewards can clarify research focus, indicate whether requests
              are welcome, and steer Chinese labs toward the right collaboration format.
            </p>
            <Link to="/claim-profile">
              <button className="px-6 py-3 border border-primary text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                Start a claim request
              </button>
            </Link>
          </div>

          <div className="border border-border bg-primary text-white p-8">
            <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-accent mb-4">
              For Chinese labs
            </div>
            <h3 className="font-serif text-2xl mb-3">Submit a high-signal collaboration request.</h3>
            <p className="text-sm leading-relaxed text-white/85 mb-6">
              The goal is not to expose inboxes. The goal is to package your research intent,
              capabilities, and requested format clearly enough that the platform can judge whether
              a first bilateral call is warranted.
            </p>
            <Link to="/submit-request">
              <button className="px-6 py-3 bg-accent text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                Prepare request
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
