import { RESTDataSource } from "@apollo/datasource-rest";
import { Amenity, CreateListingInput, Listing } from "../types";

export class ListingApi extends RESTDataSource {
  baseURL = "https://rt-airlock-services-listing.herokuapp.com/";

  getFeaturedListings() {
    return this.get<Listing[]>("featured-listings");
  }

  getListing(id: string) {
    return this.get<Listing>(`listings/${id}`);
  }

  getAmenities(listingId: string) {
    console.log("Making a follow-up call for amenities with ", listingId);
    return this.get<Amenity[]>(`listings/${listingId}/amenities`);
  }

  createListing(listing: CreateListingInput) {
    return this.post<Listing>("listings", {
      body: { listing },
    });
  }
}
