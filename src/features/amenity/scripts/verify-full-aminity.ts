import { Amenity } from "@/app/types";

export const validateFullAmenities = (amenityList: Amenity[]) =>
  amenityList.some(hasOwnPropertyName);

const hasOwnPropertyName = (amenity: Amenity): boolean => "name" in amenity;
