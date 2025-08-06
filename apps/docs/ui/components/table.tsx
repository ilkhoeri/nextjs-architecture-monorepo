"use client";
import React from "react";
import { cn } from "@repo/utils";
import { cvx, cvxVariants } from "xuxi";

const classes = cvx({
  variants: {
    variant: {
      unstyled: "",
      invert: "[&_table]:!bg-[var(--invert-bg)] [&_tr]:!bg-transparent [&_th]:!bg-transparent [&_td]:!bg-transparent [&_th]:!text-background [&_td]:!text-background"
    },
    preset: {
      unknown: "",
      screenshot: "[&_img]:h-[var(--img-h,27rem)] [&_img]:w-[var(--img-w,auto)]"
    }
  }
});

type TreesWrap = "root" | "table" | "head" | "trhead" | "body";
type TreesByIndex = "cellhead" | "rowbody" | "cellbody";
type TableTrees = TreesWrap | TreesByIndex;

type CSSProperties = React.CSSProperties & Record<string, any>;

type TableObjectStyles<T> = Partial<Record<TreesByIndex, T | ((index: number) => T)>>;

type TableStyles<T> = Partial<Record<TreesWrap, T>> & TableObjectStyles<T>;

export interface TableProps extends cvxVariants<typeof classes> {
  head?: React.ReactNode[]; // array of header cells
  body?: React.ReactNode[][]; // array of rows, each row is an array of cells
  className?: string;
  classNames?: TableStyles<string>;
  styles?: TableStyles<CSSProperties>;
  isWhileMounted?: boolean;
  sticky?: Booleanish | "vertical" | "horizontal";
}

function parseStyles<T>(styles: T | ((index: number) => T), index: number): T {
  return typeof styles === "function" ? (styles as (index: number) => T)(index) : styles;
}

interface GetStylesOptions extends Pick<TableProps, "classNames" | "styles"> {
  index?: number;
}

function getStyles(selector: TableTrees, { classNames, styles, index }: GetStylesOptions): { className: string | undefined; style: CSSProperties | undefined } {
  return {
    className: (index ? parseStyles(classNames?.[selector], index + 1) : classNames?.[selector]) as string,
    style: (index ? parseStyles(styles?.[selector], index + 1) : styles?.[selector]) as CSSProperties
  };
}

// 27rem
export function Table(_props: TableProps) {
  const { head, body, className, classNames, styles, isWhileMounted, sticky = false, variant = "invert", preset = "screenshot" } = _props;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <div
      data-table="scroll-area"
      {...{
        className: cn("my-6", classes({ variant, preset }), isWhileMounted && !mounted && "[&_*]:*:!text-transparent", classNames?.root, className),
        style: {
          "--invert-bg": variant === "invert" && "hsl(var(--muted-foreground))",
          ...styles?.root
        } as CSSProperties
      }}
    >
      <table data-sticky={sticky || undefined} {...{ className: cn(classNames?.table), style: styles?.table }}>
        {head && (
          <thead {...{ className: classNames?.head, style: styles?.head }}>
            <tr {...{ className: classNames?.trhead, style: styles?.trhead }}>
              {head?.map((cell, i) => (
                <th key={i} {...{ className: cn(classes({ variant }), parseStyles(classNames?.cellhead, i + 1)), style: parseStyles(styles?.cellhead, i + 1) }}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {body && (
          <tbody {...{ className: classNames?.body, style: styles?.body }}>
            {body?.map((row, rowIndex) => (
              <tr key={rowIndex} {...{ className: parseStyles(classNames?.rowbody, rowIndex + 1), style: parseStyles(styles?.rowbody, rowIndex + 1) }}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    {...{
                      className: cn(parseStyles(classNames?.cellbody, cellIndex + 1)),
                      style: {
                        backgroundColor: sticky === "horizontal" && cellIndex === 0 && variant === "invert" && "var(--invert-bg) !important",
                        ...parseStyles(styles?.cellbody, cellIndex + 1)
                      } as CSSProperties
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
