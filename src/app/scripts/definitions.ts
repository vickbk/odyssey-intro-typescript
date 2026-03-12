import { amenityTypesDef, listingDefinitions } from "@/features";
import { gqlFileLoader } from "@/shared";
import { DocumentNode } from "graphql";

export const typeDefs: DocumentNode[] = [
  ...gqlFileLoader({
    folder: __dirname,
    files: ["schema.graphql"],
  }),
  ...amenityTypesDef,
  ...listingDefinitions,
];
