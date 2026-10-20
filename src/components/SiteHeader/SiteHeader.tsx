"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";
import { BRAND, ROUTES } from "@/lib/brand";

const LINKS = [
  { href: ROUTES.rivers, label: "Rivers" },
  { href: ROUTES.plan, label: "Read the river" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const current = (href: string) => pathname === href || (href === ROUTES.rivers && pathname.startsWith(`${ROUTES.rivers}/`));

  return (
    <header className={styles.bar}>
      <Link href={ROUTES.landing} className={styles.wordmark}>
        {BRAND.name}
      </Link>
      <nav aria-label="Product">
        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} aria-current={current(link.href) ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
