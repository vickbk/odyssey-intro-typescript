export function resolverWrapper(resolver: Function) {
  return async (
    parent: unknown,
    args: unknown,
    contextValue: unknown,
    info: unknown,
  ) => await resolver({ parent, args, contextValue, info });
}
