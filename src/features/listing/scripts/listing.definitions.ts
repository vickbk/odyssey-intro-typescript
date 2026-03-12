import { gqlFileLoader } from "@/shared";

export const listingDefinitions = gqlFileLoader({
  folder: __dirname,
  files: ["create-listing", "listing"],
});
