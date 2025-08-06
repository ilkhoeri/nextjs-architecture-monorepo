import { CommandIcon, BrandGithubFillIcon, HeartIcon } from "@repo/icons";

export type InnerRoutes = { title: string; href: string };
export type SingleRoute = { title: string; href?: string; data: InnerRoutes[] };
export type NestedRoute = { title: string; href?: string; data: SingleRoute[] };

export const ROUTES = {
  services: [] as InnerRoutes[],
  docs: [
    { title: "Table of Contents", href: "/toc" },
    { title: "Getting Started", href: "/started" },
    { title: "Environment Variables", href: "/env" },
    {
      title: "App",
      href: "/app",
      data: [
        { title: "Auth", href: "/app/auth" },
        { title: "Settings", href: "/app/settings" },
        { title: "Chat", href: "/app/chat" }
      ]
    },
    {
      title: "Database",
      href: "/database",
      data: [
        { title: "Schema ORM", href: "/database/schema" },
        { title: "Relational", href: "/database/relational" },
        { title: "Analysis", href: "/database/analysis" },
        { title: "Validation", href: "/database/validation" },
        { title: "OpenAPI", href: "/database/openapi" }
      ]
    },
    {
      title: "Concept",
      href: "/concept",
      data: [
        { title: "UI/UX Design", href: "/concept/ui-ux" },
        { title: "Tokenization", href: "/concept/tokenization" },
        // { title: "Error Handling", href: "/concept/error-handling" },
        { title: "Screenshots", href: "/concept/screenshots" }
      ]
    },
    {
      title: "Guidelines",
      href: "/guidelines/license",
      data: [
        { title: "LICENSE", href: "/guidelines/license" },
        { title: "CHANGELOG", href: "/guidelines/changelog" }
      ]
    }
  ] as (InnerRoutes | SingleRoute | NestedRoute)[],
  sections: [
    {
      label: "Github Repository",
      href: "https://github.com/ilkhoeri/",
      icon: BrandGithubFillIcon,
      color: "#6e5494"
    },
    {
      label: "Sponsor",
      href: "https://github.com/sponsors/ilkhoeri",
      icon: HeartIcon,
      color: "#b11c66"
    }
  ],
  suggestions: {
    title: "Main",
    data: [
      {
        title: "Getting Started",
        href: "/",
        icon: CommandIcon
      }
    ]
  },
  footRoutes: [] as InnerRoutes[]
};

// Mengambil semua href dari docs secara rekursif
function extractHrefs(routes: (InnerRoutes | SingleRoute | NestedRoute)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const traverse = (items: (InnerRoutes | SingleRoute | NestedRoute)[]) => {
    for (const item of items) {
      if (item.href) {
        const cleanHref = item.href.slice(1); // Hilangkan "/" di awal
        if (!seen.has(cleanHref)) {
          seen.add(cleanHref);
          result.push(cleanHref);
        }
      }
      if ("data" in item) {
        traverse(item.data); // Rekursi ke dalam `data`
      }
    }
  };

  traverse(routes);
  return result;
}

export const tocList = extractHrefs(ROUTES["docs"]).filter(href => href !== "toc");
