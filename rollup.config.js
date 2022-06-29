import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

const outputDefaults = {
  sourcemap: true,
  globals: { react: "React" },
};

export default {
  input: "./src/index.ts",

  output: [
    {
      file: "./dist/index.cjs.js",
      format: "cjs",
      exports: "default",
      ...outputDefaults,
    },
    {
      file: "./dist/index.esm.js",
      format: "esm",
      ...outputDefaults,
    },
  ],

  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    postcss({ modules: true }),
  ],

  external: ["react", "react-dom"],
};
