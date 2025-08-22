import { AsyncLocalStorage } from "node:async_hooks";
const iteratorsStorage = new AsyncLocalStorage<Iterator<unknown>>();
export function yieldifiedEnv(topLevelGenerator: () => Generator) {
  const iterator = topLevelGenerator();
  iteratorsStorage.run(iterator, () => {
    const { value } = iterator.next();
    if (value instanceof Promise) {
      consumePromise(value,  iterator);
    }
  });
}

function consumePromise(value: Promise<any>, iterator: Generator<unknown, any, any>) {
  value.then((v) => {
    const { value: newValue } = iterator.next(v);
    if (newValue instanceof Promise) {
      consumePromise(newValue, iterator);
    }
  }).catch((e) => iterator.throw(e));
}

// TODO: improve TS of this
export function yieldify(fn: (...args: any) => any) {
  return (...args: any): any => {
    fn(...args, (err: unknown, res: unknown): any => {
      const iterator = iteratorsStorage.getStore();
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
