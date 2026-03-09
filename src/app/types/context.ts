import { ListingApi } from "../datasources/listing-api";

export type DataSourceContext = {
  dataSources: {
    listingApi: ListingApi;
  };
};
