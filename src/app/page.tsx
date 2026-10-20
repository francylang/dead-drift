import Link from "next/link";
import styles from "./home.module.css";

// Placeholder copy — rewrite in your own voice.
const WORK = [
  {
    href: "/hatch",
    title: "Hatch",
    body: "A fly-fishing app for Colorado’s Gold Medal rivers. Drag a season ribbon through the year, watch the hatch chart ink in as you scroll; river pages combine live USGS gauges and the NWS forecast into an hourly hatch outlook.",
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
