import Link from "next/link";
import styles from "./home.module.css";

// Placeholder copy — rewrite in your own voice.
const WORK = [
  {
    href: "/swath",
    title: "Swath landing page",
    body: "Marketing page for an invented farm cash-flow product. Scroll-driven hero chart, responsive layout, reduced-motion fallback.",
  },
  {
    href: "/storybook",
    title: "Swath component library",
    body: "Storybook with design tokens, accessible form controls, and interaction tests on every component.",
  },
  {
    href: "/swath/plan",
    title: "Season planner",
    body: "Interactive what-if: move harvest timing and yield, watch month-end cash spring to new values.",
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
