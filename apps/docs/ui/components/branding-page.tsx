"use client";
import React from "react";
import { cvx } from "xuxi";
import { ArrowIcon, HasCopyIcon, LogoIcon, TextIcon } from "@repo/icons";
import { useClipboard } from "@repo/hooks/use-clipboard";
import { Typography } from "@repo/ui/typography";
import { cn } from "@repo/utils";

export function BrandingPage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-20 overflow-clip py-20">
      <Typography prose="h1" className="!mb-0">
        Media Assets
      </Typography>

      <Typography prose="h1" className="!-my-8">
        Logo
      </Typography>
      <div className="relative grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Lines className="absolute opacity-30 inset-x-0 h-px -top-px" />
        <Lines className="absolute opacity-30 inset-x-0 h-px -bottom-px" />
        <LogoMap />
      </div>

      <Typography prose="h1" className="!-mb-8">
        Palette
      </Typography>
      <div className="relative grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Lines className="absolute opacity-30 inset-x-0 h-px -top-px" />
        <Lines className="absolute opacity-30 inset-x-0 h-px -bottom-px" />
        <FontPalette />
        <ColorPaletteMap />
      </div>
    </div>
  );
}

function Lines({ className }: { className?: string }) {
  return (
    <div
      {...{
        className,
        style: {
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 1'%3E%3Crect width='1' height='1' fill='%23212126'/%3E%3C/svg%3E\")",
          maskImage: "linear-gradient(to right, transparent, white 14rem, white calc(100% - 14rem), transparent)",
          marginLeft: "-14rem",
          marginRight: "-14rem"
        }
      }}
    />
  );
}

const brandingMap = {
  logoMap: [{ theme: "light", style: { fill: "black" } }, { theme: "dark", style: { fill: "white" } }, { theme: "light" }, { theme: "dark" }],
  colorPaletteMap: ["#142641", "#284e83", "#3569b2"],
  downloadAs: ["png", "svg"]
};

function LogoMap() {
  return brandingMap.logoMap.map((r, _r) => (
    <div key={_r} className={logoMapStyles({ selector: "container", container: r.theme as "light" | "dark" })}>
      <div className={logoMapStyles({ selector: "sectionTop" })}>
        <div className="relative h-1/2 w-1/2">
          <LogoIcon size={136} {...r.style} />
        </div>
      </div>
      <div className={logoMapStyles({ selector: "sectionBottom", sectionBottom: r.theme as "light" | "dark" })}>
        {brandingMap.downloadAs.map((i, _i) => (
          <div key={_i} className="flex items-center gap-2 px-4 py-2">
            <TextIcon size={26} icon={i as "png" | "svg"} />
            <a
              href={`/icons/docs-${!r.style ? "asset" : r.theme === "light" ? "logo-black" : "logo-white"}.${i}`}
              download={`docs-logo-${!r.style ? "color" : r.theme === "light" ? "black" : "white"}`}
              className="text-sm/5"
            >
              Download as {i.toUpperCase()}
            </a>
          </div>
        ))}
      </div>
      <div className={logoMapStyles({ selector: "borderLeft" })} />
      <div className={logoMapStyles({ selector: "borderRight" })} />
    </div>
  ));
}

function FontPalette() {
  return (
    <div className={cn(logoMapStyles({ selector: "container" }), "aspect-[6/4] [&_*]:!text-background bg-color")}>
      <div className={logoMapStyles({ selector: "sectionTop" })}>
        <Typography prose="h1" className="absolute inset-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2">
          Orelega One
        </Typography>
      </div>
      <div className={cn(logoMapStyles({ selector: "sectionBottom" }), "w-full")} tabIndex={-1}>
        <a
          aria-label="font"
          href="https://fonts.google.com/specimen/Orelega+One?preview.text=Doocs"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center gap-2 px-4 py-2"
        >
          <ArrowIcon arrow="up-right" />
          <span className="text-sm/5 mr-auto rtl:mr-0 rtl:ml-auto">Google Fonts</span>
        </a>
      </div>
      <div className={logoMapStyles({ selector: "borderLeft" })} />
      <div className={logoMapStyles({ selector: "borderRight" })} />
    </div>
  );
}

function ColorPaletteMap() {
  return brandingMap.colorPaletteMap.map((r, _r) => (
    <div key={_r} className={cn(logoMapStyles({ selector: "container" }), "aspect-[6/4] [&_*]:!text-white")} {...{ style: { backgroundColor: r } }}>
      <div className={logoMapStyles({ selector: "sectionTop" })}>
        <Typography prose="h1" className="absolute inset-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2">
          {r}
        </Typography>
      </div>
      {copyColors(r)}
      <div className={logoMapStyles({ selector: "borderLeft" })} />
      <div className={logoMapStyles({ selector: "borderRight" })} />
    </div>
  ));
}

function copyColors(value: string) {
  const clipboard = useClipboard({ timeout: 1000 });
  return (
    <div className={logoMapStyles({ selector: "sectionBottom" })} tabIndex={-1} onClick={() => clipboard.copy(value)}>
      <div className="flex items-center gap-2 px-4 py-2">
        <HasCopyIcon has={clipboard.copied} />
        <span className="text-sm/5">{clipboard.copied ? "Copied" : "Copy"}</span>
      </div>
    </div>
  );
}

const logoMapStyles = cvx({
  variants: {
    selector: {
      container: "relative flex aspect-[7/9] w-[17.5rem] flex-col border border-black/5 bg-clip-padding shadow-[0_1px_1px,0_-1px_1px,0_4px_6px] shadow-black/[0.06]",
      sectionTop: "relative flex flex-1 items-center justify-center",
      sectionBottom: "divide-y-[1px] border-t cursor-pointer",
      borderLeft: "absolute inset-y-0 -left-px -my-[1.875rem] border-l border-gray-950/10",
      borderRight: "absolute inset-y-0 -right-px -my-[1.875rem] border-r border-gray-950/10"
    },
    container: {
      light: "text-primary bg-white [&_*]:text-black hover:[&_a]:!text-black",
      dark: "bg-gray-950 text-white [&_*]:text-white hover:[&_a]:!text-white"
    },
    sectionBottom: {
      light: "divide-gray-950/5 border-t-gray-950/5",
      dark: "divide-white/10 border-t-white/10"
    }
  }
});
