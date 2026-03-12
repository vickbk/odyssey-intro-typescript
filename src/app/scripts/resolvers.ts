import { validateFullAmenities } from "@/features";
import { resolverWrapper } from "@/shared";
import { Resolvers } from "../types";

export const resolvers: Resolvers = {
  Query: {
    // example using resolverWrapper to get full typing automatically
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

  Listing: {
    amenities: resolverWrapper(
      ({ parent: { id, amenities }, contextValue: { dataSources } }) => {
        return validateFullAmenities(amenities)
          ? amenities
          : dataSources.listingApi.getAmenities(id);
      },
    ),
  },

  Mutation: {
    createListing: resolverWrapper(
      async ({ args: { input }, contextValue: { dataSources } }) => {
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
          };
        }
      },
    ),
  },
};
