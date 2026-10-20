import type { Metadata } from "next";
import "@fontsource/zilla-slab/500.css";
import "@fontsource/zilla-slab/700.css";
import "@fontsource-variable/public-sans";
import "@/styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swath — cash flow that follows the season",
  description:
    "Swath shows small farms when cash runs low between planting and harvest, so the operating line is set before it's needed.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
