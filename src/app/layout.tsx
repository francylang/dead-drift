import type { Metadata } from "next";
import "@fontsource/young-serif";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css";
import "@/styles/tokens.css";
import "./globals.css";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Francy Kessler — design engineer",
  description: `Portfolio of Francy Kessler: ${BRAND.name}, a fly-fishing app for Colorado’s Gold Medal rivers, and its component library.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
