import type { CodegenConfig } from "@graphql-codegen/cli";
const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  // documents: ["src/**/*.graphql", "src/**/*.gql"],
  generates: {
    "src/app/types/schema.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    "src/": {
      plugins: ["typescript-resolvers"],
      preset: "near-operation-file",
      presetConfig: {
        // path: "../types/",
        extension: ".generated.ts",
        baseTypesPath: "src/app/types/schema.ts",
      },
    },
  },
};
export default config;
