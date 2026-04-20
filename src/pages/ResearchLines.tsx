export default function ResearchLines() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Research Topics & Domains</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          A high-level taxonomy of active RISC-V research domains driving overseas–China collaboration.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-primary mb-3">High-Performance Computing (HPC)</h2>
          <p className="text-sm text-gray-700 mb-4">Focuses on RISC-V vector extensions (RVV), multi-core clustering, and scalable fabric for supercomputing workloads.</p>
          <div className="text-xs font-semibold text-gray-500 uppercase">Key Entities: BSC, EUPILOT</div>
        </div>
        <div className="bg-white border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-primary mb-3">IoT & Edge AI</h2>
          <p className="text-sm text-gray-700 mb-4">Ultra-low-power embedded implementations, parallel arrays, and custom AI accelerator tightly coupled with RISC-V cores.</p>
          <div className="text-xs font-semibold text-gray-500 uppercase">Key Entities: PULP Platform</div>
        </div>
        <div className="bg-white border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-primary mb-3">Advanced Architecture</h2>
          <p className="text-sm text-gray-700 mb-4">Out-of-order superscalar design, security enclaves, agile hardware methodologies (Chisel/FIRRTL).</p>
          <div className="text-xs font-semibold text-gray-500 uppercase">Key Entities: UC Berkeley, MIT</div>
        </div>
      </div>
    </div>
  );
}
