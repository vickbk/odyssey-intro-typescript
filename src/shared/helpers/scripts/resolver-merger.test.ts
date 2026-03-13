import { Resolvers } from "@/app/types";
import { mergeResolvers } from "./resolver-merger";

describe("mergeResolvers", () => {
  it("merges resolver maps for the same type key", () => {
    const base: Resolvers = {
      Query: {
        _empty: () => true,
      },
    };

    const additional: Resolvers = {
      Query: {
        featuredListings: () => [],
      },
    };

    const merged = mergeResolvers(base, additional);

    expect(merged.Query).toBeDefined();
    expect(merged.Query?._empty).toBeDefined();
    expect(merged.Query?.featuredListings).toBeDefined();
  });

  it("lets later resolvers override earlier ones", () => {
    const first: Resolvers = {
      Query: {
        _empty: () => true,
      },
    };

    const override: Resolvers = {
      Query: {
        _empty: () => false,
      },
    };

    const merged = mergeResolvers(first, override);

    const callResolver = (resolver: unknown) => {
      if (typeof resolver === "function") {
        return resolver({}, {}, {}, {});
      }
      // If resolver is an object with a `resolve` function (ResolverWithResolve)
      // the TypeScript helper returns it as a union.
      return (resolver as any).resolve({}, {}, {}, {});
    };

    expect(callResolver(merged.Query?._empty)).toBe(false);
  });
});
