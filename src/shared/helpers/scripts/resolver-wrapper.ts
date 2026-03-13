import { AnyResolver, ResolverFunction, ResolverParams } from "../types";

/**
 * Helper to adapt a simple object-style resolver into the form expected by
 * Apollo's schema.  The main advantage over writing the "long" version is
 * that consumers can destructure the four resolver arguments and still get
 * full type safety by providing a generic parameter corresponding to one of
 * the generated `Resolvers` field types (e.g.
 * `Resolvers['Query']['featuredListings']`).
 *
 * The wrapper infers the correct argument and return types from the generic
 * so callers no longer need to manually repeat them.
 *
 * ```ts
 * featuredListings: resolverWrapper<
 *   Resolvers['Query']['featuredListings']
 *>(
 *   async ({ contextValue: { dataSources } }) =>
 *     dataSources.listingApi.getFeaturedListings(),
 * );
 * ```
 *
 * @param resolver  function receiving a single object with the standard
 *                  resolver params (parent, args, contextValue, info)
 * @returns a function matching the corresponding `Resolver<...>` type
 */
/**
 * Internal helper used by `resolverWrapper` to convert a generated resolver
 * type into the single-object argument shape the wrapper accepts.
 */

export function resolverWrapper<T extends AnyResolver>(
  resolver: ResolverFunction<T>,
): T {
  return ((parent, args, contextValue, info) =>
    resolver({
      parent,
      p: parent,
      args,
      a: args,
      contextValue,
      c: contextValue,
      info,
      i: info,
    } as unknown as ResolverParams<T>)) as T;
}
