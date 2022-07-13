import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
const url = require('postcss-url');

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
    postcss({ 
        modules: true ,
        plugins:[
            url({
                url: "inline", // enable inline assets using base64 encoding
                maxSize: 30, // maximum file size to inline (in kilobytes)
                fallback: "copy", // fallback method to use if max size is exceeded
            })
        ]
    }),
  ],

  external: ["react", "react-dom",/react\/jsx-runtime/,"mobx-react-lite","react-konva","lodash","mobx",/@szhsin\/*/,"react-tooltip"],
};
