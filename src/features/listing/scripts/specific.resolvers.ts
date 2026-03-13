import { Resolvers } from "@/app/types";
import { validateFullAmenities } from "@/features/amenity";
import { resolverWrapper } from "@/shared";

export const specificResolvers: Resolvers = {
  Listing: {
    amenities: resolverWrapper(
      ({ parent: { id, amenities }, contextValue: { dataSources } }) => {
        return validateFullAmenities(amenities)
          ? amenities
          : dataSources.listingApi.getAmenities(id);
      },
    ),
  },
};
