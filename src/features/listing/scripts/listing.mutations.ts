import { Resolvers } from "@/app/types";
import { resolverWrapper } from "@/shared";

export const listingMutations: Resolvers = {
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
