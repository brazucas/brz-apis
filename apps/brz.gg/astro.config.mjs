import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

import react from "@astrojs/react";

export default defineConfig({
  integrations: [tailwind(), react()],
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
  vite: {
    ssr: {
      noExternal: ["path-to-regexp"],
    },
  },
});
