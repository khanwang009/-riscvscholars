import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const seedsPath = path.join(repoRoot, "scripts", "institution-seeds.json");
const runtimeDir = path.join(repoRoot, "runtime-data");
const scrapeReportPath = path.join(runtimeDir, "institution-scrape-report.json");
const draftPath = path.join(runtimeDir, "institution-drafts.json");

const USER_AGENT =
  "riscvscholars-bot/0.1 (+https://wxgpt.fangxiashouji.com/riscvscholars/; research profile enrichment)";

const summaryKeywords = [
  "risc-v",
  "research",
  "architecture",
  "hardware",
  "accelerator",
  "vector",
  "open-source",
  "verification",
  "benchmark",
  "systems",
];

const ecosystemSignals = [
  "openhw",
  "risc-v international",
  "consortium",
  "ecosystem",
  "foundation",
  "working group",
  "initiative",
  "partnership",
];

const outputSignals = [
  "core",
  "processor",
  "soc",
  "platform",
  "compiler",
  "benchmark",
  "sdk",
  "toolchain",
  "fpga",
  "tape-out",
  "taped-out",
  "vector",
  "accelerator",
];

const partnerSignals = [
  "university",
  "institute",
  "center",
  "centre",
  "openhw",
  "foundation",
  "initiative",
];

const blockedPhrases = new Set([
  "navigation menu",
  "search",
  "search code, repositories, users, issues, pull requests...",
  "provide feedback",
  "saved searches",
  "home",
  "research",
  "people",
  "academics",
  "upcoming events",
  "menu",
]);

const stopWords = new Set([
  "with",
  "from",
  "this",
  "that",
  "their",
  "about",
  "research",
  "platform",
  "group",
  "initiative",
  "center",
  "centre",
  "university",
  "system",
  "open",
  "hardware",
  "navigation",
  "menu",
  "people",
  "home",
  "events",
  "upcoming",
  "search",
  "repositories",
  "users",
  "issues",
  "code",
  "provide",
  "feedback",
  "saved",
  "query",
  "welcome",
  "what",
  "happening",
  "create",
  "serve",
  "educate",
]);

const blockedResearchFocusFragments = [
  "sign in appearance settings",
  "search or jump to",
  "provide feedback",
  "saved searches",
  "github copilot",
  "marketplace",
  "pricing",
  "customer support",
  "view all features",
];

function htmlDecode(input) {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(input) {
  return htmlDecode(
    input
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractMatches(html, regex, limit = 8) {
  const results = [];
  for (const match of html.matchAll(regex)) {
    const text = stripTags(match[1] ?? "");
    if (text && !results.includes(text)) {
      results.push(text);
    }
    if (results.length >= limit) {
      break;
    }
  }
  return results;
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]) : "";
}

function extractMetaDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
    /<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return stripTags(match[1]);
    }
  }

  return "";
}

function extractLinks(html, baseUrl) {
  const links = [];
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) {
      continue;
    }

    try {
      const url = new URL(href, baseUrl).toString();
      if (!links.includes(url)) {
        links.push(url);
      }
    } catch {
      continue;
    }
  }
  return links;
}

function pickSummary(metaDescription, paragraphs) {
  if (metaDescription && metaDescription.length >= 50) {
    return metaDescription;
  }

  return (
    paragraphs.find((paragraph) => paragraph.length >= 80 && paragraph.length <= 320) ??
    paragraphs[0] ??
    ""
  );
}

function pickResearchFocus(paragraphs, headings) {
  const candidates = [...paragraphs, ...headings];
  return (
    candidates.find((candidate) =>
      !/^\d{1,2}\s+[A-Za-z]+\s+\d{4}/.test(candidate) &&
      !candidate.toLowerCase().includes("read more") &&
      !blockedResearchFocusFragments.some((fragment) =>
        candidate.toLowerCase().includes(fragment),
      ) &&
      summaryKeywords.some((keyword) => candidate.toLowerCase().includes(keyword)),
    ) ?? ""
  );
}

function extractProjectCandidates(links, headings) {
  const projects = [];

  for (const link of links) {
    const githubMatch = link.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
    if (githubMatch) {
      const repo = githubMatch[2];
      if (
        repo &&
        !["issues", "pulls", "actions", "projects", "orgs"].includes(repo.toLowerCase()) &&
        !projects.includes(repo)
      ) {
        projects.push(repo);
      }
    }
  }

  for (const heading of headings) {
    const normalized = heading.toLowerCase();
    if (
      !blockedPhrases.has(normalized) &&
      /^[A-Z0-9][A-Za-z0-9+/\- ]{2,40}$/.test(heading) &&
      heading.split(" ").length <= 5 &&
      /[A-Z0-9]/.test(heading.replace(/\s+/g, "")) &&
      !projects.includes(heading)
    ) {
      projects.push(heading);
    }
  }

  return projects.slice(0, 8);
}

function extractKeywordCandidates(projects, headings, paragraphs) {
  const sourceText = [...projects, ...headings.slice(0, 8), ...paragraphs.slice(0, 5)].join(" ");
  const words = sourceText
    .split(/[^A-Za-z0-9+#-]+/)
    .map((word) => word.trim())
    .filter(Boolean);

  const keywords = [];
  for (const word of words) {
    const normalized = word.toLowerCase();
    if (
      normalized.length < 4 ||
      stopWords.has(normalized) ||
      blockedPhrases.has(normalized) ||
      keywords.some((existing) => existing.toLowerCase() === normalized)
    ) {
      continue;
    }

    keywords.push(word);
    if (keywords.length >= 12) {
      break;
    }
  }

  return keywords;
}

function extractSignalCandidates(paragraphs, headings, links) {
  const combined = [...paragraphs, ...headings];
  const ecosystemRoleCandidates = [];
  const representativeOutputCandidates = [];
  const industryCollaborationSignalCandidates = [];
  const proofOfRelevanceCandidates = [];
  const openSourceFootprintCandidates = [];
  const notablePartnerCandidates = [];

  for (const text of combined) {
    const normalized = text.toLowerCase();

    if (
      ecosystemSignals.some((signal) => normalized.includes(signal)) &&
      text.length <= 220 &&
      !ecosystemRoleCandidates.includes(text)
    ) {
      ecosystemRoleCandidates.push(text);
    }

    if (
      outputSignals.some((signal) => normalized.includes(signal)) &&
      text.length <= 220 &&
      !representativeOutputCandidates.includes(text)
    ) {
      representativeOutputCandidates.push(text);
    }

    if (
      /(collaboration|partner|benchmark|exchange|workshop|consortium|initiative)/i.test(text) &&
      text.length <= 220 &&
      !industryCollaborationSignalCandidates.includes(text)
    ) {
      industryCollaborationSignalCandidates.push(text);
    }

    if (
      /(open-source|repositories available|public|widely|foundation|initiative|taped-out|vector)/i.test(
        text,
      ) &&
      text.length <= 220 &&
      !proofOfRelevanceCandidates.includes(text)
    ) {
      proofOfRelevanceCandidates.push(text);
    }
  }

  for (const link of links) {
    const normalized = link.toLowerCase();
    if (
      /(github\.com|gitlab|openhw|riscv\.org|european-processor-initiative|open-source)/i.test(
        normalized,
      ) &&
      !openSourceFootprintCandidates.includes(link)
    ) {
      openSourceFootprintCandidates.push(link);
    }
  }

  const partnerMatches = combined
    .flatMap((text) => text.match(/[A-Z][A-Za-z&.-]+(?:\s+[A-Z][A-Za-z&.-]+){0,4}/g) ?? [])
    .filter((value) =>
      partnerSignals.some((signal) => value.toLowerCase().includes(signal)),
    );

  for (const partner of partnerMatches) {
    if (!notablePartnerCandidates.includes(partner)) {
      notablePartnerCandidates.push(partner);
    }
  }

  return {
    ecosystemRoleCandidates: ecosystemRoleCandidates.slice(0, 6),
    representativeOutputCandidates: representativeOutputCandidates.slice(0, 8),
    industryCollaborationSignalCandidates:
      industryCollaborationSignalCandidates.slice(0, 8),
    openSourceFootprintCandidates: openSourceFootprintCandidates.slice(0, 8),
    notablePartnerCandidates: notablePartnerCandidates.slice(0, 8),
    proofOfRelevanceCandidates: proofOfRelevanceCandidates.slice(0, 8),
  };
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const html = await response.text();
  const title = extractTitle(html);
  const metaDescription = extractMetaDescription(html);
  const headings = extractMatches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, 10);
  const paragraphs = extractMatches(html, /<p[^>]*>([\s\S]*?)<\/p>/gi, 10).filter(
    (text) => text.length >= 40 && text.length <= 360,
  );
  const links = extractLinks(html, url).slice(0, 200);

  return {
    url,
    ok: response.ok,
    status: response.status,
    title,
    metaDescription,
    headings,
    paragraphs: paragraphs.slice(0, 8),
    links,
  };
}

async function main() {
  await fs.mkdir(runtimeDir, { recursive: true });
  const seeds = JSON.parse(await fs.readFile(seedsPath, "utf8"));

  const scrapeReport = [];
  const drafts = [];

  for (const seed of seeds) {
    const urls = [...new Set([seed.officialWebsite, ...(seed.sourceUrls ?? [])])];
    const pages = [];

    for (const url of urls) {
      try {
        pages.push(await fetchPage(url));
      } catch (error) {
        pages.push({
          url,
          ok: false,
          status: 0,
          error: error instanceof Error ? error.message : "Unknown fetch error",
          title: "",
          metaDescription: "",
          headings: [],
          paragraphs: [],
          links: [],
        });
      }
    }

    const successfulPages = pages.filter((page) => page.ok);
    const primaryPage = successfulPages[0] ?? null;
    const combinedHeadings = successfulPages.flatMap((page) => page.headings);
    const combinedParagraphs = successfulPages.flatMap((page) => page.paragraphs);
    const combinedLinks = successfulPages.flatMap((page) => page.links);
    const allSources = urls.map((url) => ({
      label: deriveSourceLabel(url),
      url,
    }));

    const summaryCandidate = pickSummary(
      primaryPage?.metaDescription ?? "",
      primaryPage?.paragraphs ?? combinedParagraphs,
    );
    const researchFocusCandidate = pickResearchFocus(
      primaryPage?.paragraphs ?? combinedParagraphs,
      primaryPage?.headings ?? combinedHeadings,
    );
    const projectCandidates = extractProjectCandidates(combinedLinks, combinedHeadings);
    const keywordCandidates = extractKeywordCandidates(
      projectCandidates,
      combinedHeadings,
      combinedParagraphs,
    );
    const signalCandidates = extractSignalCandidates(
      combinedParagraphs,
      combinedHeadings,
      combinedLinks,
    );

    scrapeReport.push({
      slug: seed.slug,
      scrapedAt: new Date().toISOString(),
      pages,
    });

    drafts.push({
      slug: seed.slug,
      institutionName: seed.institutionName,
      labName: seed.labName,
      officialWebsite: seed.officialWebsite,
      summaryCandidate,
      researchFocusCandidate,
      representativeProjectCandidates: projectCandidates,
      projectKeywordCandidates: keywordCandidates,
      ecosystemRoleCandidates: signalCandidates.ecosystemRoleCandidates,
      representativeOutputCandidates: signalCandidates.representativeOutputCandidates,
      industryCollaborationSignalCandidates:
        signalCandidates.industryCollaborationSignalCandidates,
      openSourceFootprintCandidates: signalCandidates.openSourceFootprintCandidates,
      notablePartnerCandidates: signalCandidates.notablePartnerCandidates,
      proofOfRelevanceCandidates: signalCandidates.proofOfRelevanceCandidates,
      sourceCandidates: allSources,
      evidence: successfulPages.map((page) => ({
        url: page.url,
        title: page.title,
        metaDescription: page.metaDescription,
        headings: page.headings.slice(0, 6),
        paragraphs: page.paragraphs.slice(0, 4),
      })),
    });
  }

  await fs.writeFile(scrapeReportPath, JSON.stringify(scrapeReport, null, 2));
  await fs.writeFile(draftPath, JSON.stringify(drafts, null, 2));

  console.log(`Scraped ${drafts.length} institution seeds.`);
  console.log(`Report: ${scrapeReportPath}`);
  console.log(`Drafts: ${draftPath}`);
}

function deriveSourceLabel(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("github.com")) {
      return "GitHub";
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
