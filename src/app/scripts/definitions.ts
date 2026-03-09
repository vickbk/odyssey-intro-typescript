import { readFileSync } from "fs";
import gql from "graphql-tag";
import path from "path";

export const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "../graphql/schema.graphql"), {
    encoding: "utf-8",
  }),
);
