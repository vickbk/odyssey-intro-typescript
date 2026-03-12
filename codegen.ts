import type { CodegenConfig } from "@graphql-codegen/cli";
const config: CodegenConfig = {
  schema: ["./src/**/*.graphql", "./src/**/*.gql"],
  // documents: ["src/**/*.graphql", "src/**/*.gql"],
  generates: {
    "src/app/types/schema.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "./context#DataSourceContext",
      },
    },
    "src/": {
      plugins: ["typescript-resolvers"],
      preset: "near-operation-file",
      presetConfig: {
        path: "../types/",
        extension: ".generated.ts",
        baseTypesPath: "src/app/types/schema.ts",
      },
    },
  },
};
export default config;
