import { readFileSync } from "fs";
import gql from "graphql-tag";
import path from "path";
import {
  AnyResolver,
  GQLLoaderParams,
  NormalizePathParams,
  ResolverFunction,
  ResolverParams,
} from "../types";

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

// simple in-memory cache keyed by absolute file path so we don't re-read the
// same document over and over.  the key is the resolved path because the
// caller can override `folder`, and normalizing the filename gives us a
// consistent mapping even if consumers pass `foo`, `foo.gql`, or `./foo`.
const fileCache: Record<string, import("graphql").DocumentNode> = {};

/**
 * Loads one or more GraphQL type definitions from disk and parses them with
 * `graphql-tag` (`gql`).
 *
 * The loader is intentionally lightweight:
 *
 *   * accepts an array of file names (relative to `folder`)
 *   * accepts optional `graphqlFolder` and `defaultExtension` parameters so
 *     callers can override the implicit `../graphql` directory and the
 *     default `.gql` suffix used when none is provided.
 *   * appends `.gql` by default, but will also preserve `.graphql` when
 *     specified or selected by the defaultExtension argument.
 *   * returns an array of parsed `DocumentNode` objects suitable for
 *     feeding into Apollo Server, `makeExecutableSchema`, etc.
 *
 * Example
 * ```ts
 * const typeDefs = gqlFileLoader({
 *   files: ["schema", "other-types.gql"],
 *   folder: __dirname,
 *   graphqlFolder: path.join(__dirname, "../schemas"),
 *   defaultExtension: ".graphql",
 * });
 * ```
 *
 * The loader caches each file on first read so repeated calls with overlapping
 * inputs are cheap.  It performs all path normalization up front and only
 * calls `readFileSync` once per unique absolute path.
 *
 * @param options.files        list of file names or relative paths
 * @param options.folder       base directory to resolve the files from;
 * @param options.graphqlFolder directory to prepend when a file has no path;
 *                             defaults to `"../graphql"` relative to
 *                             `folder`.
 * @param options.defaultExtension  extension to append when none exists;
 *                             defaults to `".gql"`.
 *
 * @returns an array of parsed documents in the same order as `files`
 */
export function gqlFileLoader({
  files,
  folder = __dirname,
  // sub‑directory to use when a file name does not include a path
  graphqlFolder = path.join("..", "graphql"),
  // extension to append when none is present (either ".gql" or ".graphql").
  defaultExtension = ".gql",
}: GQLLoaderParams) {
  // resolve the base folder once so we avoid calling path.resolve per file
  const base = path.resolve(folder);

  return files.map((file) => {
    const normalized = normalizePath({ file, graphqlFolder, defaultExtension });
    const absolutePath = path.resolve(base, normalized);

    if (fileCache[absolutePath]) {
      return fileCache[absolutePath];
    }

    const contents = readFileSync(absolutePath, { encoding: "utf-8" });
    const doc = gql(contents);
    fileCache[absolutePath] = doc;
    return doc;
  });
}

/**
 * Normalize a filename into a path that can be resolved from disk.
 *
 * @param params.file             the name or relative path provided by the caller
 * @param params.graphqlFolder    directory to prepend when `file` has no path
 *                                component; relative to the loader's base folder.
 *                                defaults to `"../graphql"` which matches our
 *                                legacy behaviour.
 * @param params.defaultExtension extension to add when `file` lacks one; defaults
 *                                to `".gql"`. Existing `.gql` or `.graphql`
 *                                suffixes are preserved.
 * @returns a normalized path string ready for `path.resolve`
 *
 * Examples:
 *   normalizePath({file: "schema"})
 *     -> "../graphql/schema.gql"
 *   normalizePath({file: "schema", graphFolder: "types"})
 *     -> "types/schema.gql"
 *   normalizePath({file: "foo.graphql", defaultExtension: ".graphql"})
 *     -> "foo.graphql"        // existing extension wins
 */
function normalizePath({
  file,
  graphqlFolder = path.join("..", "graphql"),
  defaultExtension = ".gql",
}: NormalizePathParams) {
  // explicit paths start with `.` or contain a separator. if neither is
  // present we add the folder prefix.
  const needsPrefix = !/^\.?\.?[\/\\]/.test(file) && !file.includes(path.sep);
  const prefix = needsPrefix ? path.join(graphqlFolder) + path.sep : "";

  const hasExtension = /\.(gql|graphql)$/i.test(file);
  const suffix = hasExtension ? "" : defaultExtension;

  return path.normalize(prefix + file + suffix);
}
