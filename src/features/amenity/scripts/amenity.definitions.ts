import { gqlFileLoader } from "@/shared";

export const amenityTypesDef = gqlFileLoader({
  folder: __dirname,
  files: ["amenity"],
});
