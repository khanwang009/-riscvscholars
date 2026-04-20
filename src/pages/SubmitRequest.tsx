import { ArrowRight, Info } from "lucide-react";
import { Button, Card } from "../components/ui";

export default function SubmitRequest() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Structured Collaboration Request</h1>
        <p className="text-lg text-gray-600">
          Initiate a partnership, research alignment, or joint contribution with an overseas RISC-V institution.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded mb-10 flex gap-3 text-sm text-gray-800">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p>
          <strong>Privacy & Process Notice:</strong> Submitting this request does not automatically expose your contact information to the target lab. Our internal board curates all applications for viability and alignment before mediating an introduction.
        </p>
      </div>

      <Card className="p-8">
        <form className="space-y-8" onSubmit={e => e.preventDefault()}>
          
          {/* Section 1 */}
          <section>
            <h3 className="font-serif font-bold text-xl border-b border-border pb-2 mb-6">1. Applicant Lab / Organization</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Organization Name</label>
                  <input type="text" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Applicant Type</label>
                  <select className="w-full border border-border bg-white rounded px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option>Academic Research Lab</option>
                    <option>National Research Institute</option>
                    <option>Hardware Start-up (Pre-Silicon)</option>
                    <option>Enterprise / Tech Hub</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Principal Contact Name</label>
                  <input type="text" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Official Email Address</label>
                  <input type="email" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Capability Summary</label>
                <textarea rows={3} className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none placeholder-gray-400" placeholder="Briefly describe your lab's primary capabilities, specializations, and current standing in the ecosystem."></textarea>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="font-serif font-bold text-xl border-b border-border pb-2 mb-6">2. Collaboration Proposal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Target Overseas Institution / Profile</label>
                <input type="text" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. PULP Platform (ETH Zurich)" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Format of Collaboration</label>
                <div className="grid sm:grid-cols-2 gap-2 mt-2">
                  <label className="flex items-center gap-2 text-sm border p-3 rounded hover:bg-surface-alt cursor-pointer transition-colors">
                    <input type="checkbox" className="text-primary" /> Open-Source IP Contribution
                  </label>
                  <label className="flex items-center gap-2 text-sm border p-3 rounded hover:bg-surface-alt cursor-pointer transition-colors">
                    <input type="checkbox" className="text-primary" /> Joint Research Publication
                  </label>
                  <label className="flex items-center gap-2 text-sm border p-3 rounded hover:bg-surface-alt cursor-pointer transition-colors">
                    <input type="checkbox" className="text-primary" /> Visiting Scholar / Exchange
                  </label>
                  <label className="flex items-center gap-2 text-sm border p-3 rounded hover:bg-surface-alt cursor-pointer transition-colors">
                    <input type="checkbox" className="text-primary" /> Industrial & Standards Alignment
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Collaboration Goal & Thesis</label>
                <textarea rows={5} className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Why is this partnership necessary? What specific resources or outcomes do you bring to the table?"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Evidence Links (Optional)</label>
                <input type="text" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="GitHub, previous papers, project sites..." />
              </div>
            </div>
          </section>

          <div className="pt-6 flex items-center justify-between border-t border-border">
            <p className="text-sm text-gray-500">By submitting, you agree to our curation process.</p>
            <Button type="submit" className="gap-2">
              Submit Request <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
