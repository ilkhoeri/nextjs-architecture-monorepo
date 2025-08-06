"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TableOfContents } from "./config";
import { displayName } from "@repo/utils";
import { cn } from "@repo/utils";

interface TocProps {
  toc: TableOfContents | null;
  sub?: number;
}

export function useMounted() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function DashboardTableOfContents({ toc, sub = 6 }: TocProps) {
  const pathname = usePathname();

  const itemIds = React.useMemo(
    () =>
      toc?.items
        ? toc.items
            .flatMap(item => [item.url, item?.items?.map(item => item.url)])
            .flat()
            .filter(Boolean)
            .map(id => id?.split("#")[1])
        : [],
    [toc]
  );

  // @ts-ignore
  const activeHeading = useActiveItem(itemIds);

  const mounted = useMounted();

  const paths = pathname.split("/").filter(Boolean);
  const editPageLink = paths.length ? `https://github.com/ilkhoeri/messaging-app/edit/main/docs/md/${paths.join("/")}.mdx` : "";

  if (!toc?.items?.length) return null;

  return (
    <aside className="bg-background-theme m-0 mt-[calc(var(--navbar)*-1)] h-[--aside-h] max-h-[--aside-h] w-full overflow-hidden pt-[calc(var(--navbar)+18px)] [--aside-h:100dvh] [--aside-w:calc(var(--aside)-1rem)] max-lg:sr-only max-lg:z-[-111] max-lg:hidden lg:sticky lg:top-0 lg:w-[--aside-w] lg:min-w-[--aside-w] lg:max-w-[--aside-w] lg:pl-8 lg:pr-4 lg:transition-none lg:[--aside-h:calc(100dvh-2rem)] lg:rtl:pl-4 lg:rtl:pr-8">
      {toc?.items?.length && (
        <nav className="sticky flex flex-col flex-nowrap items-start justify-start overflow-y-auto overflow-x-hidden pl-3 pt-4 max-lg:pb-24 max-lg:pt-0 lg:pb-0 rtl:pl-0 rtl:pr-3">
          <hgroup>
            <h4 role="presentation" className="text-paragraph mb-2 font-medium">
              On This Page
            </h4>
          </hgroup>
          <Tree tree={toc} sub={sub} activeItem={activeHeading} />
        </nav>
      )}

      <hr className="mt-5 w-full min-w-[212px]" />

      <Link href={editPageLink} target="_blank" rel="noopener noreferrer nofollow" className="text-muted-foreground group h-4 justify-start gap-1">
        <span className="underline-hover group-hover:text-constructive truncate text-sm transition-all">Edit this page on GitHub</span>
        <svg
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          className="-rotate-45 stroke-[1.25] sizer [--sz:28px]"
        >
          <path d="M12 16l4 -4l-4 -4" />
          <path d="M8 12h8" />
        </svg>
      </Link>
    </aside>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<any>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry?.target?.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  sub?: number;
  activeItem?: string;
}

function Tree({ tree, level = 1, sub = 3, activeItem }: TreeProps) {
  return tree?.items?.length && level < sub ? (
    <div
      className={cn("text-span list-none max-w-[calc(100%+1rem)]", {
        "pl-4 rtl:pl-0 rtl:pr-4": level !== 1,
        "webkit-scrollbar lg:max-h-[calc(100dvh-13rem)] overflow-y-auto pb-4 -ml-4 rtl:ml-0 rtl:-mr-4 [&>div>a]:hidden": level === 1
      })}
    >
      {tree.items.map((item, index) => {
        return (
          <div key={index} className={cn("text-muted-foreground pt-2")}>
            <a
              href={item.url}
              title={displayName(item.title)}
              className={cn("hover:text-color no-underline transition-colors block truncate", item.url === `#${activeItem}` ? "text-color" : "text-muted-foreground")}
            >
              {displayName(item.title)}
            </a>
            {item.items?.length ? <Tree sub={sub} tree={item} level={level + 1} activeItem={activeItem} /> : null}
          </div>
        );
      })}
    </div>
  ) : null;
}
