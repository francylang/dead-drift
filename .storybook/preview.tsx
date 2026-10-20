import type { Preview } from "@storybook/nextjs-vite";
import "@fontsource/young-serif";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css";
import "../src/styles/tokens.css";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: "error" },
  },
};

export default preview;
