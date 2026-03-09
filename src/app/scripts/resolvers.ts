import { validateFullAmenities } from "@/shared";
import { Resolvers } from "../types/schema";

export const resolvers: Resolvers = {
  Query: {
    // featuredListings: resolverWrapper(
    //   async ({ contextValue: { dataSources } }) => {
    //     return dataSources.listingApi.getFeaturedListings();
    //   },
    // ),
    featuredListings: (_, __, { dataSources }) => {
      return dataSources.listingApi.getFeaturedListings();
    },

    listing: (_, { id }, { dataSources }) => {
      return dataSources.listingApi.getListing(id);
    },
  },

  Listing: {
    amenities: ({ id, amenities }, _, { dataSources }) => {
      return validateFullAmenities(amenities)
        ? amenities
        : dataSources.listingApi.getAmenities(id);
    },
  },
};
