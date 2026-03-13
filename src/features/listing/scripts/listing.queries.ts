import { Resolvers } from "@/app/types";
import { resolverWrapper } from "@/shared";

export const listingQueries: Resolvers = {
  Query: {
    featuredListings: resolverWrapper(
      async ({ contextValue: { dataSources } }) =>
        dataSources.listingApi.getFeaturedListings(),
    ),
    listing: resolverWrapper(
      ({
        args: { id },
        contextValue: {
          dataSources: { listingApi },
        },
      }) => listingApi.getListing(id),
    ),
  },
};
