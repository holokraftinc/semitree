import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  // Use React's automatic JSX runtime so component render tests (e.g.
  // renderToStaticMarkup) don't need React in scope. Inert for non-JSX tests.
  esbuild: { jsx: "automatic" },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
