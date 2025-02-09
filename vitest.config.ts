import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const tsconfigPaths = await import("vite-tsconfig-paths");
  return {
    plugins: [tsconfigPaths.default()],
    test: {
      globals: true,
      watch: false,
      environment: "node"
    }
  };
});