import { resolverWrapper } from "@/shared";

export const resolvers = {
  Query: {
    featuredListings: resolverWrapper(
      async ({ contextValue: { dataSources } }: { contextValue: any }) => {
        return dataSources.listingApi.getFeaturedListings();
      },
    ),
  },
};
