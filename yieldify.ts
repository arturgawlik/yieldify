let iterator: Iterator<unknown>;
export function yieldifiedEnv(topLevelGenerator: () => Generator) {
  iterator = topLevelGenerator();
  iterator.next();
}
// TODO: improve TS of this
export function yieldify(fn: (...args: any) => any) {
  return (...args: any): any => {
    fn(...args, (err: unknown, res: unknown): any => {
      if (assertIterator(iterator)) {
        // @ts-ignore FIXME
        if (err) iterator.throw(err);
        iterator.next(res);
      }
    });
  };
}

function assertIterator(iter: unknown): iter is Iterator<unknown> {
  if (!iter) {
    throw new Error(
      "`yieldify` must be used in context of generator function that is passed to `yieldifiedEnv`."
    );
  }
  return true;
}
