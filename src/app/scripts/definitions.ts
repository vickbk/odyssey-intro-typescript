import { gqlFileLoader } from "@/shared";
import { readFileSync } from "fs";
import gql from "graphql-tag";
import path from "path";

export const oldTypeDefs = gql(
  readFileSync(path.resolve(__dirname, "../graphql/schema.graphql"), {
    encoding: "utf-8",
  }),
);

export const typeDefs = gqlFileLoader({
  folder: __dirname,
  files: ["schema.graphql"],
});
