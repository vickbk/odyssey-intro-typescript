import { Resolvers } from "@/app/types";

function mergeResolverField<K extends keyof Resolvers>(
  current: Resolvers[K] | undefined,
  next: Resolvers[K] | undefined,
): Resolvers[K] {
  return {
    ...(current ?? {}),
    ...(next ?? {}),
  } as Resolvers[K];
}

export function mergeResolvers(...resolvers: Resolvers[]) {
  const merged: Partial<Resolvers> = {};
  const mergedRecord = merged as Record<keyof Resolvers, unknown>;

  resolvers.forEach((resolver) => {
    const keys = Object.keys(resolver) as (keyof Resolvers)[];
    keys.forEach((key) => {
      mergedRecord[key] = mergeResolverField(merged[key], resolver[key]);
    });
  });

  return merged as Resolvers;
}
