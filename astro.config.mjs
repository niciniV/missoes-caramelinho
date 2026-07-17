// @ts-check
import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";

// Landing page 100% estatica; SolidJS hidrata apenas as ilhas interativas.
export default defineConfig({
  // Configuracao para deploy no GitHub Pages (site de projeto).
  site: "https://projetoecossistemaunilasalle.github.io",
  base: "/sms_canoas",
  integrations: [solid()],
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      // Mantem os assets pequenos inline quando fizer sentido (SVGs, CSS).
      assetsInlineLimit: 4096,
    },
  },
});
