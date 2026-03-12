import { Amenity, Resolver } from "@/app/types";
import { readFileSync } from "fs";
import gql from "graphql-tag";
import path from "path";

export const validateFullAmenities = (amenityList: Amenity[]) =>
  amenityList.some(hasOwnPropertyName);

const hasOwnPropertyName = (amenity: Amenity): boolean => "name" in amenity;

export function resolverWrapper<T>(resolver: Function): Resolver<T> {
  return async (
    parent: unknown,
    args: unknown,
    contextValue: unknown,
    info: unknown,
  ) => await resolver({ parent, args, contextValue, info });
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
 *   * automatically prepends `../graphql/` when no path separator is present
 *   * appends `.gql` if the extension is missing
 *   * returns an array of parsed `DocumentNode` objects suitable for
 *     feeding into Apollo Server, `makeExecutableSchema`, etc.
 *
 * Example
 * ```ts
 * const typeDefs = gqlFileLoader({
 *   files: ["schema", "other-types.gql"],
 *   folder: path.join(__dirname, "../graphql"),
 * });
 * ```
 *
 * The loader caches each file on first read so repeated calls with overlapping
 * inputs are cheap.  It performs all path normalization up front and only
 * calls `readFileSync` once per unique absolute path.
 *
 * @param options.files  list of file names or relative paths
 * @param options.folder base directory to resolve the files from;
 *
 * @returns an array of parsed documents in the same order as `files`
 */
export function gqlFileLoader({
  files,
  folder = __dirname,
}: {
  files: string[];
  folder: string;
}) {
  // resolve the base folder once so we avoid calling path.resolve per file
  const base = path.resolve(folder);

  return files.map((file) => {
    const normalized = normalizeFile(file);
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
 * Make sure a user-supplied filename is in a form we can resolve from disk.
 *
 * Rules:
 *  * if the name does **not** begin with `.` we assume
 *    the file lives in `../graphql` (relative to the caller) and add
 *    that prefix for them.
 *  * if the name already has an extension of `.gql` or `.graphql` we leave it
 *    alone; otherwise we append `.gql`.
 *  * final path components are normalized so Windows/Unix path separators are
 *    handled transparently.
 *
 * Examples:
 *   normalizeFile("schema")          -> "../graphql/schema.gql"
 *   normalizeFile("./schema.gql")    -> "./schema.gql"
 *   normalizeFile("types/extra")     -> "../graphql/types/extra.gql"
 *
 * @param file user-provided filename or relative path
 */
function normalizeFile(file: string) {
  // if the string starts with `.` (./ or ../)
  // we treat it as an explicit path and don’t add our default graphql directory.
  const needsPrefix = !/^\.?\.?[\/\\]/.test(file);
  const prefix = needsPrefix ? path.join("..", "graphql") + path.sep : "";

  const hasExtension = /\.(gql|graphql)$/i.test(file);
  const suffix = hasExtension ? "" : ".gql";

  // path.normalize will fix any mixed separators and collapse `foo/../bar`.
  return path.normalize(prefix + file + suffix);
}
