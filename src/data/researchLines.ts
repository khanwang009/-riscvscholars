import type { ResearchLine } from "../types/profile";

export const researchLines: ResearchLine[] = [
  {
    id: "edge-ai",
    label: "Edge AI & Ultra-Low-Power Systems",
    shortLabel: "Edge AI",
    summary:
      "RISC-V labs building low-power compute clusters, custom accelerators, and toolchains for embedded and edge inference workloads.",
    signals: ["Ultra-low-power", "Embedded clusters", "AI accelerators"],
  },
  {
    id: "hpc-vector",
    label: "High-Performance Computing & Vector Systems",
    shortLabel: "HPC & Vector",
    summary:
      "Research around vector extensions, scalable compute fabrics, and benchmarking workflows for high-end RISC-V deployments.",
    signals: ["Vector extensions", "Benchmarking", "Cluster compute"],
  },
  {
    id: "agile-arch",
    label: "Agile Hardware Design & Advanced Architecture",
    shortLabel: "Advanced Architecture",
    summary:
      "Architecture groups focused on agile chip design methods, hardware construction languages, and advanced microarchitecture exploration.",
    signals: ["Chisel/FIRRTL", "Out-of-order design", "Architecture tooling"],
  },
  {
    id: "open-platforms",
    label: "Open Platforms & Ecosystem Stewardship",
    shortLabel: "Open Platforms",
    summary:
      "Institutions that shape open governance, reusable IP baselines, and community-facing RISC-V infrastructure for global collaboration.",
    signals: ["Open governance", "Reusable IP", "Community infrastructure"],
  },
];
