export type ClaimStatus = 'Unclaimed' | 'Claim requested' | 'Claimed / Verified';
export type PageMode = 'Collaboration-entry profile' | 'Browse-first profile';

export interface Institution {
  id: string;
  institution: string;
  profile_name: string;
  country: string;
  institution_type: string;
  core_direction: string;
  representative_projects: string[];
  recommended_page_mode: PageMode;
  collaboration_signal: string;
  public_contact_path: string;
  participation_path: string;
  support_or_stewardship_signal: string;
  best_fit_cn_partner_types: string[];
  recommended_cn_unit_examples: string[];
  claim_status: ClaimStatus;
  editorial_note: string;
  sources: { name: string; url: string }[];
}

export const institutions: Institution[] = [
  {
    id: "eth-zurich-pulp",
    institution: "ETH Zurich / Università di Bologna",
    profile_name: "PULP Platform",
    country: "Switzerland / Italy",
    institution_type: "Academic Lab",
    core_direction: "Parallel Ultra-Low-Power RISC-V Architectures",
    representative_projects: ["RI5CY (Ibex)", "Ariane (CVA6)", "Snitch"],
    recommended_page_mode: "Collaboration-entry profile",
    collaboration_signal: "Highly open to academic research collaborations, tape-out partnerships, and contributions to the open-source PULP ecosystem. Regular contributors accepted via GitHub.",
    public_contact_path: "pulp-platform.org / official GitHub repositories / public mailing lists.",
    participation_path: "Source-code contributions, IP integration, joint European/Global funding projects.",
    support_or_stewardship_signal: "OpenHW Group active members.",
    best_fit_cn_partner_types: ["Academic Labs", "Silicon Startups targeting IoT/Edge AI"],
    recommended_cn_unit_examples: ["Tsinghua University (IoT clusters)", "RIOS Lab"],
    claim_status: "Unclaimed",
    editorial_note: "One of the most foundational overseas ecosystems for RISC-V open-source silicon. Essential collaboration node.",
    sources: [
      { name: "PULP Platform Official", url: "https://pulp-platform.org/" },
      { name: "GitHub Archive", url: "https://github.com/pulp-platform" }
    ]
  },
  {
    id: "uc-berkeley-sls",
    institution: "UC Berkeley",
    profile_name: "Berkeley Architecture Research",
    country: "United States",
    institution_type: "Academic Lab",
    core_direction: "Advanced Computer Architecture, Chisel, Agile Hardware Design",
    representative_projects: ["Rocket Chip", "BOOM (Berkeley Out-of-Order Machine)", "Chisel Hardware Construction Language"],
    recommended_page_mode: "Browse-first profile",
    collaboration_signal: "Focused primarily on foundational open-source architecture research and educational tooling.",
    public_contact_path: "EECS Department public directory.",
    participation_path: "Research workshops, visiting scholar programs, and OSS contributions.",
    support_or_stewardship_signal: "Birthplace of the RISC-V ISA.",
    best_fit_cn_partner_types: ["Elite Architecture Research Labs", "Toolchain Developers"],
    recommended_cn_unit_examples: ["Chinese Academy of Sciences", "Peking University"],
    claim_status: "Claim requested",
    editorial_note: "Historical core of the RISC-V movement. Current collaboration usually requires formal academic visiting researcher protocols or high-level consortium alignment.",
    sources: [
      { name: "EECS Berkeley", url: "https://eecs.berkeley.edu/" },
      { name: "RISC-V International Foundation", url: "https://riscv.org/" }
    ]
  },
  {
    id: "bsc-spain",
    institution: "Barcelona Supercomputing Center (BSC)",
    profile_name: "BSC RISC-V Accelerator Team",
    country: "Spain",
    institution_type: "National Supercomputing Facility",
    core_direction: "High-Performance Computing (HPC) accelerators mapped to RISC-V, Vector Extensions",
    representative_projects: ["EPI (European Processor Initiative) accelerators", "Lagarto Processor"],
    recommended_page_mode: "Collaboration-entry profile",
    collaboration_signal: "Actively seeking HPC hardware-software co-design collaborations and consortium alliances.",
    public_contact_path: "BSC Open Architecture public portal.",
    participation_path: "Joint benchmarking, European-global bridging initiatives, compiler optimization testing.",
    support_or_stewardship_signal: "Key driver of European sovereign hardware initiatives.",
    best_fit_cn_partner_types: ["HPC Research Clusters", "Vector Hardware Vendors", "System Software Labs"],
    recommended_cn_unit_examples: ["Institute of Computing Technology (ICT), CAS"],
    claim_status: "Unclaimed",
    editorial_note: "Highly active in the HPC domain for RISC-V. A crucial partner for high-end silicon and cluster compute paradigms.",
    sources: [
      { name: "BSC Official Site", url: "https://www.bsc.es/" },
      { name: "EPI Public Disclosures", url: "https://www.european-processor-initiative.eu/" }
    ]
  }
];
