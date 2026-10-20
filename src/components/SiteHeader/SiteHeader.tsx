"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";

const LINKS = [
  { href: "/rivers", label: "Rivers" },
  { href: "/hatch/river", label: "Read the river" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const current = (href: string) => pathname === href || (href === "/rivers" && pathname.startsWith("/rivers/"));

  return (
    <header className={styles.bar}>
      <Link href="/hatch" className={styles.wordmark}>
        Hatch
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
