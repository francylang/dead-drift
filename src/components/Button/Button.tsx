import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "quiet";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; href?: undefined };
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string };

export type Props = ButtonProps | LinkProps;

/** Renders a link when `href` is set, otherwise a button. Same look, correct semantics. */
export function Button({ variant = "primary", className, ...rest }: Props) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if (rest.href !== undefined) {
    return <a className={classes} {...(rest as LinkProps)} />;
  }
  return <button type="button" className={classes} {...(rest as ButtonProps)} />;
}
