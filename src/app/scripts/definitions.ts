import { gqlFileLoader } from "@/shared";

export const typeDefs = [
  ...gqlFileLoader({
    folder: __dirname,
    files: ["schema.graphql"],
  }),
];
