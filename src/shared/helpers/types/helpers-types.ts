import { Resolver } from "@/app/types";
import { GraphQLResolveInfo } from "graphql";

export type Maybe<T> = T | null;

export type ResolverContext<T> = {
  parent: unknown;
  args: unknown;
  contextValue: { dataSources: T };
  info: unknown;
};

export type AnyResolver = Resolver<any, any, any, any>;
/**
 * A generic alias representing the signature of `resolverWrapper`.  You can
 * use this when you need to reference the type itself (for example, in tests
 * or more advanced helpers).
 *
 * Example:
 * ```ts
 * type FLResolver = ResolverWrapper<
 *   Resolvers['Query']['featuredListings']
 * >;
 * ```
 */
// a small helper for the alias below
export type ResolverParams<T extends AnyResolver> =
  T extends Resolver<any, infer P, infer C, infer A>
    ? {
        parent: P;
        args: A;
        contextValue: C;
        info: GraphQLResolveInfo;
      }
    : never;

export type ResolverFunction<T extends AnyResolver> = (
  params: ResolverParams<T>,
) =>
  | (T extends import("@/app/types").Resolver<infer R, any, any, any>
      ? R
      : never)
  | Promise<
      T extends import("@/app/types").Resolver<infer R, any, any, any>
        ? R
        : never
    >;

export type ResolverWrapper<T extends AnyResolver> = (
  resolver: ResolverFunction<T>,
) => T;

export type NormalizePathParams = {
  file: string;
  graphqlFolder?: string;
  defaultExtension?: ".gql" | ".graphql";
};

export type GQLLoaderParams = Pick<
  NormalizePathParams,
  "defaultExtension" | "graphqlFolder"
> & {
  files: string[];
  folder?: string;
};
