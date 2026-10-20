import Link from "next/link";
import styles from "./home.module.css";

// Placeholder copy — rewrite in your own voice.
const WORK = [
  {
    href: "/hatch",
    title: "Hatch landing page",
    body: "Marketing page for an invented fly-fishing app. Scroll moves a pinned river through the year; live flow from a USGS gauge.",
  },
  {
    href: "/storybook",
    title: "Hatch component library",
    body: "Storybook with design tokens, insect glyphs, accessible form controls, and interaction tests on every component.",
  },
  {
    href: "/hatch/river",
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
