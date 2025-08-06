import * as React from "react";
import * as Link from "next/link";
import { cvx, type cvxVariants } from "xuxi";
import { cn } from "@repo/utils";

const classes = cvx({
  variants: {
    underline: {
      always: "underline underline-offset-[.21875rem] decoration-1",
      hover: "underline-hover w-max",
      never: ""
    },
    role: {
      anchor: "text-constructive hover:text-constructive-emphasis"
    }
  }
});

type Options = Pick<AnchorProps, "unstyled" | "role" | "className" | "underline">;
function getStyles(opt: Options) {
  const role = opt.role === "anchor" ? "anchor" : undefined;
  return {
    className: cn(!opt.unstyled && classes({ underline: opt.underline, role }), opt.className)
  };
}

export interface AnchorProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target">,
    Omit<cvxVariants<typeof classes>, "role">,
    Omit<Link.LinkProps, "href">,
    AnchorTargets {
  unstyled?: boolean;
  href?: Link.LinkProps["href"];
  role?: React.AriaRole | "anchor";
  style?: React.CSSProperties & Record<string, any>;
}

export const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ rel = "noopener noreferrer nofollow", href = "", role, className, unstyled, underline = "never", ...props }, ref) => (
    <Link.default {...{ ref, rel, href, role, ...getStyles({ className, unstyled, underline, role }), ...props }} />
  )
);
Anchor.displayName = "Anchor";

export type AnchorTargets = {
  target?:
    | "_about"
    | "_blank"
    | "_calendar"
    | "_contacts"
    | "_email"
    | "_external"
    | "_file"
    | "_ftp"
    | "_media"
    | "_messaging"
    | "_noopener"
    | "_noreferrer"
    | "_parent"
    | "_search"
    | "_self"
    | "_sms"
    | "_tel"
    | "_top"
    | (string & NonNullable<unknown>);
};
