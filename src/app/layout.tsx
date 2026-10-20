import type { Metadata } from "next";
import "@fontsource/young-serif";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css";
import "@/styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Francy Kessler — design engineer",
  description: "Portfolio of Francy Kessler: Hatch, a fly-fishing hatch app, with its component library and an interactive river.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
