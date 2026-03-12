import { validateFullAmenities } from "@/features";
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

  Mutation: {
    async createListing(_, { input }, { dataSources }) {
      try {
        return {
          code: 200,
          success: true,
          message: "Listing successfully created!",
          listing: await dataSources.listingApi.createListing(input),
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
          listing: null,
        };
      }
    },
  },
};
