import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  pathname?: string;
  robots?: string;
  type?: string;
};

const SITE_NAME = "RISC-V Scholars";
const DEFAULT_ROBOTS = "index,follow";

function buildCanonicalUrl(pathname?: string) {
  if (!pathname) {
    return window.location.href;
  }

  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const basePath = import.meta.env.BASE_URL || "/";
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const normalizedPath = pathname.replace(/^\/+/, "");
  const relativePath = normalizedPath.length > 0 ? `${normalizedBase}${normalizedPath}` : normalizedBase;

  return new URL(relativePath, window.location.origin).toString();
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description,
  pathname,
  robots = DEFAULT_ROBOTS,
  type = "website",
}: SeoProps) {
  useEffect(() => {
    const canonicalUrl = buildCanonicalUrl(pathname);

    document.title = title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });

    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });

    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });
  }, [description, pathname, robots, title, type]);

  return null;
}
