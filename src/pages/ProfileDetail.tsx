import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, ShieldCheck, Mail, BookOpen } from "lucide-react";
import { institutions } from "../data/institutions";
import { Badge, Button, Card } from "../components/ui";

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const profile = institutions.find(i => i.id === id);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Profile Not Found</h1>
        <Link to="/directory">
          <Button>Back to Directory</Button>
        </Link>
      </div>
    );
  }

  const isCollabEntry = profile.recommended_page_mode === 'Collaboration-entry profile';

  return (
    <div className="bg-surface-alt min-h-screen pb-20">
      {/* Header / Hero */}
      <div className="bg-primary text-white border-b border-primary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <Link to="/directory" className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-accent tracking-widest uppercase">
                  {profile.country} &bull; {profile.institution_type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${
                  isCollabEntry ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-white/60 border-white/20'
                }`}>
                  {profile.recommended_page_mode}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2">
                {profile.institution}
              </h1>
              <h2 className="text-2xl font-light text-white/90">
                {profile.profile_name}
              </h2>
            </div>
            
            <div className="bg-primary/20 border border-primary/30 p-4 md:w-64 flex-shrink-0">
              <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-2">Verification Status</div>
              <div className="flex items-center gap-2 mb-4">
                {profile.claim_status === 'Claimed / Verified' && <ShieldCheck className="w-5 h-5 text-accent" />}
                <span className="font-bold text-white font-mono text-sm uppercase">{profile.claim_status}</span>
              </div>
              {profile.claim_status !== 'Claimed / Verified' && (
                <Link to="/claim-profile">
                  <button className="w-full text-[10px] uppercase tracking-widest font-bold py-2 border border-white text-white hover:bg-white hover:text-primary transition-colors">
                    Claim this profile
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
              <h3 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent font-bold" /> Summary & Research Line
              </h3>
              <p className="text-gray-800 leading-relaxed font-medium text-lg mb-6">
                {profile.core_direction}
              </p>
              
              <div className="border-t border-border pt-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Representative Projects</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.representative_projects.map((proj, idx) => (
                    <span key={idx} className="bg-surface-alt px-3 py-1.5 text-sm text-gray-800 font-bold font-mono border border-border">
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-8 border-l-4 border-l-primary">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Collaboration Gate</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Collaboration Signal</h4>
                  <p className="text-gray-800">{profile.collaboration_signal}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pathways to Participation</h4>
                  <p className="text-gray-800">{profile.participation_path}</p>
                </div>

                {isCollabEntry && (
                  <div className="bg-surface-alt border border-dashed border-border p-6 mt-6">
                    <h4 className="font-serif font-bold text-black mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Ready to engage?
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Submit a structured collaboration proposal. We curate and ensure alignment before initiating contact with the institution.
                    </p>
                    <Link to="/submit-request">
                      <Button>Submit Request to this Lab</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column (Metadata) */}
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="font-serif font-bold text-gray-900 mb-4 border-b border-border pb-2">Institutional Match</h3>
              
              <div className="mb-5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Best Fit Chinese Partner Types</h4>
                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                  {profile.best_fit_cn_partner_types.map((type, i) => <li key={i}>{type}</li>)}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ecosystem Role / Stewardship</h4>
                <p className="text-sm text-gray-800">{profile.support_or_stewardship_signal}</p>
              </div>
            </Card>

            <Card className="p-6 bg-surface">
              <h3 className="font-serif font-bold text-gray-900 mb-4 border-b border-border pb-2">Platform Meta</h3>
              
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Editorial Note</h4>
                <p className="text-sm text-gray-700 italic border-l-2 border-accent pl-3">
                  {profile.editorial_note}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Public Sources</h4>
                <ul className="space-y-2">
                  {profile.sources.map((src, i) => (
                    <li key={i}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        {src.name} <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  This profile was assembled from public documentation to facilitate structured global collaboration mapping.
                </p>
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
