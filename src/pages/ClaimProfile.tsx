import { ShieldAlert } from "lucide-react";
import { Button, Card } from "../components/ui";

export default function ClaimProfile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Claim Institution Profile</h1>
        <p className="text-lg text-gray-600">
          If you officially represent a RISC-V research lab or institution currently archived (or missing) on RISC-V Scholars, submit this form to take stewardship of the profile and define your collaboration signals.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <Card className="p-8">
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              
              <div className="space-y-4 border-b border-border pb-6">
                <h3 className="font-serif font-bold text-xl">Identity & Affiliation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Applicant Name</label>
                    <input type="text" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Role / Title</label>
                    <input type="text" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Institution / Profile Name</label>
                  <input type="text" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Official Institutional Email</label>
                  <input type="email" placeholder="Must end in .edu or official domain" className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-serif font-bold text-xl">Stewardship Details</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">What updates are needed to your profile?</label>
                  <textarea rows={3} className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none placeholder-gray-400" placeholder="e.g. Please update our representative projects to include X..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Collaboration Interests</label>
                  <textarea rows={3} className="w-full border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none placeholder-gray-400" placeholder="What types of engagement are you open to from Chinese laboratories?"></textarea>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full sm:w-auto">Submit Claim Request</Button>
                <p className="text-xs text-gray-500 mt-4">
                  Our editorial team will review your request and contact you via your institutional email to complete the verification.
                </p>
              </div>

            </form>
          </Card>
        </div>

        <div>
          <div className="bg-surface-alt p-6 border border-border rounded sticky top-24">
            <ShieldAlert className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-serif font-bold text-lg mb-2">Why Claim?</h4>
            <ul className="space-y-3 text-sm text-gray-700 list-disc pl-4">
              <li>Ensure your lab's research lines are accurate.</li>
              <li>Filter noise: Specify exactly what kind of partner you want.</li>
              <li>Enable structured, curated requests instead of direct inbox spam.</li>
              <li>Highlight your contributions to the global RISC-V baseline.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
