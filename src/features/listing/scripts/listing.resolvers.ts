import { Resolvers } from "@/app/types";
import { mergeResolvers } from "@/shared";
import { listingMutations } from "./listing.mutations";
import { listingQueries } from "./listing.queries";
import { specificResolvers } from "./specific.resolvers";

export const listingResolver: Resolvers = mergeResolvers(
  listingQueries,
  listingMutations,
  specificResolvers,
);
