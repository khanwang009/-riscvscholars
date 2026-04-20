import { Link } from "react-router-dom";
import { institutions } from "../data/institutions";
import { ArrowRight, BookOpen, Globe, ShieldCheck } from "lucide-react";

export default function Home() {
  const featured = institutions.slice(0, 3);

  return (
    <main className="grid grid-cols-1 md:grid-cols-12 min-h-[calc(100vh-65px)]">
      <section className="col-span-1 md:col-span-4 border-r border-border p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <h1 className="text-5xl leading-[0.95] tracking-tighter font-serif">
            Academic Gateway for Global Collaboration.
          </h1>
          <p className="text-sm leading-relaxed text-gray-600 max-w-xs">
            A curated archive of overseas RISC-V research labs. Facilitating structured collaboration requests and institutional profile management.
          </p>
          <div className="pt-4 space-y-3">
            <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-primary">
              <span className="w-4 h-[1px] bg-primary mr-2"></span>Research Directions
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-surface-alt text-[10px] font-medium">ISA Extension</span>
              <span className="px-2 py-1 bg-surface-alt text-[10px] font-medium">Security Arch</span>
              <span className="px-2 py-1 bg-surface-alt text-[10px] font-medium">AI Accelerators</span>
              <span className="px-2 py-1 bg-surface-alt text-[10px] font-medium">Formal Verification</span>
            </div>
          </div>
        </div>
        <div className="bg-primary p-6 text-white mt-12 md:mt-0">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-accent">Submit Collaboration</h3>
          <p className="text-xs opacity-80 mb-4">
            For Chinese laboratories seeking structured entry to international research ecosystems.
          </p>
          <Link to="/submit-request" className="block w-full">
            <button className="w-full py-3 bg-accent text-black text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Start Formal Request
            </button>
          </Link>
        </div>
      </section>

      <section className="col-span-1 md:col-span-8 flex flex-col h-full overflow-hidden">
        <div className="px-8 py-6 flex justify-between items-end border-b border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">Featured Institutions</span>
            <h2 className="text-2xl font-serif italic text-black">Scholars & Laboratories</h2>
          </div>
          <Link to="/directory" className="flex space-x-4 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline pb-1">
            View All Archives
          </Link>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 bg-border gap-[1px]">
          {featured.map((lab) => (
            <div key={lab.id} className="bg-white p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-mono px-2 py-0.5 font-bold uppercase ${
                      lab.claim_status === 'Claimed / Verified' ? 'bg-accent/20 text-primary' :
                      lab.claim_status === 'Claim requested' ? 'bg-primary text-white' :
                      'bg-surface-alt text-gray-500'
                    }`}>
                      {lab.claim_status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">REF-{lab.id.slice(0, 6).toUpperCase()}</span>
                  </div>
                  <h4 className="text-xl font-serif mt-2 leading-tight">
                    <Link to={`/directory/${lab.id}`} className="hover:text-primary">
                      {lab.institution}
                    </Link>
                  </h4>
                  <p className="text-[11px] uppercase tracking-tighter font-bold text-primary mt-1">
                    {lab.country} / {lab.institution_type}
                  </p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-start border-b border-dashed border-gray-200 pb-1 text-[11px]">
                    <span className="text-gray-500 italic pr-2">Direction</span>
                    <span className="font-medium text-right line-clamp-1">{lab.core_direction}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-dashed border-gray-200 pb-1 text-[11px]">
                    <span className="text-gray-500 italic pr-2">Mode</span>
                    <span className="font-bold uppercase text-primary text-right">{lab.recommended_page_mode.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between items-start text-[11px]">
                    <span className="text-gray-500 italic pr-2">Profile</span>
                    <span className="font-medium text-right line-clamp-1">{lab.profile_name}</span>
                  </div>
                </div>
              </div>
              <Link to={`/directory/${lab.id}`} className="mt-6 block">
                 <button className="w-full py-2 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                   View Lab Archive
                 </button>
              </Link>
            </div>
          ))}

          <div className="bg-surface-alt p-6 flex flex-col items-center justify-center text-center space-y-4 m-[1px]">
            <p className="text-xs font-serif italic text-gray-500">Are you a representative of a research institution?</p>
            <Link to="/claim-profile">
              <button className="px-6 py-2 bg-white border border-border text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors">
                Add Your Laboratory
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
