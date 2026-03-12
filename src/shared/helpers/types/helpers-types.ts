export type Maybe<T> = T | null;

export type ResolverContext<T> = {
  parent: unknown;
  args: unknown;
  contextValue: { dataSources: T };
  info: unknown;
};

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
