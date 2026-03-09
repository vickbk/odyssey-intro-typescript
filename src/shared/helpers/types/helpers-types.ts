export type Maybe<T> = T | null;
export type ResolverContext<T> = {
  parent: unknown;
  args: unknown;
  contextValue: { dataSources: T };
  info: unknown;
};
