import { Amenity, Resolver } from "@/app/types";

export const validateFullAmenities = (amenityList: Amenity[]) =>
  amenityList.some(hasOwnPropertyName);

const hasOwnPropertyName = (amenity: Amenity): boolean => "name" in amenity;

export function resolverWrapper<T>(resolver: Function): Resolver<T> {
  return async (
    parent: unknown,
    args: unknown,
    contextValue: unknown,
    info: unknown,
  ) => await resolver({ parent, args, contextValue, info });
}
