import { listingResolver } from "@/features";
import { mergeResolvers } from "@/shared";
import { Resolvers } from "../types";

export const resolvers: Resolvers = mergeResolvers(listingResolver);
