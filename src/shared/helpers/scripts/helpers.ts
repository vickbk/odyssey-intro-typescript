import { Resolver } from "@/app/types";

export function resolverWrapper<T>(resolver: Function): Resolver<T> {
  return async (
    parent: unknown,
    args: unknown,
    contextValue: unknown,
    info: unknown,
  ) => await resolver({ parent, args, contextValue, info });
}
