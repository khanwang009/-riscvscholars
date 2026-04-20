import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { institutions, PageMode } from "../data/institutions";
import { Badge, Button, Card } from "../components/ui";

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");

  const countries = ["All", ...Array.from(new Set(institutions.map(i => i.country)))];
  
  const filtered = institutions.filter(inst => {
    const matchesSearch = inst.institution.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.core_direction.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = countryFilter === "All" || inst.country === countryFilter;
    const matchesMode = modeFilter === "All" || inst.recommended_page_mode === modeFilter;

    return matchesSearch && matchesCountry && matchesMode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Scholars & Labs Directory</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Browse our curated archive of overseas RISC-V academic institutions, research labs, and open-source foundation nodes. 
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" /> Search
            </label>
            <input 
              type="text"
              placeholder="Keywords, labs, fields..."
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter by Country
            </label>
            <select 
              className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black uppercase tracking-wider text-[10px] font-bold"
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Page Mode</label>
            <div className="space-y-2">
              {["All", "Collaboration-entry profile", "Browse-first profile"].map(mode => (
                <label key={mode} className="flex items-center gap-2 text-sm text-gray-700">
                  <input 
                    type="radio" 
                    name="modeFilter" 
                    checked={modeFilter === mode}
                    onChange={() => setModeFilter(mode)}
                    className="text-primary focus:ring-primary"
                  />
                  {mode.replace(' profile', '')}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-grow w-full">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-gray-900">
              {filtered.length} {filtered.length === 1 ? 'Result' : 'Results'}
            </h2>
          </div>

            <div className="space-y-4 bg-border p-[1px]">
            {filtered.map(inst => (
              <div key={inst.id} className="bg-white p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                         <h3 className="text-xl font-bold font-serif text-black leading-tight">
                           <Link to={`/directory/${inst.id}`} className="hover:text-primary">
                             {inst.institution}
                           </Link>
                         </h3>
                         <p className="text-[11px] uppercase tracking-tighter font-bold text-primary mt-1">
                           {inst.country} / {inst.institution_type}
                         </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-surface-alt px-2 py-0.5 text-gray-500 uppercase">{inst.recommended_page_mode.split(' ')[0]}</span>
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-4">{inst.profile_name}</p>
                    
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Core Direction</div>
                      <p className="text-sm text-gray-800">{inst.core_direction}</p>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Collaboration Signal</div>
                      <p className="text-sm text-gray-600 line-clamp-2">{inst.collaboration_signal}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-48 flex-shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-dashed border-border pt-4 md:pt-0 md:pl-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 font-bold uppercase inline-block mb-4 ${
                      inst.claim_status === 'Claimed / Verified' ? 'bg-accent/20 text-primary' :
                      inst.claim_status === 'Claim requested' ? 'bg-primary text-white' :
                      'bg-surface-alt text-gray-500'
                    }`}>
                      {inst.claim_status}
                    </span>
                    </div>
                    <Link to={`/directory/${inst.id}`}>
                      <button className="w-full py-2 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        View Archive
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white border border-border border-dashed">
                <p className="text-gray-500 mb-4">No institutions found matching your criteria.</p>
                <Button variant="outline" onClick={() => { setSearchTerm(""); setCountryFilter("All"); setModeFilter("All"); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
