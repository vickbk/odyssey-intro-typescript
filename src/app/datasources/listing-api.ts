import { RESTDataSource } from "@apollo/datasource-rest";
import { Listing } from "../types/schema";

export class ListingApi extends RESTDataSource {
  baseURL = "https://rt-airlock-services-listing.herokuapp.com/";
  getFeaturedListings() {
    return this.get<Listing[]>("featured-listings");
  }
  getListing(id: string) {
    return this.get<Listing>(`listings/${id}`);
  }
}
