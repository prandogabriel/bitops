const esbuild = require("esbuild");
const fs = require("node:fs");

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: "node",
    target: "esnext",
    tsconfig: "tsconfig.json",
  })
  .catch(() => process.exit(1));

fs.copyFileSync("src/server/server.cert", "dist/server.cert");
fs.copyFileSync("src/server/server.key", "dist/server.key");