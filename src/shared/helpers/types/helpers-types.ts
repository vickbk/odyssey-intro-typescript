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
