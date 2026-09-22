// react-scripts 5's build chain (terser-webpack-plugin -> schema-utils -> ajv-keywords@5)
// requires ajv@8, but webpack itself needs ajv@6 hoisted at the top level of node_modules,
// and npm (run with legacy-peer-deps, required here for @material-ui/core v4 + React 18)
// never nests a compatible ajv under ajv-keywords on its own — it only hoists the v6 that
// satisfies the plain "dependencies" edge, and ignores ajv-keywords' unmet peerDependency.
// This copies the ajv@8 that schema-utils already carries into the one place it's missing.
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "schema-utils", "node_modules", "ajv");
const dest = path.join(__dirname, "..", "node_modules", "ajv-keywords", "node_modules", "ajv");

if (fs.existsSync(dest)) process.exit(0);

if (!fs.existsSync(src)) {
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
