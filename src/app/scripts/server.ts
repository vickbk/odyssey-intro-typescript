import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ListingApi } from "../datasources/listing-api";
import { typeDefs } from "./definitions";
import { resolvers } from "./resolvers";

export async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const { cache } = server;
      return {
        dataSources: {
          listingApi: new ListingApi({ cache }),
        },
      };
    },
  });
  console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}
