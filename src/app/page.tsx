import Link from "next/link";
import styles from "./home.module.css";
import { BRAND, ROUTES } from "@/lib/brand";

// Placeholder copy — rewrite in your own voice.
const WORK = [
  {
    href: ROUTES.landing,
    title: BRAND.name,
    body: "A fly-fishing app for Colorado’s Gold Medal rivers. Live stream gauges and the NWS forecast become an hourly hatch outlook for each river, plus a ranked list of where to fish today.",
  },
  {
    href: "/storybook",
    title: `${BRAND.name} component library`,
    body: "Storybook with design tokens, insect glyphs, accessible form controls, and interaction tests on every component.",
  },
  {
    href: ROUTES.plan,
    title: "Read the river",
    body: "Set month, water temperature, and time of day; insects rise off an animated river and the fly list updates.",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.name}>Francy Kessler</h1>
      <p className={styles.intro}>Design engineer in Denver. React, TypeScript, motion, and design systems.</p>
      <ul className={styles.list}>
        {WORK.map((item) => (
          <li key={item.href} className={styles.item}>
            <Link href={item.href} className={styles.link}>
              {item.title}
            </Link>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      <p className={styles.contact}>
        <a href="https://github.com/francylang">GitHub</a>
        <a href="mailto:francy.lang@gmail.com">francy.lang@gmail.com</a>
      </p>
    </main>
  );
}
