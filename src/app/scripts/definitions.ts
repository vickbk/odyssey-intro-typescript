import { amenityTypesDef, listingDefinitions } from "@/features";
import { addDefinitions, gqlFileLoader } from "@/shared";
import { DocumentNode } from "graphql";

export const typeDefs: DocumentNode[] = addDefinitions(
  gqlFileLoader({
    folder: __dirname,
    files: ["schema.graphql"],
  }),
  listingDefinitions,
  amenityTypesDef,
);
