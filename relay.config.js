module.exports = {
  src: ".",
  schema: "./schema/schema.graphql",
  excludes: ["**/dist/**", "**/node_modules/**", "**/__generated__/**"],
  language: "typescript",
  eagerEsModules: true,
  customScalars: {
    Date: "string",
    URI: "string",
    Long: "number",
  },
};
