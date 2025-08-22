import { AsyncLocalStorage } from "node:async_hooks";
const generatorsStorage = new AsyncLocalStorage<Generator<unknown, any, any>>();
export function yieldifiedEnv(topLevelGenerator: () => Generator) {
  const generator = topLevelGenerator();
  generatorsStorage.run(generator, () => {
    const { value } = generator.next();
    consumePromise(value, generator);
  });
}

function consumePromise(value: unknown, generator: Generator<unknown, any, any>) {
  if (value instanceof Promise) {
    value.then((v) => {
      const { value: newValue } = generator.next(v);
      if (newValue instanceof Promise) {
        consumePromise(newValue, generator);
      }
    }).catch((e) => generator.throw(e));
  }
}

// TODO: improve TS of this
export function yieldify(fn: (...args: any) => any) {
  return (...args: any): any => {
    fn(...args, (err: unknown, res: unknown): any => {
      const generator = generatorsStorage.getStore();
      if (assertGenerator(generator)) {
        // @ts-ignore FIXME
        if (err) generator.throw(err);
        const { value } = generator.next(res);
        consumePromise(value, generator);
      }
    });
  };
}

function assertGenerator(iter: unknown): iter is Generator<unknown, any, any> {
  if (!iter) {
    throw new Error(
      "`yieldify` must be used in context of generator function that is passed to `yieldifiedEnv`."
    );
  }
  return true;
}
