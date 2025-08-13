import _typescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
// NOTE: remove once this https://github.com/rollup/plugins/pull/1782 is released
const typescript = _typescript as unknown as typeof _typescript.default;

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: {
    yieldify: "./yieldify.ts",
  },
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    typescript({
      emitDeclarationOnly: true,
    }),
  ],
} as RollupOptions;
