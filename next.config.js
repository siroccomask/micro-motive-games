/** @type {import("next").NextConfig} */
process.env.BAML_LOG ??= "warn";

const { withBaml } = require("@boundaryml/baml-nextjs-plugin");

module.exports = withBaml()({
  devIndicators: false,
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
});
