"use client";
import React from "react";
import { cn } from "@repo/utils";
import { useApp } from "@/context/app-context";

export const Main = React.forwardRef<HTMLElement, React.ComponentProps<"main">>((_props, ref) => {
  const { className, ...props } = _props;
  const { isHome } = useApp();
  return (
    <main
      {...{
        ref,
        className: cn(
          "w-full relative flex flex-col md:flex-row mx-auto min-h-screen pt-[--navbar] pb-20 max-w-var",
          !isHome ? "md:max-lg:pr-8 rtl:md:max-lg:pr-0 rtl:md:max-lg:pl-8 bg-background-theme" : "md:px-8 lg:px-12 xl:px-16"
        ),
        ...props
      }}
    />
  );
});
Main.displayName = "Main";
