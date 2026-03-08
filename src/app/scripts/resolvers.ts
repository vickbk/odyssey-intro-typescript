import { Resolvers } from "../types/schema";

export const resolvers: Resolvers = {
  Query: {
    // featuredListings: resolverWrapper(
    //   async ({ contextValue: { dataSources } }) => {
    //     return dataSources.listingApi.getFeaturedListings();
    //   },
    // ),
    featuredListings: async (_, __, { dataSources }) => {
      return dataSources.listingApi.getFeaturedListings();
    },
  },
};
