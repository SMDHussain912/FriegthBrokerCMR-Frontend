import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
  ]),
  {
    rules: {
      // `no-undef` catches references to identifiers that were never declared
      // or imported. `eslint-config-next` does not enable it, which let
      // `useEffect` be used without an import in
      // `components/load-detail-client.js` and crash the load detail route at
      // runtime (see docs/PRODUCT_ROADMAP.md, finding 2.1).
      //
      // The globals this rule resolves against (browser + node) are already
      // declared by `eslint-config-next`, so no extra configuration is needed.
      "no-undef": "error",
    },
  },
]);

export default eslintConfig;
